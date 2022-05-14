import logger from "../logger";
import mongoose, {
  ClientSession,
  Document,
  isValidObjectId,
  Model,
  ObjectId,
} from "mongoose";
import { MongoError } from "mongodb";
import _ from "lodash";
import { IMember } from "../models/Member";
import { IProject } from "../models/Project";
import { IUser } from "../models/User";
import { ITech } from "../models/Tech";
import { IComment } from "../models/Comment";
import { ICommentLike } from "../models/CommentLike";
import { ICommentDislike } from "../models/CommentDislike";
import NotFoundError from "./errors/NotFoundError";
import UnexpectedError from "./errors/UnexpectedError";
import UnauthorizedError from "./errors/UnauthorizedError";
import FieldExistsError from "./errors/FieldExistsError";
import InvalidChangeLastOwner from "./errors/InvalidChangeLastOwner";

import {
  createAddedFields,
  createJoins,
  createProjection,
  createProjectionById,
  createQuery,
  mergeResults,
} from "./projects/searchHelpers";
import { TechDoc } from "./TechController";
import { ISearch } from "../models/Search";

export interface ProjectUpdateParams {
  name?: string;
  description?: string;
  techs?: string[];
}

export interface MemberUpdateParams {
  user: string; // valid ObjectId
  roleName: string;
}

export type ProjectDoc = IProject & Document<unknown, any, IProject>;
export type CommentDoc = IComment & Document<unknown, any, IProject>;
export type MemberDoc = IMember & Document<unknown, any, IProject>;

export type MatchType = {
  name: boolean;
  description: boolean;
  techs: boolean;
};

export type ProjectSearchResultItem = {
  id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  techs: (ITech & { id: ObjectId })[];
  members: (IMember & { id: ObjectId })[];
  matchType: MatchType;
};

export type ProjectItem = {
  id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  techs: (ITech & { id: ObjectId })[];
  members: (IMember & { id: ObjectId })[];
};

interface SaveSearchParams {
  query: string;
  nameMatches: ProjectSearchResultItem[];
  descriptionMatches: ProjectSearchResultItem[];
  techMatches: ProjectSearchResultItem[];
  matchedTechs: TechDoc[];
  mergedCount: number;
  totalCount: number;
  timeElapsedMs: number;
  user?: ObjectId;
}

class ProjectController {
  constructor(
    private projectModel: Model<IProject>,
    private userModel: Model<IUser>,
    private memberModel: Model<IMember>,
    private commentModel: Model<IComment>,
    private commentLikeModel: Model<ICommentLike>,
    private commentDislikeModel: Model<ICommentDislike>,
    private techModel: Model<ITech>,
    private searchModel: Model<ISearch>,
    private createSession: () => Promise<ClientSession>
  ) {}

  async getById(id: string): Promise<any> {
    // const project = await this.projectModel
    //   .findOne({ _id: id })
    //   .populate("techs");
    const project = await this.projectModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      ...createJoins(),
      createProjectionById(),
      { $limit: 1 },
    ]);
    if (project.length === 0) {
      throw new NotFoundError("project", id);
    }

    return project[0];
  }

  async getByName(name: string): Promise<ProjectDoc> {
    const query = {
      name: new RegExp(`^${name}$`, "i"),
    };
    const project = await this.projectModel.findOne(query).populate("techs");
    if (!project) {
      throw new NotFoundError("project", name);
    }
    return project;
  }

  async searchProjects(
    search: string,
    user?: ObjectId
  ): Promise<ProjectSearchResultItem[]> {
    const start = Date.now();

    const nameMatches: ProjectSearchResultItem[] =
      await this.projectModel.aggregate([
        createQuery({
          name: { $regex: search, $options: "i" },
        }),
        { $limit: 20 },
        ...createJoins(),
        createProjection(),
        createAddedFields({
          name: true,
        }),
      ]);

    const descriptionMatches: ProjectSearchResultItem[] =
      await this.projectModel.aggregate([
        createQuery({
          description: { $regex: search, $options: "i" },
        }),
        { $limit: 20 },
        ...createJoins(),
        createProjection(),
        createAddedFields({
          description: true,
        }),
      ]);

    const techs: TechDoc[] = await this.techModel.find({
      name: { $regex: search, $options: "i" },
    });

    const techMatches: ProjectSearchResultItem[] =
      await this.projectModel.aggregate([
        createQuery({
          techs: { $in: techs.map((t) => t._id) },
        }),
        { $limit: 20 },
        ...createJoins(),
        createProjection(),
        createAddedFields({
          techs: true,
        }),
      ]);

    const total = [...nameMatches, ...descriptionMatches, ...techMatches];
    const merged = mergeResults(total);
    const timeElapsedMs = Date.now() - start;

    this.saveSearch({
      query: search,
      nameMatches,
      descriptionMatches,
      techMatches,
      matchedTechs: techs,
      mergedCount: merged.length,
      totalCount: total.length,
      timeElapsedMs,
      user,
    });

    logger.info("[project_search_stat]", {
      search,
      timeElapsedMs,
      total: total.length,
      merged: merged.length,
      techsFound: techs.length,
      techMatchesLength: techMatches.length,
      nameMatchesLength: nameMatches.length,
      descriptionMatchesLength: descriptionMatches.length,
    });

    return merged;
  }

  // Tracks searches, so this method should be as lightweight as possible.
  saveSearch(params: SaveSearchParams) {
    // Run this asynchronously so that it does not block the request.
    setTimeout(() => this.saveSearchSafe(params));
  }

  /**
   * saveSearchSafe suppresses exceptions by catching, logging, and moving on
   * so that it does not fail the caller.
   */
  async saveSearchSafe(params: SaveSearchParams) {
    try {
      const search = await this.searchModel.create({
        query: params.query,
        nameMatchesProjects: params.nameMatches.map((p) => p.id),
        descriptionMatchesProjects: params.descriptionMatches.map((p) => p.id),
        techMatchesProjects: params.techMatches.map((p) => p.id),
        matchedTechs: params.matchedTechs.map((t) => t._id),
        mergedCount: params.mergedCount,
        totalCount: params.totalCount,
        timeElapsedMs: params.timeElapsedMs,
        user: isValidObjectId(params.user) ? params.user : null,
      });
      logger.info("Search saved " + search._id, {
        searchId: search._id,
      });
    } catch (err: any) {
      logger.error("Failed to save search!!", {
        errorMessage: err.message,
        params,
      });
    }
  }

  async lookup(pageSize: number): Promise<ProjectDoc[]> {
    const projects = await this.projectModel.aggregate([
      { $limit: pageSize },
      { $sort: { updatedAt: -1 } },
      ...createJoins(),
      createProjection(),
    ]);

    return projects;
  }

  public async addComment(comment: IComment) {
    await this.commentModel.create(comment);
  }

  public async editComment(comment: IComment) {
    await this.commentModel.findOneAndUpdate(
      { _id: comment.id },
      {
        $set: {
          commentText: comment.commentText,
        },
      }
    );
  }

  public async deleteComment(comment: IComment) {
    await this.commentModel.findOneAndUpdate(
      {
        _id: comment.id,
      },
      { deleted: true }
    );
  }

  public async likeComment(comment: IComment, user: IUser, project: IProject) {
    await this.commentModel.findOneAndUpdate(
      {
        _id: comment.id,
      },
      {
        $push: { likes: user.id },
      }
    );
    await this.commentLikeModel.create({
      project: project.id,
      user: user.id,
      comment: comment.id,
    });
  }

  public async removeCommentLike(comment: IComment, user: IUser) {
    await this.commentModel.findOneAndUpdate(
      { _id: comment.id },
      {
        $pull: { likes: user.id },
      }
    );
    await this.commentLikeModel.deleteOne({
      comment: comment.id,
      user: user.id,
    });
  }

  public async dislikeComment(
    comment: IComment,
    user: IUser,
    project: IProject
  ) {
    await this.commentModel.findOneAndUpdate(
      {
        _id: comment.id,
      },
      {
        $push: { dislikes: user.id },
      }
    );
    await this.commentDislikeModel.create({
      project: project.id,
      user: user.id,
      comment: comment.id,
    });
  }

  public async removeCommentDislike(comment: IComment, user: IUser) {
    await this.commentModel.findOneAndUpdate(
      { _id: comment.id },
      {
        $pull: { dislikes: user.id },
      }
    );
    await this.commentDislikeModel.deleteOne({
      comment: comment.id,
      user: user.id,
    });
  }

  public async getComments(projectId: string) {
    const comments = await this.commentModel
      .aggregate([
        { $match: { project: new mongoose.Types.ObjectId(projectId) } },
        {
          $lookup: {
            from: "commentlikes",
            localField: "_id",
            foreignField: "comment",
            as: "likess",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: "$_id",
                  project: 1,
                  user: 1,
                  comment: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "commentdislikes",
            localField: "_id",
            foreignField: "comment",
            as: "dislikess",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: "$_id",
                  project: 1,
                  user: 1,
                  comment: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: "$_id",
                  githubId: 1,
                  isAdmin: 1,
                  avatarUrl: 1,
                  username: 1,
                  displayName: 1,
                  techs: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            project: 1,
            user: { $arrayElemAt: ["$user", 0] },
            depth: 1,
            commentText: 1,
            likes: 1,
            dislikes: 1,
            likess: 1,
            deleted: 1,
            parentId: 1,
            postedDate: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
      .sort({ postedDate: 1 })
      .then((comments) => {
        comments.map(async (c) => {
          if (c.likess) c.likess = c.likess.map((l: any) => l.user);
          if (c.dislikess) c.dislikess = c.dislikess.map((l: any) => l.user);
        });

        let rec = (comment: IComment, threads: any) => {
          for (var thread in threads) {
            var value = threads[thread];

            if (thread.toString() === comment.parentId!.toString()) {
              value.children[comment.id!] = comment;
              return;
            }

            if (value.children) {
              rec(comment, value.children);
            }
          }
        };
        let threads = {} as any,
          comment: any;

        for (let i = 0; i < comments.length; i++) {
          comment = comments[i];

          comment["children"] = {};
          let parentId = comment.parentId;
          if (!parentId) {
            const idString = comment.id!.toString();
            threads[idString] = comment;
            continue;
          }
          rec(comment, threads);
        }

        return {
          count: comments.length,
          comments: threads,
        };
      });
    return comments;
  }

  public async findUserProjects(userId: string): Promise<ProjectDoc[]> {
    let userMembers = await this.memberModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$project" } },
      { $group: { _id: null, projects: { $push: "$_id" } } },
    ]);

    userMembers = userMembers[0].projects;

    let userProjects = await this.projectModel.aggregate([
      {
        $match: {
          _id: { $in: userMembers },
        },
      },
      ...createJoins(),
      createProjection(),
    ]);
    return userProjects;
  }
  public async findUserProjectsByTech(
    userId: string,
    techId: string
  ): Promise<ProjectDoc[]> {
    const userMembers = await this.memberModel.find({ user: userId });

    const userMembersIds = userMembers.map((m: any) => m.project);
    // The `.map` turns the list of objects into a list of project IDs

    let userProjects = await this.projectModel.find({
      _id: { $in: userMembersIds },
      techs: techId,
    });

    return userProjects;
  }

  // Creating a project involves associating its creator.
  // params: fields to create the project with
  // firstOwnerId: user ID of the project's first owner
  async create(
    params: ProjectUpdateParams,
    firstOwnerId: string
  ): Promise<ProjectDoc> {
    const user = await this.userModel.findOne({ _id: firstOwnerId });
    if (!user) {
      throw new NotFoundError("user", firstOwnerId);
    }

    const session = await this.createSession();
    let project: null | ProjectDoc = null;

    try {
      await session.withTransaction(async () => {
        const created: ProjectDoc[] = await this.projectModel.create([params], {
          session,
        });

        if (created.length !== 1) {
          throw new Error(
            "Unexpected project creation count=" + created.length
          );
        }

        project = created[0];

        const members = await this.memberModel.create(
          [
            {
              project: project._id,
              user: firstOwnerId,
              roleName: "owner",
            },
          ],
          { session }
        );

        if (members.length !== 1) {
          throw new UnexpectedError(
            "Expected the first member to be created as owner"
          );
        }

        const owner = members[0];

        logger.info("created project", {
          project: project.toJSON(),
          owner: owner.toJSON(),
        });
      });

      if (!project) {
        throw new UnexpectedError("Expected project to exist after creation!");
      } else {
        session.endSession();
        // Populate techs data after session ends.
        await (project as ProjectDoc).populate("techs");
        return project;
      }
    } catch (err) {
      if (
        err instanceof MongoError &&
        err.code === 11000 &&
        (err as any).keyPattern["name"] === 1
      ) {
        throw new FieldExistsError("name");
      } else {
        throw err;
      }
    } finally {
      logger.debug("Ending session");
      session.endSession();
    }
  }

  // Updating a project requires an admin or project owner.
  // id: project ID
  // updater: updater's user ID
  // params: fields to create the project with
  // isAdmin: whether the user is an admin or not
  async update(
    id: string,
    updater: string,
    params: ProjectUpdateParams,
    isAdmin?: boolean
  ) {
    isAdmin = isAdmin || false;

    if (!isAdmin) {
      const member = await this.memberModel.findOne({
        project: id,
        user: updater,
      });

      if (!member || member.roleName !== "owner") {
        throw new UnauthorizedError("Updater must be an owner");
      }
    }

    try {
      const project = await this.projectModel
        .findOneAndUpdate({ _id: id }, params, { new: true })
        .populate("techs");
      if (!project) {
        throw new NotFoundError("project", id);
      }
      return project;
    } catch (err: any) {
      if (
        err instanceof MongoError &&
        err.code === 11000 &&
        (err as any).keyPattern["name"] === 1
      ) {
        throw new FieldExistsError("name");
      } else {
        throw err;
      }
    }
  }

  async getMembers(id: string) {
    const members = await this.memberModel
      .find({ project: id })
      .populate("project")
      .populate("user");
    return members;
  }

  async getMemberByUserId(project: string, user: string) {
    const member = await this.memberModel
      .findOne({ project, user })
      .populate("project")
      .populate("user");
    if (null === member) {
      throw new NotFoundError("member", user);
    }
    return member;
  }

  /**
   * @param project ID of the project.
   * @param user ID of the user to associate as a member of the project.
   */
  private async validateProjectUserExists(project: string, user: string) {
    const projectDoc = await this.projectModel.findOne({ _id: project });
    if (null === projectDoc) {
      throw new NotFoundError("project", project);
    }

    const userDoc = await this.userModel.findOne({ _id: user });
    if (null === userDoc) {
      throw new NotFoundError("user", user);
    }
  }

  /**
   * @param project ID of the project.
   * @param user ID of the user making the update.
   * @param isAdmin Boolean of whether the user is an admin.
   */
  private async validateMemberUpdatePermission(
    project: string,
    user: string,
    isAdmin?: boolean
  ) {
    isAdmin = isAdmin || false;

    if (!isAdmin) {
      const member = await this.memberModel.findOne({
        project,
        user,
      });

      if (!member || member.roleName !== "owner") {
        throw new UnauthorizedError("Updater must be an owner");
      }
    }
  }

  public async addStarrer(user: string, projectId: string) {
    await this.projectModel.updateOne(
      { _id: projectId },
      { $addToSet: { starrers: user } }
    );
  }

  public async removeStarrer(user: string, projectId: string) {
    await this.projectModel.updateOne(
      { _id: projectId },
      { $pull: { starrers: user } }
    );
  }
  // Get all projects current user starred
  public async getStarred(user: string) {
    const starred = await this.projectModel.aggregate([
      {
        $match: {
          $expr: { $in: [new mongoose.Types.ObjectId(user), "$starrers"] },
        },
      },
    ]);
    return starred;
  }

  /**
   * Updating a member requires an admin or project owner.
   * id: project ID
   * updater: updater's user ID
   * params: fields to create the project with
   * isAdmin: whether the user is an admin or not
   * @throws NotFoundError {errors: ["project_not_found"]}
   * @throws UnauthorizedError {errors: ["unauthorized"]}
   * @throws InvalidChangeLastOwner {errors: ["invalid_change_last_owner"]}
   */
  public async updateMember(
    id: string,
    updater: string,
    params: MemberUpdateParams,
    isAdmin?: boolean
  ) {
    await this.validateProjectUserExists(id, params.user);
    await this.validateMemberUpdatePermission(id, updater, isAdmin);

    const session = await this.createSession();
    let member: null | Document<IMember> = null;

    try {
      await session.withTransaction(async () => {
        member = await this.memberModel.findOneAndUpdate(
          {
            project: id,
            user: params.user,
          },
          {
            project: id,
            ...params,
          },
          {
            new: true,
            upsert: true,
            session,
          }
        );

        const owners = await this.memberModel.find(
          {
            project: id,
            roleName: "owner",
          },
          null,
          { session }
        );

        if (owners.length < 1) {
          throw new InvalidChangeLastOwner("Cannot remove remaining owner!");
        }
      });
    } finally {
      session.endSession();
    }

    if (null !== member) {
      await (member as Document<IMember>).populate("project");
      await (member as Document<IMember>).populate("user");
      return member;
    } else {
      throw new UnexpectedError("Expected member to be updated");
    }
  }

  /**
   * Removing a member requires an admin or project owner.
   * id: project ID
   * updater: updater's user ID
   * user: user ID of the member to remove
   * isAdmin: whether the user is an admin or not
   * @throws NotFoundError {errors: ["project_not_found"]}
   * @throws UnauthorizedError {errors: ["unauthorized"]}
   * @throws InvalidChangeLastOwner {errors: ["invalid_change_last_owner"]}
   */
  public async removeMember(
    id: string,
    updater: string,
    user: string,
    isAdmin?: boolean
  ) {
    await this.validateProjectUserExists(id, user);
    await this.validateMemberUpdatePermission(id, updater, isAdmin);

    const session = await this.createSession();
    let member: null | Document<IMember> = null;

    try {
      await session.withTransaction(async () => {
        member = await this.memberModel.findOneAndDelete(
          { project: id, user },
          { session }
        );

        const owners = await this.memberModel.find(
          {
            project: id,
            roleName: "owner",
          },
          null,
          { session }
        );

        if (owners.length < 1) {
          throw new InvalidChangeLastOwner("Cannot remove remaining owner!");
        }
      });
    } finally {
      session.endSession();
    }

    if (null !== member) {
      await (member as Document<IMember>).populate("project");
      await (member as Document<IMember>).populate("user");
      return member;
    } else {
      throw new UnexpectedError("Expected member to be updated");
    }
  }
}

export default ProjectController;

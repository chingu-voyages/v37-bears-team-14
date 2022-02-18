import logger from "../logger";
import { ClientSession, Document, Model, Collection } from "mongoose";
import { MongoError } from "mongodb";
import { IMember } from "../models/Member";
import { IProject } from "../models/Project";
import { IUser } from "../models/User";
import NotFoundError from "./errors/NotFoundError";
import UnexpectedError from "./errors/UnexpectedError";
import UnauthorizedError from "./errors/UnauthorizedError";
import FieldExistsError from "./errors/FieldExistsError";
import projects from "../routes/projectRouter";

export interface ProjectUpdateParams {
  name?: string;
  description?: string;
  techs?: string[];
}

export type ProjectDoc = IProject & Document<unknown, any, IProject>;

class ProjectController {
  constructor(
    private projectModel: Model<IProject>,
    private userModel: Model<IUser>,
    private memberModel: Model<IMember>,
    private createSession: () => Promise<ClientSession>
  ) {}

  async getById(id: string): Promise<ProjectDoc> {
    const project = await this.projectModel
      .findOne({ _id: id })
      .populate("techs");
    if (!project) {
      throw new NotFoundError("project", id);
    }
    return project;
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

  // Updating a project involves requires an admin or project owner.
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
}

export default ProjectController;

import { pick } from "lodash";
import { Document, Model } from "mongoose";
import { IApplication } from "../models/Application";
import { IMember } from "../models/Member";
import { IProject } from "../models/Project";
import { IUser } from "../models/User";
import MemberAlreadyExistsError from "./errors/MemberAlreadyExistsError";
import NotFoundError from "./errors/NotFoundError";
import PendingApplicationExistsError from "./errors/PendingApplicationExistsError";
import UnauthorizedError from "./errors/UnauthorizedError";

export type ApplicationDoc = IApplication &
  Document<unknown, any, IApplication>;

export interface CreateApplicationParams {
  project: string;
  user: string;
  content?: string;
  requestedRole?: string;
}

export interface UpdateApplicationParams {
  status?: string;
  content?: string;
  requestedRole?: string;
}

export interface LookupProjectApplicationsParams {
  project: string;
  status?: string;
}

export interface LookupUserApplicationsParams {
  user: string;
  status?: string;
}

class ApplicationController {
  constructor(
    private applicationModel: Model<IApplication>,
    private projectModel: Model<IProject>,
    private userModel: Model<IUser>,
    private memberModel: Model<IMember>
  ) {}

  async createApplication(
    userId: string,
    params: CreateApplicationParams
  ): Promise<ApplicationDoc> {
    if (userId !== params.user) {
      throw new UnauthorizedError("User is not submitter");
    }

    const project = await this.projectModel.findOne({ _id: params.project });
    const user = await this.userModel.findOne({ _id: params.user });
    if (!project) {
      throw new NotFoundError("project", params.project);
    }
    if (!user) {
      throw new NotFoundError("user", params.user);
    }

    const member = await this.memberModel.findOne(
      pick(params, ["project", "user"])
    );
    if (null !== member) {
      throw new MemberAlreadyExistsError();
    }

    const existing = await this.applicationModel.findOne({
      status: "pending",
      ...pick(params, ["project", "user"]),
    });
    if (null !== existing) {
      throw new PendingApplicationExistsError();
    }

    const application = await this.applicationModel.create(params);
    await application.populate("project");
    await application.populate("user");
    return application;
  }

  async updateApplication(
    id: string,
    updaterUserId: string,
    params: UpdateApplicationParams
  ) {
    const application = await this.applicationModel.findOne({ _id: id });
    if (!application) {
      throw new NotFoundError("application", id);
    }

    let isChanged = false;

    if (params.status) {
      // check is user owner of project
      const member = await this.memberModel.findOne({
        project: application.project,
        user: updaterUserId,
      });
      if (!member || member.roleName !== "owner") {
        throw new UnauthorizedError("User is not a project owner");
      }
      application.status = params.status;
      isChanged = true;
    }

    if (params.content) {
      if (updaterUserId !== application.user.toString()) {
        throw new UnauthorizedError("User is not submitter");
      }
      application.content = params.content;
      isChanged = true;
    }

    if (params.requestedRole) {
      if (updaterUserId !== application.user.toString()) {
        throw new UnauthorizedError("User is not submitter");
      }
      application.requestedRole = params.requestedRole;
      isChanged = true;
    }

    if (isChanged) {
      await application.save();
    }

    await application.populate("project");
    await application.populate("user");
    return application;
  }

  async getById(id: string): Promise<ApplicationDoc> {
    const application = await this.applicationModel.findOne({ _id: id });
    if (!application) {
      throw new NotFoundError("application", id);
    }

    await application.populate("project");
    await application.populate("user");
    return application;
  }

  async lookup(
    viewerUserId: string,
    params: LookupProjectApplicationsParams | LookupUserApplicationsParams,
    pageSize: number,
    greaterThanId?: string
  ): Promise<ApplicationDoc[]> {
    const query: Record<string, any> = pick(params, [
      "project",
      "user",
      "status",
    ]);

    if (greaterThanId) {
      query["_id"] = {
        $gt: greaterThanId,
      };
    }

    // TODO: check lookup parameters for permissions against viewerUserId

    const applications = await this.applicationModel
      .find(query)
      .sort("_id")
      .limit(pageSize)
      .populate("project")
      .populate("user");

    return applications;
  }
}

export default ApplicationController;

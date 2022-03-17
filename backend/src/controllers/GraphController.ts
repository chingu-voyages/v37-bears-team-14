import { Model } from "mongoose";
import { IMember } from "../models/Member";
import { IProject } from "../models/Project";
import { IUser } from "../models/User";
import { ITech } from "../models/Tech";
import NotFoundError from "./errors/NotFoundError";
import {
  Graph,
  NodeType,
  createProjectNode,
  createTechNode,
  createUserNode,
  createMemberEdgeUser,
  createMemberEdgeProject,
  createUsesEdge,
  parseNid,
} from "./graph";
import { ProjectDoc } from "./ProjectController";
import { TechDoc } from "./TechController";
import { UserRecord } from "./UserController";

class GraphController {
  constructor(
    private projectModel: Model<IProject>,
    private memberModel: Model<IMember>,
    private userModel: Model<IUser>,
    private techModel: Model<ITech>
  ) {}

  async getGraph(nid: string): Promise<Graph> {
    const [type, id] = parseNid(nid);
    if (type === NodeType.PROJECT) {
      return this.getProjectGraph(nid);
    } else if (type === NodeType.USER) {
      return this.getUserGraph(nid);
    } else if (type === NodeType.TECH) {
      return this.getTechGraph(nid);
    }
    throw new Error("Unrecognized nid type");
  }

  async getProjectGraph(nid: string): Promise<Graph> {
    const [_, id] = parseNid(nid);

    const project = await this.projectModel
      .findOne({ _id: id })
      .populate("techs");
    if (!project) {
      throw new NotFoundError("node", nid);
    }

    const members = await this.memberModel
      .find({ project: id })
      .populate("user");

    const userNodes = members.map((m) => createUserNode(m.user as UserRecord));
    const techNodes = project.techs.map((t) => createTechNode(t as TechDoc));

    const userEdges = members.map((m) => createMemberEdgeUser(nid, m));
    const techEdges = project.techs.map((t) =>
      createUsesEdge(nid, t as TechDoc)
    );

    return {
      nodes: [createProjectNode(project), ...userNodes, ...techNodes],
      edges: [...userEdges, ...techEdges],
    };
  }

  async getUserGraph(nid: string): Promise<Graph> {
    const [_, id] = parseNid(nid);

    const user = await this.userModel.findOne({ _id: id }).populate("techs");
    if (!user) {
      throw new NotFoundError("node", nid);
    }

    const members = await this.memberModel
      .find({ user: id })
      .populate("project");

    const projectNodes = members
      .filter((m) => m.project !== null)
      .map((m) => createProjectNode(m.project as ProjectDoc));
    const techNodes = (user.techs as TechDoc[]).map((t) =>
      createTechNode(t as TechDoc)
    );

    const projectEdges = members
      .filter((m) => m.project !== null)
      .map((m) => createMemberEdgeProject(nid, m));
    const techEdges = (user.techs as TechDoc[])
      .filter((t) => t !== null)
      .map((t) => createUsesEdge(nid, t as TechDoc));

    return {
      nodes: [createUserNode(user as any), ...projectNodes, ...techNodes],
      edges: [...projectEdges, ...techEdges],
    };
  }

  async getTechGraph(nid: string): Promise<Graph> {
    const [_, id] = parseNid(nid);
    const tech = await this.techModel.findOne({ _id: id });
    if (!tech) {
      throw new NotFoundError("node", nid);
    }

    const projects = await this.projectModel.find({ techs: id });
    const users = await this.userModel.find({ techs: id });

    const projectEdges = projects.map((p) =>
      createUsesEdge("P_" + p._id, tech)
    );
    const userEdges = users.map((u) => createUsesEdge("U_" + u._id, tech));

    return {
      nodes: [
        createTechNode(tech),
        ...projects.map((p) => createProjectNode(p)),
        ...users.map((u) => createUserNode(u as any)),
      ],
      edges: [...projectEdges, ...userEdges],
    };
  }
}

export default GraphController;

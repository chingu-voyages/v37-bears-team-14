import { Model } from "mongoose";
import { IMember } from "../models/Member";
import { IProject } from "../models/Project";
import { IUser } from "../models/User";
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
    private userModel: Model<IUser>
  ) {}

  async getGraph(nid: string): Promise<Graph> {
    const [type, id] = parseNid(nid);
    if (type === NodeType.PROJECT) {
      return this.getProjectGraph(nid);
    } else if (type === NodeType.USER) {
      return this.getUserGraph(nid);
    }
    // else if (type === NodeType.TECH) {
    // }
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

    const members = await this.memberModel.find({ user: id }).populate("project");

    const projectNodes = members.filter((m) => m.project !== null).map((m) =>
      createProjectNode(m.project as ProjectDoc)
    );
    const techNodes = (user.techs as TechDoc[]).map((t) => createTechNode(t as TechDoc));

    const projectEdges = members.filter((m) => m.project !== null).map((m) => createMemberEdgeProject(nid, m));
    const techEdges = (user.techs as TechDoc[]).filter((t) => t !== null).map((t) => createUsesEdge(nid, t as TechDoc));

    return {
      nodes: [createUserNode(user as any), ...projectNodes, ...techNodes],
      edges: [...projectEdges, ...techEdges],
    };
  }
}

export default GraphController;

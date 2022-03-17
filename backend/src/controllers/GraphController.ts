import { Model } from "mongoose";
import { IMember } from "../models/Member";
import { IProject } from "../models/Project";
import NotFoundError from "./errors/NotFoundError";
import {
  Graph,
  NodeType,
  createProjectNode,
  createTechNode,
  createUserNode,
  createMemberEdge,
  createUsesEdge,
  parseNid,
} from "./graph";
import { TechDoc } from "./TechController";
import { UserRecord } from "./UserController";

class GraphController {
  constructor(
    private projectModel: Model<IProject>,
    private memberModel: Model<IMember>
  ) {}

  async getGraph(nid: string): Promise<Graph> {
    const [type, id] = parseNid(nid);
    if (type === NodeType.PROJECT) {
      return this.getProjectGraph(nid);
    }
    //  else if (type === NodeType.USER) {
    // } else if (type === NodeType.TECH) {
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

    const userEdges = members.map((m) => createMemberEdge(nid, m));
    const techEdges = project.techs.map((t) =>
      createUsesEdge(nid, t as TechDoc)
    );

    return {
      nodes: [createProjectNode(project), ...userNodes, ...techNodes],
      edges: [...userEdges, ...techEdges],
    };
  }
}

export default GraphController;

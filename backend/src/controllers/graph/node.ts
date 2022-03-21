import { pick } from "lodash";
import { ProjectDoc } from "../ProjectController";
import { TechDoc } from "../TechController";
import { UserRecord } from "../UserController";
import { Node, NodeType } from "./types";

export const createUserNode = (user: UserRecord): Node => {
  return {
    nid: "U_" + user._id,
    type: NodeType.USER,
    name: user.username || "",
    attributes: pick(user, [
      "username",
      "displayName",
      "avatarUrl",
      "githubId",
      "isAdmin",
    ]),
  };
};

export const createProjectNode = (project: ProjectDoc): Node => {
  return {
    nid: "P_" + project._id,
    type: NodeType.PROJECT,
    name: project.name,
    attributes: pick(project, ["name", "description"]),
  };
};

export const createTechNode = (tech: TechDoc): Node => {
  return {
    nid: "T_" + tech._id,
    type: NodeType.TECH,
    name: tech.name,
    attributes: pick(tech, ["name", "description", "imageUrl"]),
  };
};

import { pick } from "lodash";
import { MemberDoc } from "../ProjectController";
import { TechDoc } from "../TechController";
import { UserRecord } from "../UserController";
import { Edge } from "./types";

export const createMemberEdge = (
  from: string,
  to: MemberDoc,
  relation: string = "member"
): Edge => {
  return {
    nodes: [from, "U_" + (to.user as UserRecord)._id],
    relation,
    attributes: pick(to, ["roleName"]),
  };
};

export const createUsesEdge = (
  from: string,
  to: TechDoc,
  relation: string = "uses"
): Edge => {
  return {
    nodes: [from, "T_" + to._id],
    relation,
    attributes: {},
  };
};

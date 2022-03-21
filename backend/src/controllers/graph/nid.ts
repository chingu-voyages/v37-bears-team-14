import { isValidObjectId } from "mongoose";
import { getType, NodeType } from "./types";

export const parseNid = (nid: string): [NodeType, string] => {
  const [type, id] = nid.split("_");
  if (!type || !id) {
    throw new Error("Invalid nid " + nid);
  }
  if (!isValidObjectId(id)) {
    throw new Error("Invalid nid ObjectId: " + nid);
  }
  return [getType(type), id];
};

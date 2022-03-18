import { getType, NodeType } from "../../shared/GraphInterfaces";

export const parseNid = (nid: string): [NodeType, string] => {
  const [type, id] = nid.split("_");
  if (!type || !id) {
    throw new Error("Invalid nid " + nid);
  }
  return [getType(type), id];
};

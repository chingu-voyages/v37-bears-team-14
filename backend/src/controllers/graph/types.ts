export enum NodeType {
  PROJECT = "project",
  USER = "user",
  TECH = "tech",
}

export const getType = (type: string): NodeType => {
  switch (type) {
    case "P":
      return NodeType.PROJECT;
    case "U":
      return NodeType.USER;
    case "T":
      return NodeType.TECH;
    default:
      throw new Error("Unrecognized nid prefix " + type);
  }
};

export interface Node {
  nid: string;
  type: string;
  name: string;
  attributes: Record<string, any>;
}

export interface Edge {
  nodes: [string, string];
  relation: string;
  attributes: Record<string, any>;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

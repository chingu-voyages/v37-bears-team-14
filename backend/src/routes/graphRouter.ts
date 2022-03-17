import { Router } from "express";
import GraphController from "../controllers/GraphController";
import Project from "../models/Project";
import Member from "../models/Member";
import User from "../models/User";

const graphController = new GraphController(Project, Member, User);

const graph = Router();

graph.get("/v1/graph", async (req, res, next) => {
  const nid = req.query["nid"];
  if (!nid) {
    return res.status(400).json({ errors: ["invalid_nid"] });
  }
  try {
    const graph = await graphController.getGraph(nid.toString());
    res.json(graph);
  } catch (err) {
    next(err);
  }
});

export default graph;

import { Router } from "express";
import UnexpectedError from "../controllers/errors/UnexpectedError";
import { run } from "../spamengine/run";

const test = Router();

test.post("/v1/run", (req, res, next) => {
  if (!req.body["script"]) {
    return res.status(400).json({ errors: ["script_missing"] });
  }
  try {
    const output = run(req.body["script"]);
    res.json({ output });
  } catch (err: any) {
    next(new UnexpectedError(err.message));
  }
});

export default test;

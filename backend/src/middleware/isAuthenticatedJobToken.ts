import { NextFunction, Request, Response } from "express";
import { mustGetConfig } from "../config";
import logger from "../logger";

const JOB_TOKENS_TABLE = (mustGetConfig(process.env).jobTokens || []).reduce(
  (acc: Record<string, string>, t) => {
    acc[t] = t;
    return acc;
  },
  {}
);

const isAuthenticatedJobToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = (req.get("Authorization") || "").replace(/^token\s+/i, "");
  if (!!JOB_TOKENS_TABLE[token]) {
    next();
  } else {
    logger.warn(
      "Unauthenticated: Missing authorization token in an endpoint that expects one!"
    );
    res.status(401).json({ errors: ["unauthenticated"] });
  }
};

export default isAuthenticatedJobToken;

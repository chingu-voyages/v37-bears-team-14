import { NextFunction, Request, Response } from "express";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ errors: ["unauthenticated"] });
  }
};

export default isLoggedIn;

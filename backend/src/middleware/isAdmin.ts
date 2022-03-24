import { NextFunction, Request, Response } from "express";
import isLoggedIn from "./isLoggedIn";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // First call isLoggedIn middleware to check authentication.
  // Pass in a callback for the next function and run check for isAdmin.
  isLoggedIn(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({ errors: ["unauthorized"] });
    }
  });
};

export default isAdmin;

import { Router } from "express";
import passport from "../auth/passport";

const auth = Router();

auth.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

auth.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/signin",
    successRedirect: "/",
  })
);

auth.get("/signout", function (req, res) {
  req.logout();
  res.redirect("/");
});

export default auth;

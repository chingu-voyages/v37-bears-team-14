import passport from "passport";
import logger from "../logger";
import UserModel, { IUser } from "../models/User";
import { Document, startSession } from "mongoose";
import { Strategy as GithubStrategy } from "passport-github2";
import { mustGetConfig } from "../config";
import { parseAvatarUrl } from "./github";
import UserController from "../controllers/UserController";

/* dependencies */
const config = mustGetConfig(process.env);
const userController = new UserController(UserModel);

export type PassportCallback = (err: null | Error, user?: Express.User) => void;

/* passport generic */

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await UserModel.findOne({ _id });
    done(null, user as any);
  } catch (err) {
    done(err);
  }
});

/* Github auth */

passport.use(
  new GithubStrategy(
    {
      clientID: config.githubClientId,
      clientSecret: config.githubClientSecret,
      callbackURL: config.githubCallbackUrl,
    },
    async function (
      _accessToken: string,
      _refreshToken: undefined | string,
      profile: any,
      done: PassportCallback
    ) {
      const githubId = +profile.id;
      logger.info("github auth callback githubId=" + profile.id);

      try {
        const user = await userController.createOrUpdateUser(githubId);
        const updatedUser = await userController.updateDefaultsIfNeeded(
          user,
          profile
        );
        done(null, updatedUser as any);
      } catch (err) {
        const message = "Failed to sign in github user githubId=" + githubId;
        logger.error(message + " " + (err as Error).message);
        done(err as Error);
      }
    }
  )
);

export default passport;

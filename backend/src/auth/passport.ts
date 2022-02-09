import passport from "passport";
import logger from "../logger";
import UserModel, { IUser } from "../models/User";
import { Document } from "mongoose";
import { Strategy as GithubStrategy } from "passport-github2";
import { mustGetConfig } from "../config";
import { parseAvatarUrl } from "./github";

const config = mustGetConfig(process.env);

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

      let user: Document<IUser> & IUser;
      try {
        user = await UserModel.findOneAndUpdate(
          { githubId },
          {
            githubId,
          },
          {
            upsert: true,
            new: true,
          }
        );
      } catch (err) {
        logger.error("Failed to create/update user githubId=" + githubId);
        return done(err as Error);
      }

      if (!user.avatarUrl) {
        user.avatarUrl = parseAvatarUrl(profile);
        await user.save();
      }

      done(null, user as any);
    }
  )
);

export default passport;

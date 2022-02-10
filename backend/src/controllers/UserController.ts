import crypto from "crypto";
import { Document, Model } from "mongoose";
import { IUser } from "../models/User";
import { GithubProfile, parseAvatarUrl } from "../auth/github";

export type UserRecord = IUser & Document<IUser>;

class UserController {
  constructor(private userModel: Model<IUser>) {}

  async createOrUpdateUser(githubId: number): Promise<UserRecord> {
    return await this.userModel.findOneAndUpdate(
      { githubId },
      { githubId },
      {
        upsert: true,
        new: true,
      }
    );
  }

  async updateDefaultsIfNeeded(
    user: UserRecord,
    profile: GithubProfile
  ): Promise<UserRecord> {
    let needsSaving = false;

    if (!user.avatarUrl) {
      user.avatarUrl = parseAvatarUrl(profile);
      needsSaving = true;
    }

    if (!user.username) {
      user.username = await this.findAvailableUsername(profile.username, 5);
      needsSaving = true;
    }

    if (needsSaving) {
      await user.save();
    }

    return user;
  }

  private async findAvailableUsername(
    username: string,
    maxTries: number,
    tries?: number
  ): Promise<string> {
    tries = tries || 0;
    if (tries >= maxTries) {
      throw new Error("Maximum tries reached to find an available username");
    }

    const nextUsername =
      tries === 0 ? username : username + "-" + crypto.randomInt(1000, 9999);
    const user = await this.userModel.findOne({ username: nextUsername });
    if (user !== null) {
      return await this.findAvailableUsername(username, maxTries, tries + 1);
    } else {
      return nextUsername;
    }
  }
}

export default UserController;

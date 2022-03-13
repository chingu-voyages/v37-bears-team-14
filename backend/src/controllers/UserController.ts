import crypto from "crypto";
import { Document, Model, ObjectId, ClientSession } from "mongoose";
import { IUser } from "../models/User";
import { GithubProfile, parseAvatarUrl } from "../auth/github";
import NotFoundError from "./errors/NotFoundError";
import UnauthorizedError from "./errors/UnauthorizedError";
import UnexpectedError from "./errors/UnexpectedError";

export type UserRecord = IUser & Document<ObjectId, any, IUser>;

export interface ProfileUpdateParams {
  username?: string;
  displayName?: string;
  techs?: string[];
}

class UserController {
  constructor(private userModel: Model<IUser>) {}
  //TODO: Update User
  async updateProfile(
    id: string,
    paramsId: string,
    params: ProfileUpdateParams,
    isAdmin?: boolean
  ) {
    await this.validateUserUpdatePermission(id, isAdmin);
    let user: null | Document<IUser> = null;

    user = await this.userModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        _id: id,
        ...params,
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (null !== user) {
      //await (user as Document<IUser>).populate("user");
      await (user as Document<IUser>).populate("techs");
      return user;
    } else {
      throw new UnexpectedError("Expected user to be updated");
    }
  }
  private async validateUserUpdatePermission(id: string, isAdmin?: boolean) {
    isAdmin = isAdmin || false;

    if (!isAdmin) {
      const user = await this.userModel.findOne({
        _id: id,
      });

      if (!user || user.id !== id) {
        throw new UnauthorizedError("Updater is not the user");
      }
    }
  }
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
  async searchByName(username: string) {
    const user = await this.userModel
      .findOne({
        username: { $regex: "^" + username + "$", $options: "i" },
      })
      .populate("techs");
    if (!user) {
      throw new NotFoundError("user", username);
    }
    return user;
  }
  async findDuplicate(username: string) {
    const user = await this.userModel.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });
    if (!user) {
      return false;
    }
    return true;
  }

  async searchById(id: string) {
    const user = await this.userModel
      .findOne({ githubId: id })
      .populate("techs");
    if (!user) {
      throw new NotFoundError("id", id);
    }
    return user;
  }
}

export default UserController;

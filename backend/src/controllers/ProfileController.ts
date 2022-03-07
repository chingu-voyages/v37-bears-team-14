import crypto from "crypto";
import { Document, Model, ObjectId, ClientSession } from "mongoose";
import { IUser } from "../models/User";
import NotFoundError from "./errors/NotFoundError";
import UnexpectedError from "./errors/UnexpectedError";
import UnauthorizedError from "./errors/UnauthorizedError";

export type UserRecord = IUser & Document<ObjectId, any, IUser>;

export interface ProfileUpdateParams {
  username?: string;
  displayName?: string;
  techs?: string[];
}

export type UserDoc = IUser & Document<unknown, any, IUser>;

class ProfileController {
  constructor(
    private userModel: Model<IUser>,
    private createSession: () => Promise<ClientSession>
  ) {}

  //TODO: Update User
  async updateProfile(
    id: string,
    params: ProfileUpdateParams,
    isAdmin?: boolean
  ) {
    await this.validateUserUpdatePermission(id, isAdmin);
    const session = await this.createSession();
    let user: null | Document<IUser> = null;

    try {
      await session.withTransaction(async () => {
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
            session,
          }
        );
      });
    } finally {
      session.endSession();
    }

    if (null !== user) {
      //await (user as Document<IUser>).populate("user");
      await (user as Document<IUser>).populate("techs");
      return user;
    } else {
      throw new UnexpectedError("Expected user to be updated");
    }
  }

  /**
   * @param user ID of the user making the update.
   * @param isAdmin Boolean of whether the user is an admin.
   */
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
}

export default ProfileController;

import { Model } from "mongoose";
import { IMember } from "../../models/Member";
import UnauthorizedError from "../errors/UnauthorizedError";

export const verifyRoles =
  (memberModel: Model<IMember>, roleNames: string[]) =>
  async (project: string, user: string): Promise<boolean> => {
    const member = await memberModel.findOne({ project, user });
    if (!member || !roleNames.includes(member.roleName)) {
      throw new UnauthorizedError(
        `User is not one of ${JSON.stringify(roleNames)}`
      );
    }
    return true;
  };

export const verifyOwner = (
  memberModel: Model<IMember>
): ((project: string, user: string) => Promise<boolean>) => {
  return verifyRoles(memberModel, ["owner"]);
};

import { Document, Model } from "mongoose";
import { IHook } from "../models/Hook";
import { IMember } from "../models/Member";
import NotFoundError from "./errors/NotFoundError";
import { hashHmac, newSecret, verifySignature } from "./hooks/hookHelpers";
import { verifyRoles } from "./permissions/permissionHelpers";
import UnauthorizedError from "./errors/UnauthorizedError";
import { IProjectEvent } from "../models/ProjectEvent";
import UserController from "./UserController";
import logger from "../logger";

export type HookDoc = IHook & Document<unknown, any, IHook>;

interface GithubPayload {
  sender?: {
    id: number;
  };
}

export interface HookCreateParams {
  project: string;
  isActive?: string;
}

export interface HookUpdateParams {
  isActive?: string;
}

class HookController {
  constructor(
    private hookModel: Model<IHook>,
    private memberModel: Model<IMember>,
    private projectEventModel: Model<IProjectEvent>,
    private userController: UserController
  ) {}

  async create(user: string, params: HookCreateParams): Promise<HookDoc> {
    await verifyRoles(this.memberModel, ["owner", "developer"])(
      params.project,
      user
    );
    const secret = await newSecret(256);
    const hook = await this.hookModel.create({
      secret,
      secretGeneratedAt: new Date(),
      ...params,
    });
    return hook;
  }

  async remove(user: string, id: string, isAdmin?: boolean): Promise<HookDoc> {
    const hook = await this.hookModel.findOne({ _id: id });
    if (!hook) {
      throw new NotFoundError("hook", id);
    }
    if (!isAdmin) {
      await verifyRoles(this.memberModel, ["owner", "developer"])(
        hook.project.toString(),
        user
      );
    }
    await hook.remove();
    return hook;
  }

  async update(
    user: string,
    id: string,
    params: HookUpdateParams,
    isAdmin?: boolean
  ): Promise<HookDoc> {
    const hook = await this.hookModel.findOne({ _id: id });
    if (!hook) {
      throw new NotFoundError("hook", id);
    }
    if (!isAdmin) {
      await verifyRoles(this.memberModel, ["owner", "developer"])(
        hook.project.toString(),
        user
      );
    }
    for (const key of Object.keys(params)) {
      (hook as any)[key] = (params as any)[key];
    }
    await hook.save();
    return hook;
  }

  async rotateSecret(
    user: string,
    id: string,
    isAdmin?: boolean
  ): Promise<HookDoc> {
    const hook = await this.hookModel.findOne({ _id: id });
    if (!hook) {
      throw new NotFoundError("hook", id);
    }
    if (!isAdmin) {
      await verifyRoles(this.memberModel, ["owner", "developer"])(
        hook.project.toString(),
        user
      );
    }
    hook.secret = await newSecret(256);
    hook.secretGeneratedAt = new Date();
    await hook.save();
    return hook;
  }

  async lookup(
    user: string,
    project: string,
    isAdmin?: boolean
  ): Promise<HookDoc[]> {
    if (!isAdmin) {
      await verifyRoles(this.memberModel, ["owner", "developer"])(
        project,
        user
      );
    }
    return await this.hookModel.find({ project });
  }

  async createEventGithub(
    id: string,
    signature: string,
    eventName: string,
    payloadJson: GithubPayload
  ) {
    const payload = JSON.stringify(payloadJson);

    const hook = await this.hookModel.findOne({ _id: id });
    if (!hook) {
      throw new NotFoundError("hook", id);
    }
    if (!hook.isActive) {
      logger.info("Hook is not active, skipping... hook:" + id);
      return;
    }

    let verified;
    try {
      verified = verifySignature(signature, payload, hook.secret);
    } catch (err) {
      // Log for debugging.
      logger.warn("Failed to verify signature", {
        signature,
        hashHmac: hashHmac(payload, hook.secret),
      });
      throw new UnauthorizedError("Invalid signature.");
    }

    if (!verified) {
      throw new UnauthorizedError("Invalid signature.");
    }

    const githubId = payloadJson.sender?.id;
    const user = githubId
      ? await this.userController.createOrUpdateUser(githubId)
      : null;

    const event = await this.projectEventModel.create({
      event: eventName,
      payload,
      project: hook.project,
      user: user ? user.id : null,
    });

    // Save the invocation time asynchronously to prevent the update
    // from blocking the return.
    this.hookModel
      .findOneAndUpdate(
        {
          _id: hook.id,
        },
        {
          invokedAt: new Date(),
          $inc: {
            invokeCount: 1,
          },
        }
      )
      .catch((err) => {
        logger.error("Failed to save update invokedAt/invokeCount", {
          hookId: hook.id,
          errorMessage: err.message,
        });
      });

    return event;
  }
}

export default HookController;

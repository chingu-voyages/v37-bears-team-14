import { model, ObjectId, Schema } from "mongoose";
import { IProject } from "./Project";

export interface IHook {
  project: IProject | ObjectId;
  secret: string;
  secretGeneratedAt: Date;
  isActive: boolean;
  invokedAt: Date | null;
  invokeCount: number;
}

const HookSchema = new Schema<IHook>(
  {
    project: {
      type: Schema.Types.ObjectId,
      indexed: true,
      required: true,
      ref: "project",
    },
    secret: {
      type: Schema.Types.String,
    },
    secretGeneratedAt: {
      type: Schema.Types.Date,
    },
    isActive: {
      type: Schema.Types.Boolean,
    },
    invokedAt: {
      type: Schema.Types.Date,
      default: null,
    },
    invokeCount: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

HookSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<IHook>("hook", HookSchema);

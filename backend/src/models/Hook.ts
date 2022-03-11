import { model, ObjectId, Schema } from "mongoose";
import { IProject } from "./Project";

export interface IHook {
  project: IProject | ObjectId;
  secret: string;
  isActive: boolean;
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
    isActive: {
      type: Schema.Types.Boolean,
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

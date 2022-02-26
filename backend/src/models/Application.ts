import { model, ObjectId, Schema } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";

export interface IApplication {
  project: IProject | ObjectId;
  user: IUser | ObjectId;
  content: null | string;
  status: string;
  requestedRole: string;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    project: {
      type: Schema.Types.ObjectId,
      indexed: true,
      required: true,
      ref: "project",
    },
    user: {
      type: Schema.Types.ObjectId,
      indexed: true,
      required: true,
      ref: "user",
    },
    content: {
      type: Schema.Types.String,
      default: null,
    },
    status: {
      type: Schema.Types.String,
      enum: ["pending", "closed", "accepted"],
      indexed: true,
      default: "pending",
    },
    requestedRole: {
      type: Schema.Types.String,
      indexed: true,
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<IApplication>("application", ApplicationSchema);

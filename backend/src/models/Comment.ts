import { model, ObjectId, Schema } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";

export interface IComment {
  project: IProject | ObjectId;
  user: IUser | ObjectId;
  depth: number;
  children?: any;
  commentText: string;
  parentId: ObjectId | null;
  postedDate: Date;
  notificationPreference: string;
}

const CommentSchema = new Schema<IComment>(
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
    depth: {
      type: Number,
      default: 1,
    },
    commentText: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    postedDate: { type: Date, default: Date.now },
  },

  {
    timestamps: true,
  }
);

CommentSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<IComment>("comment", CommentSchema);

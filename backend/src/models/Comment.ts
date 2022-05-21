import { model, ObjectId, Schema } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";

export interface IComment {
  id: string;
  project: IProject | ObjectId;
  user: IUser;
  depth: number;
  children?: any;
  commentText: string;
  likes: ObjectId[];
  dislikes: ObjectId[];
  parentId: ObjectId | null;
  postedDate: Date;
  deleted: boolean;
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
    deleted: {
      type: Boolean,
      default: false,
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

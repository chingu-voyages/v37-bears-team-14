import { model, ObjectId, Schema } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";
import { IComment } from "./Comment";

export interface ICommentDislike {
  id: string;
  project: string | ObjectId | IProject;
  user: IUser | ObjectId;
  comment: string | ObjectId;
}

const CommentDislikeSchema = new Schema<ICommentDislike>(
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
    comment: {
      type: Schema.Types.ObjectId,
      indexed: true,
      required: true,
      ref: "comment",
    },
  },

  {
    timestamps: true,
  }
);

CommentDislikeSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<ICommentDislike>("commentDislike", CommentDislikeSchema);

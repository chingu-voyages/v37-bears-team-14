import { model, ObjectId, Schema } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";

export interface IMember {
  project: IProject | ObjectId;
  user: IUser | ObjectId;
  roleName: string;
}

const MemberSchema = new Schema<IMember>(
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
    roleName: {
      type: Schema.Types.String,
      indexed: true,
    },
  },
  {
    timestamps: true,
  }
);

MemberSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<IMember>("member", MemberSchema);

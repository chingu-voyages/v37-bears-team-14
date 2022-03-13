import { Model, ObjectId, model, Schema } from "mongoose";
import { ITech } from "./Tech";

export interface IUser {
  displayName: string | null;
  username: string | null;
  githubId: number | null;
  avatarUrl: string | null;
  techs: ObjectId[] | ITech[];
  isAdmin: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    displayName: {
      type: Schema.Types.String,
    },
    username: {
      type: Schema.Types.String,
      unique: true,
      sparse: true, // allow nulls
    },
    githubId: {
      type: Schema.Types.String,
      unique: true,
      sparse: true, // allow nulls in case future auth providers are added
    },
    avatarUrl: {
      type: Schema.Types.String,
    },
    techs: {
      type: [Schema.Types.ObjectId],
      ref: "tech",
    },
    isAdmin: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<IUser>("user", UserSchema);

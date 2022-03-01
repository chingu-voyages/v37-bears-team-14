import { model, ObjectId, Schema } from "mongoose";
import { ITech } from "./Tech";

export interface IProject {
  name: string;
  description: null | string;
  techs: ObjectId[] | ITech[];
  settingOpenRoles: string[];
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      indexed: true,
      unique: true,
      validate: (v: any) => (v || "").length >= 1,
    },
    description: {
      type: Schema.Types.String,
      default: null,
    },
    techs: {
      type: [Schema.Types.ObjectId],
      ref: "tech",
    },
    settingOpenRoles: {
      type: [Schema.Types.String],
      default: ["developer", "designer"],
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<IProject>("project", ProjectSchema);

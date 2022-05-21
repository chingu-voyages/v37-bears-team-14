import { model, ObjectId, Schema } from "mongoose";
import { ITech } from "./Tech";

export interface IProject {
  id: string;
  name: string;
  description: null | string;
  techs: ObjectId[] | ITech[];
  starrers: ObjectId[];
  matchType?: {
    name?: boolean;
    description?: boolean;
    techs?: boolean;
  };
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
      indexed: true,
    },
    techs: {
      type: [Schema.Types.ObjectId],
      ref: "tech",
      indexed: true,
    },
    starrers: {
      type: [Schema.Types.ObjectId],
      ref: "user",
      indexed: true,
      default: [],
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

ProjectSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 5, description: 2 } }
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

import { model, ObjectId, Schema } from "mongoose";
import { ITech } from "./Tech";

export interface IProject {
  name: string;
  description: string;
  techs: ObjectId[] | ITech[];
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
    },
    techs: {
      type: [Schema.Types.ObjectId],
      ref: "tech",
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

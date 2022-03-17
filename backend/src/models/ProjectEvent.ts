import { model, ObjectId, Schema } from "mongoose";
import { IProject } from "./Project";
import { IUser } from "./User";

export interface IProjectEvent {
  event: string;
  project: IProject | ObjectId;
  user?: IUser | ObjectId;
  payload: string;
}

const ProjectEventSchema = new Schema<IProjectEvent>(
  {
    event: {
      type: Schema.Types.String,
      indexed: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      indexed: true,
      required: true,
      ref: "project",
    },
    user: {
      type: Schema.Types.ObjectId,
      indexed: true,
      sparse: true, // in case a user cannot be associated and is null.
      ref: "user",
    },
    payload: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

ProjectEventSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<IProjectEvent>("project_event", ProjectEventSchema);

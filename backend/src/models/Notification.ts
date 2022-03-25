import { model, ObjectId, Schema } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";
import { IApplication } from "./Application";

export interface INotificationData {
  application?: ObjectId | IApplication;
  project?: ObjectId | IProject;
  user?: ObjectId | IUser;
}

export interface INotification {
  to: IUser | string;
  isRead: boolean;
  event: string;
  data: INotificationData;
}

const NotificationSchema = new Schema<INotification>(
  {
    to: {
      type: Schema.Types.ObjectId,
      indexed: true,
      required: true,
      ref: "user",
    },
    isRead: {
      type: Schema.Types.Boolean,
      default: false,
    },
    event: {
      type: Schema.Types.String,
      indexed: true,
      required: true,
    },
    data: {
      application: {
        type: Schema.Types.ObjectId,
        ref: "application",
      },
      project: {
        type: Schema.Types.ObjectId,
        ref: "project",
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<INotification>("notification", NotificationSchema);

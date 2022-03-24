import { Application, Project, User } from "./Interfaces";

export interface INotificationData {
  project?: Project;
  user?: User;
  application?: Application;
}

export interface INotification {
  id: string;
  createdAt: Date;
  to: User;
  isRead: boolean;
  event: string;
  data: INotificationData;
}

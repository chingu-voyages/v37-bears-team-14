import { Project, User } from "./Interfaces";

export interface ProjectEvent {
  id: string;
  event: string;
  project: Project;
  user?: User;
  payload: any;
  createdAt: Date;
  updatedAt: Date;
}

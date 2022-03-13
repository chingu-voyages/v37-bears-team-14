import { model, ObjectId, Schema } from "mongoose";
import { IProject } from "./Project";
import { ITech } from "./Tech";
import { IUser } from "./User";

export interface ISearch {
  query: string;
  nameMatchesProjects: IProject[] | ObjectId[];
  descriptionMatchesProjects: IProject[] | ObjectId[];
  techMatchesProjects: IProject[] | ObjectId[];
  matchedTechs: ITech[] | ObjectId[];
  mergedCount: number;
  totalCount: number;
  timeElapsedMs: number;
  user: IUser | ObjectId | null;
  createdAt: Date;
}

/**
 * None of the fields are indexed to improve insert speed.
 * Future optimization can be done by batching inserts and
 * writing in bulk.
 */
const SearchSchema = new Schema<ISearch>({
  query: {
    type: Schema.Types.String,
  },
  nameMatchesProjects: {
    type: [Schema.Types.ObjectId],
    ref: "project",
  },
  descriptionMatchesProjects: {
    type: [Schema.Types.ObjectId],
    ref: "project",
  },
  techMatchesProjects: {
    type: [Schema.Types.ObjectId],
    ref: "project",
  },
  matchedTechs: {
    type: [Schema.Types.ObjectId],
    ref: "tech",
  },
  mergedCount: {
    type: Schema.Types.Number,
  },
  totalCount: {
    type: Schema.Types.Number,
  },
  timeElapsedMs: {
    type: Schema.Types.Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  // Updates are not supported, so we only need to track createdAt.
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
});

SearchSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<ISearch>("search", SearchSchema);

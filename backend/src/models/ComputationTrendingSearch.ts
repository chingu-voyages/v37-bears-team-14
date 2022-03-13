import { model, ObjectId, Schema } from "mongoose";

export interface IComputationItem {
  query: string;
  score: number;
}

export interface IComputationTrendingSearch {
  suggestions: IComputationItem[];
  start: ObjectId;
  end: ObjectId;
  analyzed: number;
  maxAnalyzed: number;
  timeElapsedMs: number;
  createdAt: Date;
}

const ComputationItemSchema = new Schema<IComputationItem>({
  query: {
    type: Schema.Types.String,
  },
  score: {
    type: Schema.Types.Number,
  },
});

// None of the fields besides _id are indexed.
// Relies on timestamp component of ObjectId _id for querying the latest record.
// e.g. ComputationTrendingSearch.findOne().sort({_id: -1}).limit(1);
const ComputationTrendingSearchSchema = new Schema<IComputationTrendingSearch>({
  suggestions: {
    type: [ComputationItemSchema],
  },
  start: {
    type: Schema.Types.ObjectId,
    ref: "search",
  },
  end: {
    type: Schema.Types.ObjectId,
    ref: "search",
  },
  analyzed: {
    type: Schema.Types.Number,
  },
  maxAnalyzed: {
    type: Schema.Types.Number,
  },
  timeElapsedMs: {
    type: Schema.Types.Number,
  },
  // Updates are not supported, so we only need to track createdAt.
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
});

ComputationTrendingSearchSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default model<IComputationTrendingSearch>(
  "computation_trending_search",
  ComputationTrendingSearchSchema
);

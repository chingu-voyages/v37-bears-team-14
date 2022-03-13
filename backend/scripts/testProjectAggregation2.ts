import { flatMap, uniqWith } from "lodash";
import mongoose, { ConnectOptions, Model, PipelineStage } from "mongoose";
import { ObjectId } from "mongodb";
import Project, { IProject } from "../src/models/Project";

const getProjects = async (
  Project: Model<IProject>,
  query: PipelineStage,
  projection: PipelineStage
) => {
  return await Project.aggregate([
    query,
    {
      $lookup: {
        from: "teches",
        localField: "techs",
        foreignField: "_id",
        as: "techs",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              name: 1,
              description: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "members",
        localField: "_id",
        foreignField: "project",
        as: "members",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    username: 1,
                    avatarUrl: 1,
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$user",
          },
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              user: 1,
              project: 1,
              roleName: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
      },
    },
    projection,
  ]);
};

interface TestProjectSearchItem {
  id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  techs: any[];
  members: any[];
  matchType: string;
}

// Moves data from Member collection into Project.members field.
//
// Usage:
// From backend directory,
// run `yarn script scripts/testProjectAggregation.ts`
(async () => {
  mongoose.connect((process.env && process.env["MONGODB_URI"]) || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  // dev env user ID: 62041c51a00bb005822d8388
  const start = Date.now();
  const search = "test";

  const projects: TestProjectSearchItem[][] = await Promise.all([
    getProjects(
      Project,
      {
        $match: {
          $or: [{ name: { $regex: search, $options: "i" } }],
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          createdAt: 1,
          updatedAt: 1,
          name: 1,
          description: 1,
          techs: 1,
          members: 1,
          matchType: "name",
        },
      }
    ),
    getProjects(
      Project,
      {
        $match: {
          $or: [{ description: { $regex: search, $options: "i" } }],
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          createdAt: 1,
          updatedAt: 1,
          name: 1,
          description: 1,
          techs: 1,
          members: 1,
          matchType: "description",
        },
      }
    ),
  ]);

  // Flatten results from `Promise.all`.
  const concated = flatMap(projects);
  // .equals is needed to compare ObjectId to ObjectId
  const deduped = uniqWith(concated, (a, b) => a.id.equals(b.id));

  console.log(JSON.stringify(deduped, null, 2));
  const diff = Date.now() - start;
  console.log("time", diff);

  process.exit(0);
})();

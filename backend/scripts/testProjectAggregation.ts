import mongoose, { ConnectOptions } from "mongoose";
import Project from "../src/models/Project";

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

  const projects = await Project.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
    },
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
              id: "$_id",
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
                    id: "$_id",
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
              id: "$_id",
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
      },
    },
  ]);

  console.log(JSON.stringify(projects, null, 2));
  const diff = Date.now() - start;
  console.log("time", diff);

  process.exit(0);
})();

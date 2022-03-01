import Tech from "../src/models/Tech";
import mongoose, { ConnectOptions } from "mongoose";
import TechController from "../src/controllers/TechController";
import fs from "fs";
import Member from "../src/models/Member";
import Project from "../src/models/Project";

// Moves data from Member collection into Project.members field.
//
// Usage:
// From backend directory,
// run `yarn script scripts/migrateProjectMembers.ts`
(async () => {
  mongoose.connect((process.env && process.env["MONGODB_URI"]) || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  // user 62041c51a00bb005822d8388
  const search = "test"
  const projects = await Project.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    },
    // {
    //   $project: {
    //     _id: 1,
    //     createdAt: 1,
    //     name: 1,
    //     description: 1,
    //     techs: 1,
    //   }
    // },
    {
      $lookup: {
        from: "teches",
        localField: "techs",
        foreignField: "_id",
        as: "techs"
      }
    },
    {
      $lookup: {
        from: "members",
        localField: "_id",
        foreignField: "project",
        as: "refs.members"
      }
    },
    // {
    //   $unwind:"$members"
    // },
    {
      $lookup: {
        from: "users",
        localField: "refs.members.user",
        foreignField: "_id",
        as: "refs.users"
      }
    },
    // {
    //   $unwind:"$users"
    // },
  ]);
  // await Project.populate(projects, "techs")

  console.log(JSON.stringify(projects, null, 2))

  process.exit(0);
})();

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

  const member = await Member.findOne();
  if (!member) return console.warn("no members found")
  // {
  //   await member.populate("project")
  //   await member.populate("user")

  //   if (!member.project || !member.user) {
  //     await member.delete()
  //   }
  // }

  console.log("updating", member.project, member.user, member.roleName)

  {
    const project = await Project.findOne({_id: member.project})
    await project?.save()
  }

  {
    const project = await Project.findOneAndUpdate(
      {
        _id: member.project,
      },
      {
        [`members.${member.user}.user`]: member.user,
        [`members.${member.user}.roleName`]: member.roleName,
        // [`members.${member.user}.updatedAt`]: new Date(),
      },
      {
        new: true,
      }
    )
    console.log("update", project?.toJSON())
  }

  {
    const projects = await Project.find(
      {
        [`members`]: member.user
        // [`members.${member.user}`]: member.user
      },
    )
    console.log("update", projects?.map(p => p.toJSON()))
  }

  process.exit(0);
})();

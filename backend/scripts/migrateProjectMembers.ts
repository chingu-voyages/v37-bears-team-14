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

  const members = await Member.find();
  for (const member of members) {
    {
      await member.populate("project")
      await member.populate("user")

      if (!member.project || !member.user) {
        await member.delete()
        continue;
      }
    }
    
    const project = await Project.findOne({ _id: member.project });


  }

  // const dataFilename = process.argv[2];

  // const data = JSON.parse(fs.readFileSync(dataFilename).toString());

  // console.log(`Inserting techs from ${dataFilename}. Count`, data.length);

  // const visited: Record<string, boolean> = {};

  // for (const tech of data) {
  //   const { name, description, imageUrl } = tech;
  //   const doc = await Tech.findOneAndUpdate(
  //     {
  //       name: new RegExp(`^${name}$`, "i"),
  //     },
  //     {
  //       name,
  //       description,
  //       imageUrl,
  //     },
  //     {
  //       new: true,
  //       upsert: true,
  //     }
  //   );
  //   const isRepeat = !!visited[doc._id.toString()];
  //   console.log(
  //     "Updated",
  //     doc._id.toString(),
  //     isRepeat ? "REPEAT" : "",
  //     doc.name
  //   );
  //   visited[doc._id.toString()] = true;
  // }

  // process.exit(0);
})();

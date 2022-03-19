import mongoose, { ConnectOptions } from "mongoose";
import Project from "../src/models/Project";

// Updates projects with missing `starrers` field with
// an empty array.
//
// Usage:
// From backend directory,
// run `yarn script scripts/backfillStarrers.ts`
(async () => {
  mongoose.connect((process.env && process.env["MONGODB_URI"]) || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  const result = await Project.updateMany(
    {
      starrers: { $exists: false },
    },
    {
      starrers: [],
    }
  );

  console.log(`Updated ${result.modifiedCount} projects with starrers array.`);

  process.exit(0);
})();

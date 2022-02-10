import { model, Schema } from "mongoose";

// @ts-ignore
import mongooseFuzzySearching from "mongoose-fuzzy-searching-v3";

export interface ITech {
  name: string;
  description: string;
  imageUrl: string | null;
}

const TechSchema = new Schema<ITech>(
  {
    name: {
      type: Schema.Types.String,
      indexed: true,
    },
    description: {
      type: Schema.Types.String,
    },
    imageUrl: {
      type: Schema.Types.String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add fuzzy string search for `name` field.
TechSchema.plugin(mongooseFuzzySearching, { fields: ["name"] });

TechSchema.set("toJSON", {
  transform: (_, ret, __) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.name_fuzzy; // Added by fuzzy search
    return ret;
  },
});

export default model<ITech>("tech", TechSchema);

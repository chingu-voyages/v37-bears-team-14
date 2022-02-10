import { Document, Model } from "mongoose";
import { ITech } from "../models/Tech";
import NotFoundError from "./errors/NotFoundError";

export type TechDoc = ITech | Document<ITech>;

export interface TechUpdateParams {
  name?: string;
  description?: string;
  imageUrl?: string;
}

class TechController {
  constructor(private techModel: Model<ITech>) {}

  async getById(id: string): Promise<TechDoc> {
    const tech = await this.techModel.findOne({ _id: id });
    if (!tech) {
      throw new NotFoundError("tech", id);
    }
    return tech;
  }

  async create(params: TechUpdateParams): Promise<TechDoc> {
    return await this.techModel.create(params);
  }

  async updateById(id: string, params: TechUpdateParams): Promise<TechDoc> {
    const tech = await this.techModel.findOneAndUpdate({ _id: id }, params, {
      new: true,
    });
    if (!tech) {
      throw new NotFoundError("tech", id);
    }
    return tech;
  }

  async lookup(pageSize: number, greaterThanId?: string): Promise<TechDoc[]> {
    const query: Record<string, any> = {};
    if (greaterThanId) {
      query["_id"] = {
        $gt: greaterThanId,
      };
    }
    const techs = await this.techModel.find(query).sort("_id").limit(pageSize);
    return techs;
  }

  // Fuzzy search by name.
  async search(query: string): Promise<TechDoc[]> {
    // @ts-ignore
    const techs = await this.techModel.fuzzySearch(query);
    return techs;
  }
}

export default TechController;

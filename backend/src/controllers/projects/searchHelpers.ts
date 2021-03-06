import { FilterQuery, PipelineStage } from "mongoose";
import { IProject } from "../../models/Project";
import { MatchType, ProjectSearchResultItem } from "../ProjectController";

/**
 * Helpers for Project aggregation queries.
 * Three stages of aggregation pipelining:
 * 1. Querying for matches. (createQuery)
 * 2. Joining data from other models (createJoins).
 * 3. Projecting the result for Project (createProjection).
 * 4. Adding additional fields to each item in the result (createAddedFields).
 */

/**
 * Creates a match pipeline based on the given filter criteria.
 * @param filter FilterQuery<IProject>
 */
export const createQuery = (
  filter: FilterQuery<IProject>
): PipelineStage.Match => {
  return {
    $match: filter,
  };
};

/**
 * Creates lookup pipelines for joining Tech and Member->User models to Project.
 * The projections replace the "_id" key to "id" to match the API schema.
 * The added projections avoid fetching internal fields (like name_fuzzy).
 */
export const createJoins = (): PipelineStage.Lookup[] => {
  return [
    {
      $lookup: {
        from: "teches", // Name of the source collection.
        localField: "techs",
        foreignField: "_id",
        as: "techs", // Name of the field in the result.
        pipeline: [
          {
            $project: {
              _id: 0,
              id: "$_id",
              name: 1,
              description: 1,
              imageUrl: 1,
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
  ];
};

/**
 * Creates a projection pipeline for the final Project search result item.
 * The projections replace the "_id" key to "id" to match the API schema.
 */
export const createProjection = (): PipelineStage.Project => {
  return {
    $project: {
      _id: 0,
      id: "$_id",
      createdAt: 1,
      updatedAt: 1,
      name: 1,
      description: 1,
      techs: 1,
      members: 1,
      starrers: 1,
    },
  };
};

/**
 * Creates a projection pipeline for the final Project search result item.
 * The projections replace the "_id" key to "id" to match the API schema.
 */
export const createProjectionById = (): PipelineStage.Project => {
  return {
    $project: {
      _id: 0,
      id: "$_id",
      createdAt: 1,
      updatedAt: 1,
      name: 1,
      description: 1,
      techs: 1,
      members: 1,
      starrers: 1,
      settingOpenRoles: 1,
    },
  };
};

/**
 * Creates a projection pipeline for the final Project search result item.
 * The projections replace the "_id" key to "id" to match the API schema.
 */
export const createAddedFields = (
  matchType: Partial<MatchType>
): PipelineStage.AddFields => {
  return {
    $addFields: {
      matchType: matchType || null,
    },
  };
};

const EMPTY_MATCH_TYPE: MatchType = {
  name: false,
  description: false,
  techs: false,
};

export const mergeResults = (
  results: ProjectSearchResultItem[]
): ProjectSearchResultItem[] => {
  const indices: Record<string, number> = {};
  const deduped: ProjectSearchResultItem[] = [];

  for (let i = 0; i < results.length; i++) {
    const project = results[i];
    const prevIndex = indices[project.id.toString()];
    if (prevIndex !== undefined) {
      const prev = deduped[prevIndex];
      prev.matchType = {
        ...prev.matchType,
        ...project.matchType,
      };
    } else {
      indices[project.id.toString()] = deduped.length;
      deduped.push(project);
    }
  }

  return deduped.map((p) => ({
    ...p,
    matchType: {
      ...EMPTY_MATCH_TYPE,
      ...p.matchType,
    },
  }));
};

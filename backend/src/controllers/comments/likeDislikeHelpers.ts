import { PipelineStage } from "mongoose";
export const createLikeDislikeJoins = (): PipelineStage.Lookup[] => {
  return [
    {
      $lookup: {
        from: "commentlikes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: "$_id",
              project: 1,
              user: 1,
              comment: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "commentdislikes",
        localField: "_id",
        foreignField: "comment",
        as: "dislikes",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: "$_id",
              project: 1,
              user: 1,
              comment: 1,
            },
          },
        ],
      },
    },
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
              githubId: 1,
              isAdmin: 1,
              avatarUrl: 1,
              username: 1,
              displayName: 1,
              techs: 1,
            },
          },
        ],
      },
    },
  ];
};
export const createLikeDislikeProjection = (): PipelineStage.Project => {
  return {
    $project: {
      _id: 0,
      id: "$_id",
      project: 1,
      user: { $arrayElemAt: ["$user", 0] },
      depth: 1,
      commentText: 1,
      likes: 1,
      dislikes: 1,
      likess: 1,
      deleted: 1,
      parentId: 1,
      postedDate: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  };
};

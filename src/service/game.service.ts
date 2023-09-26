import mongoose, { DocumentDefinition, FilterQuery } from "mongoose";
import GameModel, { GameDocument } from "../model/game.model";

export async function getGamesBySessionId(sessionId: string) {
  return await GameModel.find({ sessionId }).lean();
}
export async function getAllGames() {
  return await GameModel.find().lean();
}

export async function getGameById(id: string) {
  return await GameModel.findById({
    _id: new mongoose.Types.ObjectId(id),
  }).lean();
}

export async function getGamesByUserId(userId: string) {
  return await GameModel.find({ userId }).lean();
}

export async function getGamesByFilter(query: FilterQuery<GameDocument>) {
  return await GameModel.find(query).lean();
}

export async function updateBooking(
  id: string,
  userId: string,
  input: DocumentDefinition<GameDocument>
) {
  return GameModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    },
    input,
    { new: true } // new option to true to return the document after update was applied.
  );
}
export async function getRichBookingsDetailsByUserId(userId: string) {
  return await GameModel.aggregate([
    // filter with userID
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    // join with session table
    {
      $lookup: {
        from: "games",
        localField: "sessionId",
        foreignField: "_id",
        as: "sessionDetail",
        pipeline: [
          // keep only time and movieId
          {
            $project: {
              result: 1,
              boardSize: 1,
            },
          },
        ],
      },
    },
    // join movie table
    {
      $lookup: {
        from: "movies",
        localField: "sessionDetail.movieId",
        foreignField: "_id",
        as: "movieDetail",
        pipeline: [
          {
            $project: {
              title: 1,
            },
          },
        ],
      },
    },
    // transform the return with $project
    {
      $project: {
        userId: 1,
        sessionId: 1,
        // seatCount: { $size: "$seats" },
        movieTitle: { $arrayElemAt: ["$movieDetail.title", 0] },
        // sessionTime: { $arrayElemAt: ["$sessionDetail.time", 0] },
      },
    },
  ]);
}
export async function createGame(input: DocumentDefinition<GameDocument>) {
  return GameModel.create(input);
}

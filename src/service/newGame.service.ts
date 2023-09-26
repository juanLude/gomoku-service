import mongoose, { DocumentDefinition, FilterQuery } from "mongoose";
import GameModel, { newGameDocument } from "../model/newGame.model";

export async function createNewGame(
  input: DocumentDefinition<newGameDocument>
) {
  return GameModel.create(input);
}

export async function updateNewGame(
  sessionId: string,
  update: DocumentDefinition<newGameDocument>
) {
  const filter: FilterQuery<newGameDocument> = { _id: sessionId };

  const updatedGame = await GameModel.findOneAndUpdate(filter, update, {
    new: true,
  });

  if (!updatedGame) {
    throw new Error("Game not found");
  }

  return updatedGame;
}

export async function getNewGameById(id: string) {
  return await GameModel.findById(id).lean();
}
export async function getNewGameByFilter(query: FilterQuery<newGameDocument>) {
  return await GameModel.findOne(query).lean();
}
export async function getNewGamesByUserId(userId: string) {
  return await GameModel.find({ userId }).lean();
}
export async function deleteNewGame(id: string, userId: string) {
  return GameModel.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });
}

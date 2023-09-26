import mongoose, { Document } from "mongoose";
import { UserDocument } from "./user.model";

export interface newGameDocument extends Document {
  userId: UserDocument["_id"];
  gameResult: string | null;
  boardSize: number;
  position: Number;
  moves: Array<string> | Array<null>;
}
const newGameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  gameResult: String,
  boardSize: Number,
  position: [Number],
  date: {
    type: Date,
    default: Date.now,
  },
  moves: [String],
});
export default mongoose.model<newGameDocument>("newGame", newGameSchema);

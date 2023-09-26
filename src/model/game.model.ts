import mongoose, { Document } from "mongoose";
import { SessionDocument } from "./session.model";
import { UserDocument } from "./user.model";
export interface GameDocument extends Document {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
  result: string;
  boardSize: number;
  date: Date;
  moves: [string];
}
const gameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  result: String,
  boardSize: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  moves: [String],
});
export default mongoose.model<GameDocument>("Game", gameSchema);

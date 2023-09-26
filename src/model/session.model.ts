import mongoose, { Document } from "mongoose";
// import { MovieDocument } from "./movie.model";
// import { TheatreDocument } from "./theatre.model";
import { UserDocument } from "./user.model";

export interface SessionDocument extends Document {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
  result: string;
  boardSize: number;
  date: Date;
  moves: [number];
}
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  result: String,
  boardSize: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  moves: [Number],
});

export default mongoose.model<SessionDocument>("Session", sessionSchema);

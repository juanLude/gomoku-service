import mongoose, { Document } from "mongoose";

export interface MovesDocument extends Document {
  moves: [number];
}

const movesSchema = new mongoose.Schema({
  moves: [Number],
});

export default mongoose.model<MovesDocument>("Moves", movesSchema);

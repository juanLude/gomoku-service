import express, { Request, Response } from "express";
import {
  getGamesByFilter,
  createGame,
  getGamesByUserId,
  updateBooking,
} from "../service/game.service";
import validateSchema from "../middleware/validateSchema";
import { createGameSchema } from "../schema/game.schema";
import mongoose from "mongoose";
import { deserializeUser } from "../middleware/deserializeUser";

import { intersection } from "lodash";

import { updateBookingSchema } from "../schema/booking.schema";

const gameHandler = express.Router();
gameHandler.use(deserializeUser);

// Get games for current user
gameHandler.get("/", async (req: Request, res: Response) => {
  // decode user id from token
  const userId = req.userId;
  const games = await getGamesByUserId(userId);
  console.log("games:", games);
  return res.status(200).json(games);
});

// Modify a booking
gameHandler.put(
  "/:id",
  validateSchema(updateBookingSchema),
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const booking = req.body;
    const bookingId = req.params.id;

    const newBooking = await updateBooking(bookingId, userId, {
      ...booking,
      userId,
    });
    if (!newBooking) return res.sendStatus(404);

    return res.status(200).json(newBooking);
  }
);

gameHandler.post(
  "/",
  validateSchema(createGameSchema),
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const game = req.body;

    const gamesForTheSession = await getGamesByFilter({
      sessionId: new mongoose.Types.ObjectId(game.sessionId),
    });

    const allOccupiedBoxes = gamesForTheSession.length
      ? gamesForTheSession.map((b) => b.moves).flat()
      : [];
    const overlappingBoxes = !!intersection(allOccupiedBoxes, game.moves)
      .length;
    if (overlappingBoxes) return res.sendStatus(400);

    const newGame = await createGame({ ...game, userId });

    return res.status(200).send(newGame);
  }
);

export default gameHandler;

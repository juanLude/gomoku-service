import express, { Request, Response } from "express";
import validateSchema from "../middleware/validateSchema";
import {
  createNewGameSchema,
  deleteNewGameSchema,
  getNewGameSchema,
  updateNewGameSchema,
} from "../schema/newGame.schema";
import mongoose from "mongoose";
import { deserializeUser } from "../middleware/deserializeUser";
import {
  createNewGame,
  deleteNewGame,
  getNewGameByFilter,
  getNewGameById,
  getNewGamesByUserId,
  updateNewGame,
} from "../service/newGame.service";

const newGameHandler = express.Router();
newGameHandler.use(deserializeUser);
newGameHandler.get("/", async (req: Request, res: Response) => {
  const userId = req.userId;
  const bookings = await getNewGamesByUserId(userId);
  return res.status(200).json(bookings);
});

newGameHandler.get(
  "/:id",
  validateSchema(getNewGameSchema),
  async (req: Request, res: Response) => {
    const sessionId = req.params.id;

    const newGame = await getNewGameById(sessionId);
    if (!newGame) return res.sendStatus(404);
    console.log("newGame: ", newGame);
    return res.status(200).json({ ...newGame });
  }
);
newGameHandler.post(
  "/",
  validateSchema(createNewGameSchema),
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const boardSize = parseInt(req.body.boardSize, 10);
    const moves = req.body.moves;
    const position = req.body.position;
    const gameResult = req.body.gameResult;

    const newGame = await createNewGame({
      userId,
      boardSize,
      gameResult,
      moves,
      position,
    });

    return res.status(200).send(newGame);
  }
);
newGameHandler.put(
  "/:id",
  validateSchema(updateNewGameSchema),
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const sessionId = req.params.id;
      const booking = req.body;

      const position = req.body.position;
      const gameOver = req.body.gameOver;
      const updatedMoves = req.body.moves;
      const boardSize = req.body.boardSize;
      const isResetRequested = req.body.reset === true;
      if (isResetRequested) {
        const updatedNewGame = await updateNewGame(sessionId, {
          gameResult: null,
          boardSize,
          position,
          userId,
          moves: Array(parseInt(boardSize, 10) * parseInt(boardSize, 10)).fill(
            null
          ),
        });
        return res.status(200).json({ updatedNewGame });
      }

      // Calculate the game state
      const gameResult = calculateGameResult(boardSize, updatedMoves);

      const updatedNewGame = await updateNewGame(sessionId, {
        ...booking,
        userId,
        gameOver,
        updatedMoves,
        gameResult: gameResult.winner,
      });

      if (gameResult.gameOver) {
        return res.status(200).json({ updatedNewGame });
      } else {
        return res.status(200).json(updatedNewGame);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred." });
    }
  }
);
newGameHandler.delete(
  "/:id",
  validateSchema(deleteNewGameSchema),
  async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const booking = await getNewGameByFilter({
      _id: new mongoose.Types.ObjectId(bookingId),
    });
    if (!booking) {
      return res.sendStatus(404);
    }
    const userId = req.userId;
    await deleteNewGame(bookingId, userId);

    return res.sendStatus(200);
  }
);

// Function to calculate the game result
type Player = "Black" | "White";

interface GameResult {
  winner: Player | "Draw" | null;
  gameOver: boolean;
}

const calculateGameResult = (
  boardSize: number,
  moves: (Player | null)[]
): GameResult => {
  const checkForWinner = (
    player: Player,
    row: number,
    col: number,
    dr: number,
    dc: number
  ): boolean => {
    let count = 0;
    while (
      row >= 0 &&
      row < boardSize &&
      col >= 0 &&
      col < boardSize &&
      moves[row * boardSize + col] === player
    ) {
      count++;
      row += dr;
      col += dc;
    }
    return count >= 5;
  };
  console.log("boardSize from function:", boardSize);
  // Check for a winner in all directions
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const player = moves[row * boardSize + col];
      if (!player) continue;

      const directions: [number, number][] = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
      ];

      for (const [dr, dc] of directions) {
        if (
          player !== null &&
          (checkForWinner(player, row, col, dr, dc) ||
            checkForWinner(player, row, col, -dr, -dc))
        ) {
          return { winner: player, gameOver: true };
        }
      }
    }
  }
  // Check draw case
  if (moves.every((move) => move !== null)) {
    return { winner: "Draw", gameOver: true };
  }

  return { winner: null, gameOver: false };
};

export default newGameHandler;

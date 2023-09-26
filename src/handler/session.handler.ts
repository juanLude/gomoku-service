import express, { Request, Response } from "express";

import { getSessionByIdSchema } from "../schema/session.schema";
import validateSchema from "../middleware/validateSchema";
import { getSessionById } from "../service/session.service";
// import { getMovieById } from "../service/movie.service";
// import { getTheatreById } from "../service/theatre.service";
import { getGamesBySessionId, getGamesByFilter } from "../service/game.service";
import { deserializeUser } from "../middleware/deserializeUser";

const sessionHandler = express.Router();
sessionHandler.use(deserializeUser);
// Get session details, expecting movie, session, theatre, booked seats and occupied seats
sessionHandler.get(
  "/:id",
  validateSchema(getSessionByIdSchema),
  async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const userId = req.userId;
    // const userId = "64fd11862654a66e0afb6fb4";
    console.log("userId: ", userId);
    const session = await getSessionById(sessionId);
    console.log("sessionId: ", sessionId);
    console.log("session: ", session);
    if (!session) return res.sendStatus(404);
    // const movie = await getMovieById(session.movieId);
    // if (!movie) return res.sendStatus(400);
    // const theatre = await getTheatreById(session.theatreId);
    // if (!movie) return res.sendStatus(400);

    const allBookings = await getGamesBySessionId(sessionId);
    const userBookings = await getGamesByFilter({ sessionId, userId });
    console.log("allGames:", allBookings);
    console.log("userGames:", userBookings);
    // const occupiedBoxes = allBookings.map((b) => b.moves).flat();
    // const userMoves = userBookings.map((b) => b.moves).flat();
    //const userGameId = userBooking?.;

    // TODO: calculate user booked seats
    return res.status(200).json({ ...session });
  }
);

export default sessionHandler;

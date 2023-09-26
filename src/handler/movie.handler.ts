// import express, { Request, Response } from "express";

// import validateSchema from "../middleware/validateSchema";

// import { getMovieByIdSchema } from "../schema/movie.schema";

// import { getAllMovies, getMovieById } from "../service/movie.service";
// import { getSessionsByMovieId } from "../service/session.service";

// const movieHandler = express.Router();

// // Get ALL movies
// movieHandler.get("/", async (req: Request, res: Response) => {
//   try {
//     const result = await getAllMovies();
//     return res.status(200).send(
//       result.map((m) => ({
//         _id: m._id,
//         title: m.title,
//         poster: m.poster,
//       }))
//     );
//   } catch (err) {
//     return res.status(500).send(err);
//   }
// });

// // GET movie by ID, expecting movie + session info
// movieHandler.get(
//   "/:id",
//   validateSchema(getMovieByIdSchema),
//   async (req: Request, res: Response) => {
//     const movieId = req.params.id;

//     const movie = await getMovieById(movieId);
//     if (!movie) return res.sendStatus(404);
//     const sessions = await getSessionsByMovieId(movieId);
//     return res.status(200).json({ ...movie, sessions });
//   }
// );

// export default movieHandler;

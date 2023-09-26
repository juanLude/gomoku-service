import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./util/connectDB";
// import movieHandler from "./handler/movie.handler";
import authHandler from "./handler/auth.handler";
import gameHandler from "./handler/game.handler";
import sessionHandler from "./handler/session.handler";
import cors from "cors";
import newGameHandler from "./handler/newGame.handler";
// import sessionHandler from "./handler/session.handler";
dotenv.config();

connectDB();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.allowHost || true, // Use the value of process.env.allowHost
  })
);
// app.use("/api/movies", movieHandler);
app.use("/api/auth", authHandler);
app.use("/api/games", gameHandler);
app.use("/api/newGame", newGameHandler);
app.use("/api/sessions", sessionHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Hola World!");
});

// only listen to request when DB connection is established
mongoose.connection.once("connected", () => {
  console.log("⚡️[server]: Connected to MongoDB.");
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});

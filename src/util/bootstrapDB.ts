import "dotenv/config";
import connect from "./connectDB";

import UserModel from "../model/user.model";
import users from "../data/user.json";

// import MovieModel from "../model/movie.model";
// import movies from "../data/movies.json";

import SessionModel from "../model/session.model";
import sessions from "../data/sessions.json";

import GameModel from "../model/game.model";
import games from "../data/games.json";
// The code essentially initializes or resets the database with new data for users, movies, and sessions
const run = async () => {
  try {
    await connect();

    //Clear existing data and insert new user data
    await UserModel.deleteMany();
    await UserModel.insertMany(users);

    //Clear existing data and insert new movie data
    // await MovieModel.deleteMany();
    // await MovieModel.insertMany(movies);

    // Clear existing data and insert new session data
    await SessionModel.deleteMany();
    await SessionModel.insertMany(sessions);

    await GameModel.deleteMany();
    await GameModel.insertMany(games);

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

run();

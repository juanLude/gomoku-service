import {
  string,
  object,
  number,
  date,
  TypeOf,
  array,
  custom,
  nullable,
  boolean,
} from "zod";

const payload = {
  body: object({
    // sessionId: string({
    //   required_error: "Session id is required",
    // }),
    boardSize: number({
      required_error: "Board size is required",
    }).optional(),
    // result: string({
    //   required_error: "Result is required",
    // }),
    // moves: array(
    //   number({
    //     required_error: "Moves are required",
    //   })
    // ),
    // position: number(),
    position: array(number()).optional().default([]),
    // winner: nullable(string()),
    // gameOver: boolean().optional(),
    gameResult: nullable(string()),
    moves: array(nullable(string())).optional(),
  }),
};

const getParams = {
  params: object({
    id: string({
      required_error: "Session id is required",
    }),
  }),
};
const updateDeleteParams = {
  params: object({
    id: string({
      required_error: "Session id is required",
    }),
  }),
};
export const updateNewGameSchema = object({
  ...payload,
  ...updateDeleteParams,
});
export const createNewGameSchema = object({
  ...payload,
});
export const getNewGameSchema = object({
  ...getParams,
});
export const deleteNewGameSchema = object({
  ...updateDeleteParams,
});
export type CreateNewGameInput = TypeOf<typeof createNewGameSchema>;
export type ReadNewGamesInput = TypeOf<typeof getNewGameSchema>;
export type DeleteNewGameInput = TypeOf<typeof deleteNewGameSchema>;

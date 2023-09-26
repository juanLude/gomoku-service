import { string, object, number, date, TypeOf, array } from "zod";

const payload = {
  body: object({
    sessionId: string({
      required_error: "Session id is required",
    }),
    result: string({
      required_error: "Result is required",
    }),
    boardSize: string({
      required_error: "Board size is required",
    }),
    // date: string({
    //   required_error: "Date is required",
    // }),
    moves: array(
      number({
        required_error: "Moves are required",
      })
    ).nonempty(),
  }),
};

const getParams = {
  params: object({
    sessionId: string({
      required_error: "Session id is required",
    }),
  }),
};
export const createGameSchema = object({
  ...payload,
});
export const getGamesSchema = object({
  ...getParams,
});

export type CreateGameInput = TypeOf<typeof createGameSchema>;
export type ReadGamesInput = TypeOf<typeof getGamesSchema>;

// import { string, object, TypeOf, array, number } from "zod";
// const payload = {
//   body: object({
//     sessionId: string({
//       required_error: "Session id is required",
//     }),
//     moves: array(
//       number({
//         required_error: "Seats are required",
//       })
//     ).nonempty(),
//   }),
// };
// const params = {
//   params: object({
//     id: string({
//       required_error: "Movie id is required",
//     }),
//   }),
// };
// //updateMovesSchema
// export const getMovesByIdSchema = object({
//   ...params,
// });
// export const updateMovesSchema = object({
//   ...payload,
// });
// export type updateMovesSchema = TypeOf<typeof updateMovesSchema>;
// export type getMovesByIdSchema = TypeOf<typeof updateMovesSchema>;

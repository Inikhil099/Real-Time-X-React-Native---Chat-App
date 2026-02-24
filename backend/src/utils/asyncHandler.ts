import type { Request, Response } from "express";
export function asyncHandler(cb: Function) {
  return async function (req: Request, res: Response) {
    try {
      const result = await cb(req, res);
      return result;
    } catch (error) {
      console.log(error);
      return res.status(500).send("Sorry Internal Server Error");
    }
  };
}

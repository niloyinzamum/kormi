import multer from "multer";
import { NextRequest, NextResponse } from "next/server";

const storage = multer.memoryStorage();
export const uploadFile = multer({ storage });

export function uploadFileMiddleware(
  req: NextRequest,
  res: NextResponse,
  fn: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

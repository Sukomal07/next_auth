import { NextRequest } from "next/server";
import JWT from "jsonwebtoken";
import { connectDb } from "@/db/db";

connectDb();

export const verifyJWT = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      throw new Error("Please log in again");
    }
    const decode: any = await JWT.verify(token, process.env.TOKEN_SECRET!);

    return decode.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

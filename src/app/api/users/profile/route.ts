import { connectDb } from "@/db/db";
import { verifyJWT } from "@/helpers/verifyJWT";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function GET(request: NextRequest) {
  const id = await verifyJWT(request);
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "User details", user }, { status: 200 });
}

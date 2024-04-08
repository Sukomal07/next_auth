import { connectDb } from "@/db/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const user = await User.findOne({
      verifiedToken: token,
      verifiedTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "verified token is invalid or expire" },
        { status: 400 }
      );
    }
    user.isVerified = true;
    user.verifiedToken = undefined;
    user.verifiedTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: "user verified successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { connectDb } from "@/db/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";
connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { usernameOremail, password } = reqBody;

    if (!usernameOremail) {
      return NextResponse.json(
        { error: "username or email is required" },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }
    const user = await User.findOne({
      $or: [{ email: usernameOremail }, { username: usernameOremail }],
    }).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    const isCorrectPassword = await bcryptjs.compare(password, user.password);
    if (!isCorrectPassword) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
    }

    user.password = undefined;

    const tokenData = {
      id: user._id,
      username: user.username,
    };

    const token = await JWT.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
    const response = NextResponse.json(
      { message: "Log in successfully", success: true, user },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

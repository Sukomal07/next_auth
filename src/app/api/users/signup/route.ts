import { connectDb } from "@/db/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDb();

export async function POST(request: NextRequest) {
  let savedUser;
  try {
    const reqBody = await request.json();

    const { username, name, email, password } = reqBody;

    if (!username || !name || !email || !password) {
      return NextResponse.json(
        { error: "All option is required", success: false },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    }).select("+password");

    if (user) {
      return NextResponse.json(
        { error: "User already exists", success: false },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      name,
      email,
      password: hash,
    });

    const session = await User.startSession();
    session.startTransaction();

    try {
      savedUser = await newUser.save({ session });
      savedUser.password = undefined;
      const subject = "Please verify your email.";
      await sendEmail({
        email,
        subject,
        emailType: "VERIFY",
        userId: savedUser?._id,
      });
      await session.commitTransaction();
    } catch (emailError) {
      await session.abortTransaction();
      await savedUser.deleteOne();
      throw emailError;
    } finally {
      session.endSession();
    }

    return NextResponse.json(
      { message: "User register successfully", success: true, savedUser },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

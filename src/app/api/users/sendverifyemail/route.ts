import { connectDb } from "@/db/db";
import { sendEmail } from "@/helpers/mailer";
import { verifyJWT } from "@/helpers/verifyJWT";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function POST(request: NextRequest) {
  const id = await verifyJWT(request);
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }
  const subject = "Please verify your email.";
  await sendEmail({
    email: user?.email,
    subject,
    emailType: "VERIFY",
    userId: id,
  });
  return NextResponse.json(
    { message: "Email send successfully", success: true },
    { status: 200 }
  );
}

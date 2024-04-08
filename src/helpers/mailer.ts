import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/user.model";

export const sendEmail = async ({ email, subject, emailType, userId }: any) => {
  try {
    const token = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(
        userId,
        {
          verifiedToken: token,
          verifiedTokenExpiry: Date.now() + 3600000,
        },
        { new: true }
      );
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(
        userId,
        {
          forgotPasswordToken: token,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
        { new: true }
      );
    }
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
      },
    });

    const mailOption = {
      from: process.env.AUTH_USER,
      to: email,
      subject: subject,
      html: `
      <p>
      Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${token}">here</a>   to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verifyemail?token=${token}
      </p>
      `,
    };
    const res = await transporter.sendMail(mailOption);
    return res;
  } catch (error: any) {
    throw new Error("Sending mail failed. Please try after some time");
  }
};

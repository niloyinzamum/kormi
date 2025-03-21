import { connectToMongoDB } from "@/lib/database";
import { NextResponse } from "next/server";
import User from "../../models/user";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/sendEmail"; // Use your existing email sender

export async function getOTP(request: Request) {
  try {
    const { email, deviceID } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          status: false,
          message: "ইমেইল প্রয়োজন",
          data: {}
        },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: "ইমেইল পাওয়া যায়নি",
          data: {}
        },
        { status: 404 }
      );
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

    console.log("Generated OTP Expiry:", otpExpiry);

    // Update user with OTP and expiry
    await User.findByIdAndUpdate(
      user._id,
      {
        deviceID,
        otpCode: otp,
        otpExpiry: otpExpiry
      },
      { new: true }
    );

    // Send email with OTP
    await sendPasswordResetEmail({
      email: email,
      otp: otp
    });

    return NextResponse.json({
      status: true,
      message: "ওটিপি সফলভাবে পাঠানো হয়েছে",
      data: {}
    });
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "ওটিপি পাঠানো ব্যর্থ হয়েছে",
        data: {}
      },
      { status: 500 }
    );
  }
}

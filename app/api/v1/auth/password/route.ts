import User from "@/app/api/models/user";
import { connectToMongoDB } from "@/lib/database";
import { generatePasswordResetToken } from "@/lib/generateToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();
    const url = new URL(request.url);

    const body = await request.json();
    const email = body.email;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "ইমেইল/পাসওয়ার্ড অনুরূপ হয়নি" },
        { status: 404 }
      );
    }

    const token = generatePasswordResetToken(user.id, user.email);

    const resetUrl = `${url.origin}/auth/reset-password?token=${token}`;
    const html = `একটি নতুন পাসওয়ার্ড তৈরি করতে লিঙ্কটিতে ক্লিক করুন: ${resetUrl}. লিঙ্কটি ১০ ​​মিনিটের জন্য কাজ করবে।`;

    return NextResponse.json({
      status: "success",
      message: "একটি ইমেইল পাঠানো হয়েছে"
    });

    // const mail = await sendEmail({
    //   to: email,
    //   subject: "একটি নতুন পাসওয়ার্ড তৈরি করুন",
    //   html
    // });

    // if (mail.response.includes("Ok")) {
    //   return NextResponse.json({
    //     status: "success",
    //     message: "Mail sent successfully"
    //   });
    // }
  } catch (error) {
    return NextResponse.json(
      { error: "ইমেইলটি রেজিস্টার্ড নয়!" },
      { status: 404 }
    );
  }
}

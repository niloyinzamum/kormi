import { connectToMongoDB } from "@/lib/database";
import { handleError } from "@/lib/handleErrors";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/api/models/user";
import { authMiddleware } from "@/app/api/middleware/auth";

interface TUserParams {
  params: { userId: string };
}

export async function PATCH(request: NextRequest, { params }: TUserParams) {
  try {
    const userId = params.userId;

    const auth = await authMiddleware(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectToMongoDB();

    const authUser = await User.findById(auth.userId);

    if (!authUser) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 404 }
      );
    }

    if (!authUser.isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to perform this action" },
        { status: 403 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    user.isBanned = user.isBanned !== undefined ? !user.isBanned : true;
    await user.save();

    const message = `User has been successfully ${user.isBanned ? "banned" : "unbanned"}`;
    return NextResponse.json({ status: "success", message });
  } catch (error) {
    return handleError(error);
  }
}

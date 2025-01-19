import { handleError } from "@/lib/handleErrors";
import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/database";
import User from "../../../models/user";
import { authMiddleware } from "../../../middleware/auth";
import Job from "../../../models/job";
import { Applicant } from "@/utils/types/applicant";

const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

export async function GET(request: Request) {
  try {
    const authUser = authMiddleware(request);
    if (authUser instanceof NextResponse) {
      return authUser;
    }

    await connectToMongoDB();

    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const jobs = await Job.find({ user: user?._id });

    const results = [];
    for (const job of jobs) {
      const application = job.applicants.find(
        (item) =>
          item.applicationStatus === "ACCEPTED" &&
          item.statusChangeDate.getTime() <= threeMonthsAgo.getTime() &&
          item.review === null
      );

      if (application) {
        const applicant = await User.findById(application.applicant.id);

        if (applicant)
          results.push({
            _id: applicant.id,
            name: applicant.name,
            role: Number(applicant.role),
            jobId: job.id,
            jobShortDescription: job.shortDescription,
            profilePhoto: applicant.profilePhoto
          } as Applicant);
      }
    }

    // const reviewableUsers = await User.find({
    //   applicationStatus: "ACCEPTED",
    //   statusChangeDate: { $lte: threeMonthsAgo }
    // });

    return NextResponse.json({ status: "success", data: results });
  } catch (error) {
    return handleError(error);
  }
}

import { handleError } from "@/lib/handleErrors";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/database";
import User from "../../../models/user";
import { authMiddleware } from "../../../middleware/auth";

interface TApplicantId {
  params: {
    applicantId: string;
  };
}

export async function GET(request: NextRequest, { params }: TApplicantId) {
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

    const applicantId = params.applicantId;

    const result = await User.aggregate([
      {
        $match: { _id: new ObjectId(applicantId) } // Match the specific user
      },
      {
        $unwind: "$reviews_from_employers" // Unwind the reviews array
      },
      {
        $lookup: {
          from: "jobs", // Collection containing job data
          localField: "reviews_from_employers.jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      {
        $lookup: {
          from: "users", // Collection containing user data
          localField: "reviews_from_employers.reviewerId",
          foreignField: "_id",
          as: "reviewerDetails"
        }
      },
      {
        $project: {
          _id: 0,
          reviewerId: "$reviews_from_employers.reviewerId",
          reviewerName: { $arrayElemAt: ["$reviewerDetails.name", 0] },
          jobId: "$reviews_from_employers.jobId",
          jobTitle: { $arrayElemAt: ["$jobDetails.title", 0] },
          rating: "$reviews_from_employers.rating",
          feedback: "$reviews_from_employers.feedback",
          createdAt: "$reviews_from_employers.reviewCreatedDate"
        }
      },
      {
        $group: {
          _id: null,
          reviews: { $push: "$$ROOT" },
          averageRating: { $avg: "$rating" }
        }
      },
      {
        $project: {
          _id: 0,
          averageRating: { $round: ["$averageRating", 1] }, // Round to 1 decimal place
          reviews: 1
        }
      }
    ]);

    console.log("here: ", result[0]?.reviews);

    const data = {
      averageRating: result[0]?.averageRating || 0,
      reviews: result[0]?.reviews || []
    };

    return NextResponse.json({ status: "success", data: data });
  } catch (error) {
    return handleError(error);
  }
}

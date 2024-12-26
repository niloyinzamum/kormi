import { connectToMongoDB } from "@/lib/database";
import { handleError } from "@/lib/handleErrors";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/api/models/user";
import Job from "@/app/api/models/job";
import { authMiddleware } from "@/app/api/middleware/auth";
import { EDUCATION_PRECEDENCE } from "../../../../../../lib/constant"; // Assuming the constant is in this file.
/**
 * @swagger
 * /api/jobs/apply:
 *   post:
 *     summary: Apply for a job
 *     description: Allows a user to apply for a specific job if their education level meets the required qualification.
 *     tags:
 *       - Jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - userId
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: The ID of the job to apply for.
 *                 example: "64f3b5e2a1e5c92a8e0f1a23"
 *               userId:
 *                 type: string
 *                 description: The ID of the user applying for the job.
 *                 example: "64f3b5e2a1e5c92a8e0f1b56"
 *     responses:
 *       200:
 *         description: Successfully applied for the job.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Applied for the job successfully!"
 *       400:
 *         description: Invalid education level or qualification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid education level or qualification!"
 *       403:
 *         description: The user's education level does not meet the job's qualification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Your education level does not meet the job qualification!"
 *       404:
 *         description: User or job not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found!"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */

export async function POST(request: NextRequest) {
  try {
    const { jobId, userId } = await request.json(); // Extract data from request body

    const authUser = await authMiddleware(request);
    if (authUser instanceof NextResponse) {
      return authUser;
    }

    await connectToMongoDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const jobData: any = await Job.findById(jobId);
    if (!jobData) {
      return NextResponse.json({ error: "Job not found!" }, { status: 404 });
    }

    // Get precedence values for user and job qualifications
    const userEducationPrecedence = Object.keys(EDUCATION_PRECEDENCE).find(
      (key) => Number(key) === Number(user.maxEducationLevel)
    );

    const jobQualificationPrecedence = Object.keys(EDUCATION_PRECEDENCE).find(
      (key) => EDUCATION_PRECEDENCE[key] === jobData.qualification
    );

    if (!userEducationPrecedence || !jobQualificationPrecedence) {
      return NextResponse.json(
        { error: "Invalid education level or qualification!" },
        { status: 400 }
      );
    }

    // Compare precedence (convert keys to numbers for comparison)
    if (
      parseInt(userEducationPrecedence) < parseInt(jobQualificationPrecedence)
    ) {
      return NextResponse.json(
        { error: "Your education level does not meet the job qualification!" },
        { status: 403 }
      );
    }

    // Update user and job data
    user.jobsApplied.push(jobData);
    await user.save();

    jobData.applicants.push(user);
    await jobData.save();

    return NextResponse.json({
      status: true,
      message: "Applied for the job successfully!"
    });
  } catch (error) {
    return handleError(error);
  }
}

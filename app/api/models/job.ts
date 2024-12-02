import { TJob } from "@/utils/types/job";
import mongoose, { Model } from "mongoose";

const jobSchema = new mongoose.Schema<TJob, object>(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    description: { type: String, required: true },
    experience: { type: String, required: true },
    qualification: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    jobPostTime: { type: Date, default: Date.now },
    user: {
      type: mongoose.Schema.Types.String,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Job: Model<TJob> =
  mongoose.models?.Job || mongoose.model("Job", jobSchema);

export default Job;
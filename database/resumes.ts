import { Feedback } from "@/types";
import mongoose, { Schema, Document } from "mongoose";

mongoose.connect(process.env.DATABASE_URL!);

mongoose.Promise = global.Promise;

export interface IResume extends Document {
  userId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  resumePath: string;
  imagePath: string;
  feedback: Feedback;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema(
  {
    userId: String,
    jobTitle: String,
    companyName: String,
    jobDescription: String,
    resumePath: String,
    imagePath: String,
    feedback: Object,
  },
  { timestamps: true }
);

const Resume =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);
export default Resume;

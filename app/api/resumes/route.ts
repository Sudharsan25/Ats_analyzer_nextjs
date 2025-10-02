import Resume from "@/database/resumes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resumes = await Resume.find();

    return NextResponse.json(resumes);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch resumes: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newResume = await Resume.create(data);

    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create resume: ${error}` },
      { status: 500 }
    );
  }
}

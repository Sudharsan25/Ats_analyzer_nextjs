import Resume from "@/database/resumes";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
  await dbConnect();
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const newResume = await Resume.create({ ...data, userId: session.user.id });

    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create resume: ${error}` },
      { status: 500 }
    );
  }
}

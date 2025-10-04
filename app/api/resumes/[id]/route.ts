import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Resume from "@/database/resumes";
import { auth } from "@/lib/auth";

type tParams = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: tParams }) {
  await dbConnect();

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const resume = await Resume.findOne({ _id: id, userId: userId });
    if (!resume) {
      return NextResponse.json(
        { message: `Resume not found with id: ${id}` },
        { status: 404 }
      );
    }
    return NextResponse.json(resume, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error retrieving resume , error: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: tParams }) {
  await dbConnect();

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      body,
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return NextResponse.json(
        { message: `Resume not found with id: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedResume, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error updating resume , error: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: tParams }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedResume = await Resume.findByIdAndDelete(id);
    if (!deletedResume) {
      return NextResponse.json(
        { message: `Resume not found with id: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Resume with id: ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error deleting resume, error: ${error}`,
      },
      { status: 500 }
    );
  }
}

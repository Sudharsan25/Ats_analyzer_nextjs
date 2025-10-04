import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Resume from "@/database/resumes";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Use the find method with a filter object to get all resumes for the user
    const resumes = await Resume.find({ userId: userId });

    if (!resumes) {
      // Even if no resumes are found, it's not an error, just an empty array.
      // A 404 would be more appropriate if the user itself wasn't found.
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: resumes });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Use deleteMany to remove all documents matching the userId
    const result = await Resume.deleteMany({ userId: userId });

    if (result.deletedCount === 0) {
      console.log(`No resumes found for user ID: ${userId} to delete.`);
    }

    // Return a success response, including how many documents were deleted
    return NextResponse.json({
      success: true,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

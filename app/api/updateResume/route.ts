// app/api/resumes/update/route.ts

import Resume from "@/database/resumes";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    // 1. Parse the incoming request body to get the resume ID and the AI feedback
    const { id, feedback } = await request.json();

    // 2. Validate that the necessary data was provided
    if (!id || !feedback) {
      return NextResponse.json(
        { error: "Missing resume ID or feedback data." },
        { status: 400 }
      );
    }

    // 3. Use the Mongoose 'findByIdAndUpdate' method to update the document.
    //    - The first argument is the ID of the document to find.
    //    - The second argument is the data to update. We are setting the 'feedback' field.
    //    - The third argument { new: true } ensures the updated document is returned.
    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      { feedback: feedback },
      { new: true }
    );

    // 4. If no document was found with that ID, return a 404 error
    if (!updatedResume) {
      return NextResponse.json({ error: "Resume not found." }, { status: 404 });
    }

    // 5. Return the updated document with a success status
    return NextResponse.json({ success: true, data: updatedResume });
  } catch (error) {
    console.error("Failed to update resume:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

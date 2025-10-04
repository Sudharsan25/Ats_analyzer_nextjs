import { generateText } from "ai";
import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { auth } from "@/lib/auth";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobDescription, resumePath } = await request.json();

    // Step 1 & 2: Fetch the file and get its buffer
    const response = await fetch(resumePath);
    const fileBuffer = await response.arrayBuffer();
    // Step 3 & 4: Construct the prompt correctly and call the AI model
    const result = await generateText({
      model: google("gemini-2.5-pro"), // Or your preferred model
      messages: [
        {
          role: "user", // TypeScript will correctly infer this as a literal type
          content: [
            {
              type: "text",
              text: `Based on the job description and the attached resume, generate feedback to help improve the resume for better alignment.
               Job Description: ${jobDescription}.
               Provide feedback in the following format:
                overallScore: number;
                ATS: {
                    score: number;
                    tips: {
                    type: "good" | "improve";
                    tip: string;
                    };
                };
                toneAndStyle: {
                    score: number;
                    tips: {
                    type: "good" | "improve";
                    tip: string;
                    explanation: string;
                    }[];
                };
                content: {
                    score: number;
                    tips: {
                    type: "good" | "improve";
                    tip: string;
                    explanation: string;
                    }[];
                };
                structure: {
                    score: number;
                    tips: {
                    type: "good" | "improve";
                    tip: string;
                    explanation: string;
                    }[];
                };
                skills: {
                    score: number;
                    tips: {
                    type: "good" | "improve";
                    tip: string;
                    explanation: string;
                    }[];
                };

               IMPORTANT: The final output must be ONLY the raw, valid JSON object of the provided format for feedback and nothing else.
               Do not include any markdown formatting like \`\`\`json, explanations, or conversational text.
               `,
            },
            {
              type: "file",
              data: new Uint8Array(fileBuffer), // Pass the ACTUAL file buffer
              mediaType: "application/pdf",
            },
          ],
        },
      ],
    });

    const rawAiResponse = result.text;

    // Use a regular expression to find the first occurrence of a JSON object
    const match = rawAiResponse.match(/{[\s\S]*}/);

    if (!match) {
      // If no JSON object is found in the response, throw an error
      throw new Error("AI response did not contain a valid JSON object.");
    }

    // The first match (match[0]) is our clean JSON string
    const jsonString = match[0];

    // Now, parse the sanitized string
    const feedbackObject = JSON.parse(jsonString);

    return NextResponse.json({ feedback: feedbackObject }, { status: 200 });
  } catch (error) {
    console.error("AI feedback generation failed:", error); // Log the full error for diagnostics
    return NextResponse.json(
      { error: "Failed to generate feedback." },
      { status: 500 }
    );
  }
}

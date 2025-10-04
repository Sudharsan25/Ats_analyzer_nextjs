// app/resumes/[id]/page.tsx
"use client"; // 1. This page must be a Client Component to fetch its own data.

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // 2. Import hook to get URL parameters.
import { IResume } from "@/database/resumes";
// 3. Import your shared Mongoose interface for type safety.

export default function ResumeDetailPage() {
  // 4. State variables to manage the component's lifecycle.
  const [resume, setResume] = useState<IResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. Get the dynamic 'id' parameter from the URL.
  const params = useParams();
  const id = params.id as string;

  // 6. useEffect hook to fetch data when the component first renders.
  useEffect(() => {
    if (!id) return; // Don't fetch if the ID isn't available yet.

    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resumes/${id}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Resume not found."
              : "Failed to fetch resume data."
          );
        }

        // 7. Cast the JSON response to your IResume interface for type safety.
        const data = (await response.json()) as IResume;
        console.log("Fetched resume data:", data);
        setResume(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [id]); // The dependency array ensures this runs if the id changes.

  // 8. Render UI based on the current state (loading, error, or success).
  if (isLoading) {
    return <div className="text-white text-center p-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-20">Error: {error}</div>;
  }

  if (!resume) {
    return <div className="text-white text-center p-20">Resume not found.</div>;
  }

  // 9. Render the final UI with the fetched data.
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 text-white">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left">
          Analysis for <span className="text-gray-300">{resume.jobTitle}</span>
        </h1>

        <div className="w-full bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Feedback Details</h2>
          <pre className="bg-gray-900 p-4 rounded-md whitespace-pre-wrap text-sm">
            {JSON.stringify(resume.feedback, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}

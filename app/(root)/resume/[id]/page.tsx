// app/resumes/[id]/page.tsx
"use client"; // 1. This page must be a Client Component to fetch its own data.

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // 2. Import hook to get URL parameters.
import { IResume } from "@/database/resumes";
import { Feedback } from "@/types";
import Image from "next/image";
import Link from "next/link";
import Summary from "@/components/Summary";
import ATS from "@/components/ATS";
import Details from "@/components/Details";
// 3. Import your shared Mongoose interface for type safety.

export default function ResumeDetailPage() {
  // 4. State variables to manage the component's lifecycle.
  const [resume, setResume] = useState<IResume | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
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
        setImageUrl(data.imagePath || "");
        setResumeUrl(data.resumePath || "");
        setFeedback(data.feedback || null);
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
    return (
      <div className="p-20">
        <p className="text-white text-lg font-semibold text-center">
          Loading resumes...{" "}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-20">
        <p className="text-red-500 text-2xl font-extrabold text-center">
          Error: {error}
        </p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="p-20">
        <p className="text-red-500 text-2xl font-extrabold text-center">
          Resume data not available. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <main className="!pt-0">
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit relative">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  width={1265}
                  height={1620}
                  alt="Resume Image"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-white font-bold">Resume Review</h2>
          {feedback ? (
            <div className="text-gray-600 flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <Image
              alt="resume scan"
              src="/images/resume-scan-2.gif"
              className="w-full"
              width={25}
              height={25}
            />
          )}
        </section>
      </div>
    </main>
  );
}

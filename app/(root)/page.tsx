"use client";

import Hero from "@/components/Hero";
import ResumeCard from "@/components/ResumeCard";
import { IResume } from "@/database/resumes"; // Import the Mongoose interface
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  // State for storing the fetched resumes
  const [resumes, setResumes] = useState<IResume[]>([]);
  // State to manage the loading UI
  const [isLoading, setIsLoading] = useState(true);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch("/api/resumes/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // Ensure fresh data on each request
        });
        if (!response.ok) {
          throw new Error("Failed to fetch resumes");
        }

        // This is the critical step for type safety
        const result = (await response.json()) as {
          success: boolean;
          data: IResume[];
        };

        if (result.success) {
          setResumes(result.data);
        } else {
          toast.error("Failed to load resumes. Please try again.");
        }
      } catch (error) {
        toast.error(error as string);
        // Here you could set an error state and show a toast
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []); // Empty dependency array means this runs once on mount

  // Conditional Rendering Logic
  if (isLoading) {
    return (
      <div className="font-sans items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
          <Hero pageType="home" />
          <p className="text-white text-lg font-semibold text-center">
            Loading resumes...{" "}
          </p>
        </main>
      </div>
    ); // Replace with Skeleton Loaders for better UX
  }

  return (
    <div className="font-sans items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        <Hero pageType="home" />
        {resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {resumes.map((resume) => (
              <ResumeCard
                key={String(resume._id)} // Use the unique ID from the database
                id={String(resume._id)}
                jobTitle={resume.jobTitle}
                companyName={resume.companyName}
                ATS={resume.feedback.overallScore} // You'll need to calculate or retrieve this
                imagePath={resume.imagePath}
              />
            ))}
          </div>
        ) : (
          // Empty State: What to show when there are no resumes
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <h2 className="text-2xl font-semibold">
              No Resumes analysis Found
            </h2>
            <p className="text-gray-500">
              Upload your first resume to get started!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

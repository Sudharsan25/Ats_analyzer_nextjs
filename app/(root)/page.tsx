import Hero from "@/components/Hero";
import ResumeCard from "@/components/ResumeCard";
import { dummyResumeAnalysis } from "@/constants";

export default function Home() {
  return (
    <div className="font-sans items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        <Hero />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 ml-48 w-full">
          {dummyResumeAnalysis.map((resume) => (
            <ResumeCard
              key={resume.id}
              id={resume.id}
              jobTitle={resume.jobTitle}
              companyName={resume.companyName}
              ATS={resume.ATS}
              imagePath={resume.imagePath}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

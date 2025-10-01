import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left">
        Optimize your job search with
        <span className="text-gray-600"> Resume analyzer app</span>
      </h1>
      <p className="text-xl text-center sm:text-left">
        {" "}
        Analyze how well your resume matches each job description, with the help
        of this resume analyzer app. Upload or choose uploaded resumes and copy
        paste job descriptions to get personalized ATS score and feedback, to
        help you pass the intial screening of a job application!
      </p>

      <Link
        href="/upload"
        className="border-4 border-white rounded-2xl p-4 cursor-pointer text-2xl font-semibold text-center">
        Upload your resume now
      </Link>
    </div>
  );
};

export default Hero;

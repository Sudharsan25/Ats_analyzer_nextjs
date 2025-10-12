import type { Metadata } from "next";
import "../globals.css";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Free AI Resume Scanner & ATS Checker | Optimize for Any Job",
  description:
    "Get an instant ATS score for your resume. Our AI-powered analyzer checks your resume against any job description to help you improve keywords, formatting, and land more interviews.",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {children}
    </div>
  );
}

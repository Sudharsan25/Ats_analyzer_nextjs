import ResumeUploadForm from "@/components/ResumeUploadForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";

const UploadPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id as string;
  return <ResumeUploadForm userId={userId} />;
};

export default UploadPage;

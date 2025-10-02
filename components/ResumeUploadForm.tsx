"use client";

import FileUploader from "@/components/FileUploader";
import Hero from "@/components/Hero";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { generateUUID } from "@/lib/utils";
import { PutBlobResult } from "@vercel/blob";

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters long"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters long"),
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters long"),
});

interface ResumeUploadProps {
  userId: string;
}

const ResumeUploadForm = ({ userId }: ResumeUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // 1. Pre-condition check: Ensure a file is selected.
    if (!file) {
      alert("Please select a resume file to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      const newBlob = (await response.json()) as PutBlobResult;

      console.log("File uploaded successfully to:", newBlob.url);
      // 3. Construct your data object with the REAL URL from the upload result.
      const data = {
        id: generateUUID(),
        userId: userId,
        jobTitle: values.jobTitle,
        companyName: values.companyName,
        jobDescription: values.jobDescription,
        resumePath: newBlob.url, // Use the public URL returned from Vercel Blob
        imagePath: "", // Image form to be handled later
        feedback: null,
      };

      // 4. Send this metadata to your own backend API.
      await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Successfully sent metadata to /api/resumes:", data);

      handleAnalyze(data.jobDescription, data.resumePath, data.id);

      // 5. Redirect on complete success.
      router.push("/");
    } catch (error) {
      // Handle any errors that occur during the upload or the subsequent fetch.
      console.error("An error occurred during the submission process:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAnalyze = async (
    jobDescription: string,
    resumePath: string,
    id: string
  ) => {
    console.log("Analysis start for:", resumePath);
    const response = await fetch("/api/generateFeedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription, resumePath }),
    });

    if (!response.ok) {
      // Handle potential HTTP errors
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    console.log("Feedback generation complete:", id, data);
    // Update resume API route to accept feedback and store it
  };

  //   const handleAnalyze = async (
  //   jobDescription: string,
  //   imagePath: string,
  //   id: string
  // ) => {
  //   console.log("Analysis start for:", imagePath);

  //   // This function will now throw an error on failure,
  //   // which will be caught by the onSubmit function's catch block.
  //   const response = await fetch("/api/generateFeedback", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ jobDescription, imagePath }),
  //   });

  //   if (!response.ok) {
  //     throw new Error(`AI feedback API failed with status ${response.status}`);
  //   }

  //   const feedbackData = await response.json();
  //   console.log("Feedback generation complete:", feedbackData);

  //   // NEW: Call the update API route with the ID and the received feedback
  //   const updateResponse = await fetch("/api/updateResume", {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id: id, feedback: feedbackData.feedback }),
  //   });

  //   if (!updateResponse.ok) {
  //     throw new Error(`Failed to update resume in DB with status ${updateResponse.status}`);
  //   }

  //   console.log("Successfully stored feedback for resume ID:", id);
  // };

  const handleFileSelect = (fileSelected: File | null) => {
    setFile(fileSelected);
    console.log("File selected:", file);
  };

  return (
    <div className="font-sans items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        <Hero pageType="upload" />
        <div className="w-230">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-white">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Copy and paste the job description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FileUploader onFileSelect={handleFileSelect} />
              <Button type="submit" className="w-full text-md font-semibold">
                {isSubmitting ? "Uploading file..." : "Upload Resume"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default ResumeUploadForm;

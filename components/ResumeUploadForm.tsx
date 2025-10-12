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
import { toast } from "sonner";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import Image from "next/image";

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters long"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters long"),
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters long"),
});

const ResumeUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      toast.error("Please select a resume file to upload.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLODUINARY_UPLOAD_PRESET!
      );

      // Upload the file directly to Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error("Failed to upload file to Cloudinary.");
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const resumePath = cloudinaryData.secure_url;

      // Automatically generate the image URL by changing the file extension
      const imagePath = resumePath.replace(/\.pdf$/, ".jpg");

      const data = {
        jobTitle: values.jobTitle,
        companyName: values.companyName,
        jobDescription: values.jobDescription,
        resumePath: resumePath,
        imagePath: imagePath,
        feedback: null,
      };

      // Create the resume record in the database
      const createResponse = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create resume record.");
      }
      const newResume = await createResponse.json();
      const newResumeId = newResume._id;

      setIsSubmitting(false);
      setIsAnalyzing(true);

      // Trigger the AI analysis and final DB update
      await handleAnalyze(data.jobDescription, data.resumePath, newResumeId);

      toast.success("Your resume has been uploaded and analyzed successfully!");
      router.push(`/resume/${newResumeId}`);
    } catch (error) {
      console.error("An error occurred during the submission process:", error);
      toast.error("The submission process failed. Please try again.");
    } finally {
      // Ensure all loading states are reset
      setIsSubmitting(false);
      setIsAnalyzing(false);
    }
  }

  const handleAnalyze = async (
    jobDescription: string,
    resumePath: string,
    id: string
  ) => {
    const feedbackResponse = await fetch("/api/generateFeedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription, resumePath }),
    });

    if (!feedbackResponse.ok) {
      throw new Error(
        `AI feedback API failed with status ${feedbackResponse.status}`
      );
    }

    const aiData = await feedbackResponse.json();
    const feedbackObject = aiData.feedback;

    const updateResponse = await fetch(`/api/resumes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback: feedbackObject }),
    });

    if (!updateResponse.ok) {
      throw new Error(
        `Failed to update resume in DB. Status: ${updateResponse.status}`
      );
    }
  };

  const handleFileSelect = (fileSelected: File | null) => {
    setFile(fileSelected);
  };

  if (isAnalyzing) {
    return (
      <div className="flex w-full min-h-screen flex-col items-center justify-center gap-4 [--radius:1rem]">
        <Item
          variant="muted"
          className="flex flex-col items-center justify-center">
          <ItemMedia>
            <Image
              src="/images/resume-scan-2.gif"
              alt="Analyzing"
              width={96}
              height={96}
              unoptimized
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className=" text-white text-lg text-center">
              Your resume has been successfully uploaded and is now being
              analyzed.
              <br />
              Please wait while we generate your feedback. This may take a
              moment.
            </ItemTitle>
          </ItemContent>
        </Item>
      </div>
    );
  }

  return (
    <div className="font-sans items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        <Hero pageType="upload" />
        <div className="sm:w-auto md:w-96 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-white ">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Job Title</FormLabel>
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
                    <FormLabel className="text-lg">Company Name</FormLabel>
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
                    <FormLabel className="text-lg">Job Description</FormLabel>
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
              <Button
                type="submit"
                className="w-full text-md font-semibold"
                disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Analyze Resume"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default ResumeUploadForm;

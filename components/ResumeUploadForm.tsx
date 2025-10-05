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

// Imports for the new spinner component
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

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
  // New state to track the AI analysis phase
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
    console.log("Submitting form with values:", values);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLODUINARY_UPLOAD_PRESET!
      );

      // 2. Upload the file directly to Cloudinary
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
      const resumePath = cloudinaryData.secure_url; // The URL of the uploaded PDF

      // 3. Automatically generate the image URL by changing the file extension
      const imagePath = resumePath.replace(/\.pdf$/, ".jpg");

      console.log("File uploaded to Cloudinary:", { resumePath, imagePath });
      const data = {
        jobTitle: values.jobTitle,
        companyName: values.companyName,
        jobDescription: values.jobDescription,
        resumePath: resumePath,
        imagePath: imagePath,
        feedback: null,
      };

      console.log("Data created for DB entry:", data);
      // Step 2: Create the resume record in the database
      const createResponse = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create resume record.");
      }
      const newResume = await createResponse.json();
      const newResumeId = newResume._id; // Using the transformed 'id'

      console.log("New resume created with ID:", newResumeId);
      // Step 3: Switch from "submitting" to "analyzing" state
      setIsSubmitting(false);
      setIsAnalyzing(true);

      // Step 4: Trigger the AI analysis and final DB update
      await handleAnalyze(data.jobDescription, data.resumePath, newResumeId);

      toast.success("Your resume has been uploaded and analyzed successfully!");
      router.push("/");
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
    console.log("Starting AI analysis for resume ID:", id);
    // This function's internal logic remains the same
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

  // Conditionally render the spinner when analysis is in progress
  if (isAnalyzing) {
    return (
      <div className="flex w-full min-h-screen flex-col items-center justify-center gap-4 [--radius:1rem]">
        <Item variant="muted">
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1 text-white">
              Performing AI analysis...
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
        <div className="w-224">
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

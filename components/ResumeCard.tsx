import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ScoreCircle from "./ScoreCircle";
import Image from "next/image";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

interface ResumeCardProps {
  id: string;
  jobTitle: string;
  companyName: string;
  ATS: number;
  imagePath: string;
}
const ResumeCard = ({
  id,
  jobTitle,
  companyName,
  ATS,
  imagePath,
}: ResumeCardProps) => {
  return (
    <Card className="w-full h-100 max-w-sm bg-amber-50 shadow-lg rounded-3xl">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="text-lg font-bold">{jobTitle}</CardTitle>
          <CardDescription className="text-md italic">
            {companyName}
          </CardDescription>
        </div>
        <ScoreCircle score={ATS} />
      </CardHeader>
      <CardContent className="overflow-hidden">
        <Image
          src={imagePath}
          alt={`${jobTitle} at ${companyName}`}
          width={400}
          height={100}
          className="rounded-xl"
        />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full text-md font-semibold"
          onClick={() => redirect(`/resume/${id}`)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeCard;

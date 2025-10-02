export interface ResumeCardProps {
  id: string;
  jobTitle: string;
  companyName: string;
  ATS: number;
  imagePath: string;
}

export interface Resume {
  id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: Text;
  feedback: Feedback;
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}

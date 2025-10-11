# ATS Resume Analyzer

> An AI-powered, full-stack Next.js application designed to optimize your resume
> for any job description by providing instant, detailed feedback.

## 📖 About The Project

In today's competitive job market, most companies use an Applicant Tracking
System (ATS) to filter resumes before they ever reach a human recruiter. This
project was built to help job seekers beat the bots.

This application allows users to upload their resume along with a specific job
description. It then leverages the power of Google's Gemini AI to perform a
detailed analysis, providing an "ATS score" and actionable feedback on how to
improve the resume's content, structure, and keywords to better align with the
job requirements.

## ✨ Features

- **Secure User Authentication:** Full sign-up, sign-in, and session management
  using `better-auth`.
- **PDF Resume Uploads:** Seamless file uploads handled by Cloudinary, with
  automatic PDF-to-image conversion for display.
- **AI-Powered Feedback:** In-depth resume analysis using the **Google Gemini**
  model via the Vercel AI SDK.
- **Detailed Feedback UI:** Feedback is broken down into categories (ATS, Tone &
  Style, etc.) and presented in an interactive accordion.
- **Per-User Rate Limiting:** Protects the AI endpoint from abuse by limiting
  each user to a specific number of requests per day, implemented with Arcjet.
- **Bot Protection:** Middleware-based bot detection to secure the entire
  application.
- **Fully Responsive Design:** A modern, mobile-first UI built with Shadcn/UI
  and Tailwind CSS.

## 🛠️ Tech Stack

This project is built with a modern, type-safe, and scalable technology stack.

| Category           | Technology                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework**      | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) |
| **Language**       | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)                                                                                            |
| **Styling**        | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Shadcn/UI](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge)      |
| **Database**       | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) with Mongoose                                                                                       |
| **Authentication** | `better-auth` (Custom Session Management)                                                                                                                                                                    |
| **File Storage**   | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)                                                                                            |
| **AI**             | ![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E77F0?style=for-the-badge&logo=google-gemini&logoColor=white) & Vercel AI SDK                                                                   |
| **Security**       | Arcjet                                                                                                                                                                                                       |
| **Deployment**     | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)                                                                                                        |

## ⚙️ Application Flow & Architecture

1.  **Authentication:** A user signs up or logs in. Their session is managed via
    a secure, HTTP-only cookie.
2.  **Upload:** The user fills out a form with job details and selects a PDF
    resume. On submit, the client-side code uploads the file directly to
    Cloudinary.
3.  **Record Creation:** The client then sends the job details and the new
    Cloudinary PDF URL to a POST resume endpoint. The server validates the
    request and creates a new resume record in MongoDB.
4.  **AI Analysis Trigger:** The client immediately calls the `generateFeedback`
    route with the necessary data.
5.  **Server-Side Processing:**
    - The `generateFeedback` route fetches the PDF from the Cloudinary URL.
    - It constructs a detailed prompt and sends the PDF data and prompt to the
      Google Gemini API.
    - It receives the JSON feedback, parses it, and calls a `PATCH resume/id`
      endpoint to save the feedback to the corresponding MongoDB document.
6.  **View Results:** The user is redirected to their dashboard where they can
    see all their analyzed resumes and click to view the detailed feedback page.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A MongoDB database instance (e.g., from MongoDB Atlas)
- A Cloudinary account
- A Google AI API Key

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/](https://github.com/)[your-github-username]/[your-repo-name].git
    ```
2.  **Navigate to the project directory**
    ```sh
    cd [your-repo-name]
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Set up environment variables**

    - Create a `.env.local` file in the root of the project.
    - Copy the contents of `.env.example` into it and fill in your credentials.

    ```env
    # .env.example

    # MongoDB
    DATABASE_URL="your_mongodb_connection_string"

    # Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_unsigned_upload_preset"

    # Google AI
    GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key"

    # better-auth
    BETTER_AUTH_URL="http://localhost:3000"
    # ... any other keys required by better-auth

    # Arcjet (if used)
    ARCJET_KEY="your_arcjet_key"
    ```

5.  **Run the development server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see
    the result.

---

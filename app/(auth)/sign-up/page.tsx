import React from "react";

const page = () => {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left">
          Welcome to <span className="text-gray-300">Resume analyzer app</span>
        </h1>
        <p> This is the SignUp page</p>
      </main>
    </div>
  );
};

export default page;

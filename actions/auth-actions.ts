"use server";
// sign-in and sign-up
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return {
      success: true,
      message: "Signed In Successfully!!",
    };
  } catch (error) {
    const e = error as Error;
    console.log("Error occured during signIn:", error);
    return {
      success: false,
      message: `Error occured: ${e.message}`,
    };
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });
    return {
      success: true,
      message: "User created Successfully!!",
    };
  } catch (error) {
    const e = error as Error;
    console.log("Error occured during signUp:", error);
    return {
      success: false,
      message: `Error occured: ${e.message}`,
    };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return {
      message: "User signed out successfully",
      success: true,
    };
  } catch (error) {
    const e = error as Error;
    console.log("Error occured during signOut:", error);
    return {
      success: false,
      message: `Error occured: ${e.message}`,
    };
  }
};

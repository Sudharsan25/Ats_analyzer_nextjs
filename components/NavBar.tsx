"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { User } from "lucide-react";

const NavBar = () => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleWipeData = async () => {
    // 1. CRITICAL: Confirm this destructive action with the user.
    const confirmed = window.confirm(
      "Are you sure you want to delete all of your resume data? This action is permanent and cannot be undone."
    );

    // If the user clicks "Cancel", abort the function.
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      // 2. Call your API route using the DELETE method.
      //    This assumes your DELETE handler is in `app/api/resumes/route.ts`.
      const response = await fetch("/api/resumes", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user data from the server.");
      }

      const result = await response.json();

      // 3. Provide clear success feedback to the user.
      toast.success(
        `Successfully deleted ${result.data.deletedCount} resume(s).`
      );

      // 4. Refresh the page data to update the UI. router.refresh() is a soft
      //    refresh that re-fetches data on the server without a full page reload.
      router.refresh();
    } catch (error) {
      console.error("Failed to wipe data:", error);
      toast.error(
        "An error occurred while deleting your data. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = () => {
    const result = authClient.signOut();
    if (!result) {
      toast.error("Error signing out. Please try again.");
    } else {
      toast.success("Signed out successfully!");
      router.push("/sign-in");
    }
  };

  return (
    <nav className="w-full h-16 flex justify-between bg-black sticky text-white shadow-2xl mt-4">
      <div className="flex gap-4 items-center px-4">
        <Link href="/" className="p-4">
          <Image src="/logo.svg" alt="Logo" width={120} height={90} />
        </Link>
      </div>
      <div className="px-8 py-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <User />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleWipeData}>
              {isDeleting ? "Deleting..." : "Wipe app data"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;

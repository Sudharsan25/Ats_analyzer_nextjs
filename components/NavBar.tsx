"use client";

import Link from "next/link";
import React from "react";
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

  const handleWipeData = () => {
    console.log("Wipe app data clicked!!");
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
              Wipe app data
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

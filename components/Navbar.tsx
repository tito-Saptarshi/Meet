import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { SignOutButton } from "@clerk/nextjs";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const currentDate: Date = new Date();
  const formattedDate: string = currentDate.toISOString().slice(0, 10);
  const formattedTime: string = currentDate.toTimeString().slice(0, 5);
  return (
    <div>
      <header className="flex text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap pt-5 px-5 xl:pb-32 justify-between items-center">
          <Link
            href="/"
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl max-sm:hidden">Meet 2.0</span>
          </Link>
          <nav className="md:ml-auto flex items-center text-base justify-center space-x-4">
            <div className="flex items-center space-x-1 mr-5 max-sm:hidden">
              <span>Time:</span>
              <span>{formattedTime}</span>
            </div>
            <MobileNav />
            <div className="max-sm:hidden">
              <SignOutButton>
                <Button className="relative py-2 px-4 rounded-lg border border-blue-400 uppercase font-semibold tracking-wide text-blue-900 bg-transparent overflow-hidden transition duration-200 ease-in shadow-none hover:bg-blue-500 hover:shadow-lg hover:text-white">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;

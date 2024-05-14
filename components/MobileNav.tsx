"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import sidebarLinks from "@/constants";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px] flex">
      <Sheet>
        <SheetTrigger className="">
          <Menu />
        </SheetTrigger>
        
        <SheetContent side="left">
        <SheetHeader>
          <SheetTitle >
          <Link
            href="/"
            className="max-sm:left-5 flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              className=" w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl">Meet 2.0</span>
          </Link>
          </SheetTitle>
        </SheetHeader>
          <div className="flex flex-col gap-6 pt-5">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.route ||
                pathname.startsWith(`${link.route}/`);

              return (
                <SheetClose key={link.route} asChild>
                  <Link
                    href={link.route}
                    key={link.label}
                    className={cn(
                      "relative py-2 pl-2 text-left rounded-lg border border-blue-400 uppercase font-semibold tracking-wide text-blue-900 bg-transparent overflow-hidden transition duration-200 ease-in shadow-none hover:bg-blue-400 hover:shadow-lg hover:text-white ",
                      {
                        "bg-blue-700 text-white": isActive,
                      }
                    )}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;

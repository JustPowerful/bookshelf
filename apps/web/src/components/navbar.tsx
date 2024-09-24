"use client";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboardIcon, Loader2, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  return (
    <nav className="bg-background border-b fixed top-0 left-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">Bookshelf</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/about">About Us</NavLink>
            </div>
          </div>
          {status !== "loading" ? (
            <>
              {status === "authenticated" ? (
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                      <Link
                        href="/dashboard"
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-full"
                        )}
                      >
                        <LayoutDashboardIcon className="w-4 h-4 mr-1" />
                        Dashboard
                      </Link>
                      <DropdownMenuSeparator />
                      <button
                        onClick={() => signOut()}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-full text-red-500 hover:text-red-600 hover:bg-red-200"
                        )}
                      >
                        <LogOut className="w-4 h-4 mr-1" /> Logout
                      </button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                  <NavButton href="/login">Login</NavButton>
                  <NavButton href="/register">Register</NavButton>
                </div>
              )}
            </>
          ) : (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

function NavButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <div className="relative group">
      <div className="absolute -bottom-1 -right-1 bg-primary opacity-50 rounded-lg w-full h-full"></div>
      <Link href={href} className={cn(buttonVariants({ variant: "button3d" }))}>
        {children}
      </Link>
    </div>
  );
}

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <nav className="bg-background border-b absolute top-0 left-0 w-full">
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
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <NavButton href="/login">Login</NavButton>
            <NavButton href="/register">Register</NavButton>
          </div>
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
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "relative px-5 py-2.5 bg-background hover:bg-primary border-2 border-primary text-primary hover:text-primary-foreground transition-all duration-300 ease-out transform group-hover:translate-y-1 group-hover:translate-x-1"
        )}
      >
        {children}
      </Link>
    </div>
  );
}

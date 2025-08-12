"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  const handleSignupClick = () => {
    router.push("/auth/signup");
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <a
          href="/"
          className="font-semibold tracking-tight text-neutral-900"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
        >
          Interview Helper AI
        </a>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleLoginClick}>
            Log in
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSignupClick}>
            Sign up
          </Button>
        </nav>
      </div>
    </header>
  );
}
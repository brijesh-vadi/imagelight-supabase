import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center relative w-32 h-8">
          <Image
            src="/vercel.svg"
            alt="Logo"
            fill
            className="dark:invert object-contain"
          />
        </Link>
        <Button asChild>
          <Link href="/get-started">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default PublicHeader;

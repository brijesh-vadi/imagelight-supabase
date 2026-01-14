import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center relative w-24 h-6 sm:w-32 sm:h-8">
          <Image
            src="/vercel.svg"
            alt="Logo"
            fill
            className="dark:invert object-contain"
            priority
          />
        </Link>
        <Button asChild size="sm" className="sm:size-default">
          <Link href="/get-started" className="text-xs sm:text-sm">
            <span className="hidden xs:inline">Get Started</span>
            <span className="xs:hidden">Start</span>
            <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default PublicHeader;

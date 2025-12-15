"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      type="button"
      onClick={() => router.back()}
      className="rounded-full h-10 w-10 cursor-pointer"
    >
      <ChevronLeft />
    </Button>
  );
};

export default BackButton;

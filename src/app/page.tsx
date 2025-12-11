import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Link href="/manufacturer/sign-up">
        <Button>Manufacturer</Button>
      </Link>
    </div>
  );
}

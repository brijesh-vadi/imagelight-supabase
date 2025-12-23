import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center gap-10">
      <Button asChild>
        <Link href="/manufacturer/sign-up">Manufacturer</Link>
      </Button>
      <Button asChild>
        <Link href="/dealer/sign-up">Dealer</Link>
      </Button>
      <Button asChild>
        <Link href="/admin/sign-in">admin</Link>
      </Button>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">
          This page could not be found.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/projects">Go to Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


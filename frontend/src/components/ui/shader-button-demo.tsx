import * as React from "react";
import { GradientButton } from "@/components/ui/shader-button";

export default function GradientButtonDemo() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-background p-8 text-foreground">
       <div className="mt-4 flex items-center justify-center gap-4">
        <GradientButton onClick={() => console.log("Standard button click!")}>
          Start
        </GradientButton>
      </div>
    </div>
  );
}

"use client";

import { Suspense } from "react";
import { ValidatorContent } from "@ui/core/validator/validator-content";
import { Card } from "@ui/components/card";
import { Progress } from "@ui/components/progress";

export default function ValidatorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 w-full max-w-md mx-4">
            <Progress value={undefined} className="w-full" />
            <p className="text-center mt-4 text-muted-foreground">
              Loading validator...
            </p>
          </Card>
        </div>
      }
    >
      <ValidatorContent />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";

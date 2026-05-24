"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(
  () => import("swagger-ui-react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-96 w-full" />
      </div>
    ),
  },
);

type SwaggerUIClientProps = {
  url: string;
};

export function SwaggerUIClient({ url }: SwaggerUIClientProps) {
  useEffect(() => {
    const originalError = console.error;

    console.error = (...args: unknown[]) => {
      const first = typeof args[0] === "string" ? args[0] : "";
      const second = typeof args[1] === "string" ? args[1] : "";
      const joined = `${first} ${second}`;

      const isKnownSwaggerStrictModeWarning =
        joined.includes("UNSAFE_componentWillReceiveProps") &&
        (joined.includes("ModelCollapse") || joined.includes("ParameterRow"));

      if (isKnownSwaggerStrictModeWarning) {
        return;
      }

      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div className="min-h-0 min-w-0 [&_.swagger-ui]:font-sans">
      <SwaggerUI
        url={url}
        docExpansion="list"
        defaultModelsExpandDepth={1}
        tryItOutEnabled
        persistAuthorization
      />
    </div>
  );
}

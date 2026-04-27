"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-4 h-96 w-full" />
    </div>
  ),
});

type SwaggerUIClientProps = {
  url: string;
};

export function SwaggerUIClient({ url }: SwaggerUIClientProps) {
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

import { NextResponse } from "next/server";
import { buildOpenApiDocument } from "@/lib/openapi/openapi-document";

/**
 * Serves the OpenAPI JSON used by `/api-docs` (Swagger UI).
 */

/**
 * @swagger
 * /api/openapi:
 *   get:
 *     tags: [Auth]
 *     summary: OpenAPI JSON document
 *     description: Returns the generated OpenAPI specification used by Swagger UI.
 *     responses:
 *       200:
 *         description: OpenAPI specification.
 */
export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const spec = buildOpenApiDocument(origin);
  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

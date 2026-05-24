import path from "node:path";
import swaggerJSDoc from "swagger-jsdoc";

type OpenApiDoc = ReturnType<typeof swaggerJSDoc>;

export function buildOpenApiDocument(baseUrl: string): OpenApiDoc {
  const apiRoot = path.join(process.cwd(), "src/app/api");

  const spec = swaggerJSDoc({
    definition: {
      openapi: "3.0.3",
      info: {
        title: "BIU Lost & Found API",
        version: "1.0.0",
        description:
          "Auto-generated OpenAPI from route handlers under src/app/api." +
          "Sign in on the same origin before using Try it out for cookie-based endpoints.",
      },
      servers: [{ url: baseUrl }],
      tags: [
        { name: "Items", description: "Lost and found item endpoints" },
        { name: "Claims", description: "Claim submission endpoints" },
        { name: "Uploads", description: "Cloudinary upload helpers" },
        {
          name: "Notifications",
          description: "In-app notification feed and read state",
        },
        { name: "Auth", description: "NextAuth.js handlers" },
      ],
      components: {
        securitySchemes: {
          cookieSession: {
            type: "apiKey",
            in: "cookie",
            name: "authjs.session-token",
          },
        },
        schemas: {
          Notification: {
            type: "object",
            properties: {
              id: { type: "string" },
              kind: {
                type: "string",
                enum: ["SYSTEM", "MATCH", "CLAIM", "ITEM"],
              },
              link: { type: "string", nullable: true },
              title: { type: "string" },
              message: { type: "string" },
              read: { type: "boolean" },
              createdAt: { type: "string", format: "date-time" },
            },
            required: ["id", "kind", "title", "message", "read", "createdAt"],
          },
          NotificationsListResponse: {
            type: "object",
            properties: {
              notifications: {
                type: "array",
                items: { $ref: "#/components/schemas/Notification" },
              },
              unreadCount: { type: "integer" },
            },
            required: ["notifications", "unreadCount"],
          },
          MarkReadRequest: {
            type: "object",
            properties: {
              all: { type: "boolean" },
              ids: { type: "array", items: { type: "string" } },
            },
          },
          ErrorResponse: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
            required: ["error"],
          },
        },
      },
      security: [{ cookieSession: [] }],
    },
    apis: [
      path.join(apiRoot, "**/route.ts"),
      path.join(apiRoot, "**/route.js"),
    ],
  });

  return spec;
}

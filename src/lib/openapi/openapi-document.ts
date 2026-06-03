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
          "REST API for BIU Lost & Found. **Start here:** call `POST /api/auth/login` with email/password — the session cookie is set automatically for Try it out on this host. Seed password: `Password123!` (see `pnpm prisma db seed`).",
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
        { name: "Auth", description: "Login, logout, and NextAuth handlers" },
      ],
      components: {
        securitySchemes: {
          cookieSession: {
            type: "apiKey",
            in: "cookie",
            name: "authjs.session-token",
            description:
              "Set automatically by `POST /api/auth/login` (or `__Secure-authjs.session-token` on HTTPS). You usually do not need to paste a value if login was called from Swagger on this site.",
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
          AuthLoginRequest: {
            type: "object",
            properties: {
              email: {
                type: "string",
                format: "email",
                example: "sok.sopheak.student@biu.edu.kh",
              },
              password: {
                type: "string",
                format: "password",
                example: "Password123!",
              },
            },
            required: ["email", "password"],
          },
          AuthLoginResponse: {
            type: "object",
            properties: {
              ok: { type: "boolean", example: true },
              message: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string", nullable: true },
                  name: { type: "string", nullable: true },
                  role: {
                    type: "string",
                    enum: ["STUDENT", "STAFF", "ADMIN"],
                  },
                },
                required: ["id", "role"],
              },
            },
            required: ["ok", "user", "message"],
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

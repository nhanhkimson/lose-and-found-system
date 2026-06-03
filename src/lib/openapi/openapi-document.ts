import { apiPaths } from "@/lib/openapi/paths";

export type OpenApiDoc = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: { url: string }[];
  tags: { name: string; description: string }[];
  paths: typeof apiPaths;
  components: Record<string, unknown>;
  security: { cookieSession: [] }[];
};

export function buildOpenApiDocument(baseUrl: string): OpenApiDoc {
  return {
    openapi: "3.0.3",
    info: {
      title: "BIU Lost & Found API",
      version: "1.0.0",
      description:
        "REST API for BIU Lost & Found.\n\n" +
        "**Swagger quick start:** expand **Auth** → `POST /api/auth/login` → Try it out → use seed credentials → Execute. " +
        "Then try protected routes (Notifications, Claims, etc.). No web login page required.",
    },
    servers: [{ url: baseUrl }],
    tags: [
      {
        name: "Auth",
        description: "Login, logout, and OpenAPI spec",
      },
      {
        name: "Items",
        description: "Lost and found item endpoints",
      },
      {
        name: "Claims",
        description: "Claim submission endpoints",
      },
      {
        name: "Uploads",
        description: "Cloudinary upload helpers",
      },
      {
        name: "Notifications",
        description: "In-app notification feed and read state",
      },
    ],
    paths: apiPaths,
    components: {
      securitySchemes: {
        cookieSession: {
          type: "apiKey",
          in: "cookie",
          name: "authjs.session-token",
          description:
            "Set by POST /api/auth/login. On HTTPS Vercel the cookie may be named __Secure-authjs.session-token; Swagger sends cookies automatically after login.",
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
  };
}

/**
 * OpenAPI 3.0 document for REST routes under `/api/*`.
 * Expand this file as you add or change API handlers.
 */
export function buildOpenApiDocument(baseUrl: string) {
  return {
    openapi: "3.0.3",
    info: {
      title: "BIU Lost & Found API",
      version: "1.0.0",
      description:
        "HTTP API surface for the Next.js App Router. Most routes require a **NextAuth** session cookie (sign in through the app, then use “Try it out” from the same origin). " +
        "Server actions are not included here (they are not HTTP routes).",
    },
    servers: [{ url: baseUrl }],
    tags: [
      { name: "Notifications", description: "In-app notification feed and read state" },
      { name: "Upload", description: "Uploadthing file uploads" },
      { name: "Auth", description: "NextAuth.js handlers" },
    ],
    components: {
      securitySchemes: {
        cookieSession: {
          type: "apiKey",
          in: "cookie",
          name: "authjs.session-token",
          description:
            "NextAuth v5 may use `authjs.session-token` or `__Secure-authjs.session-token` (HTTPS). Log in via /login in the same browser; Swagger cannot attach cookies in cross-origin requests.",
        },
      },
      schemas: {
        Notification: {
          type: "object",
          properties: {
            id: { type: "string" },
            kind: { type: "string", enum: ["SYSTEM", "MATCH", "CLAIM", "ITEM"] },
            link: { type: "string", nullable: true },
            title: { type: "string" },
            message: { type: "string" },
            read: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
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
        },
        MarkReadRequest: {
          type: "object",
          properties: {
            all: { type: "boolean", description: "If true, mark all as read" },
            ids: {
              type: "array",
              items: { type: "string" },
              description: "Mark these notification ids as read",
            },
          },
        },
        Error: {
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
    security: [{ cookieSession: [] }],
    paths: {
      "/api/notifications": {
        get: {
          tags: ["Notifications"],
          summary: "List notifications",
          description: "Returns the latest notifications for the signed-in user and total unread count.",
          parameters: [
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 5, minimum: 1, maximum: 200 },
              description: "Max items to return",
            },
          ],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/NotificationsListResponse" },
                },
              },
            },
            "401": {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/notifications/mark-read": {
        post: {
          tags: ["Notifications"],
          summary: "Mark notifications read",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MarkReadRequest" },
                examples: {
                  all: { value: { all: true } },
                  byIds: { value: { ids: ["clxxxxx1", "clxxxxx2"] } },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": { schema: { type: "object", properties: { ok: { type: "boolean" } } } },
              },
            },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/notifications/stream": {
        get: {
          tags: ["Notifications"],
          summary: "Notification stream (SSE)",
          description: "Server-Sent Events stream with unread count updates. **Not** OpenAPI-executable in Swagger for streaming bodies; use a browser or curl.",
          responses: {
            "200": { description: "text/event-stream" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/notifications/sse": {
        get: {
          tags: ["Notifications"],
          summary: "Notification SSE (alias)",
          description: "Alias of `/api/notifications/stream` for the notifications hook.",
          responses: {
            "200": { description: "text/event-stream" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/uploadthing": {
        get: {
          tags: ["Upload"],
          summary: "Uploadthing handler (GET)",
          description: "Reserved by the Uploadthing Next adapter.",
          responses: { "200": { description: "See Uploadthing docs" } },
        },
        post: {
          tags: ["Upload"],
          summary: "Uploadthing handler (POST)",
          description: "Multipart / JSON uploads as implemented by @uploadthing/next.",
          responses: { "200": { description: "See Uploadthing docs" } },
        },
      },
      "/api/auth/{nextauth}": {
        get: {
          tags: ["Auth"],
          summary: "NextAuth catch-all (GET)",
          description:
            "NextAuth.js App Router under `/api/auth/*` (e.g. session, signin, csrf). See https://authjs.dev",
          parameters: [
            {
              name: "nextauth",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Subpath, e.g. signin, session, providers",
            },
          ],
          responses: { "200": { description: "HTML or JSON depending on subpath" } },
        },
        post: {
          tags: ["Auth"],
          summary: "NextAuth catch-all (POST)",
          description: "Credentials sign-in, callbacks, etc.",
          parameters: [
            {
              name: "nextauth",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { "200": { description: "Redirect or JSON" } },
        },
      },
    },
  };
}

/** OpenAPI path definitions — single source for Swagger UI (avoids fragile JSDoc YAML). */

const json = "application/json";

const err401 = {
  description: "Unauthorized — call POST /api/auth/login first.",
  content: { [json]: { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
};

const cookieSec = [{ cookieSession: [] }];

export const apiPaths = {
  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Sign in (email + password)",
      description:
        "Sets the session cookie for this site. **Use this first in Swagger.** Seed example: `sok.sopheak.student@biu.edu.kh` / `Password123!` (after `pnpm prisma db seed`).",
      security: [],
      requestBody: {
        required: true,
        content: {
          [json]: {
            schema: { $ref: "#/components/schemas/AuthLoginRequest" },
          },
        },
      },
      responses: {
        "200": {
          description: "Signed in; Set-Cookie returned.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/AuthLoginResponse" },
            },
          },
        },
        "400": {
          description: "Validation error.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": {
          description: "Invalid email or password.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/api/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Sign out",
      description: "Clears the session cookie.",
      security: [],
      responses: {
        "200": {
          description: "Signed out.",
          content: {
            [json]: {
              schema: {
                type: "object",
                properties: {
                  ok: { type: "boolean" },
                  message: { type: "string" },
                },
                required: ["ok", "message"],
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register (email + password)",
      description:
        "Creates a PostgreSQL user and returns `sessionToken` for mobile Bearer auth.",
      security: [],
      requestBody: {
        required: true,
        content: {
          [json]: {
            schema: { $ref: "#/components/schemas/AuthRegisterRequest" },
          },
        },
      },
      responses: {
        "201": {
          description: "Account created; session token returned.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/AuthLoginResponse" },
            },
          },
        },
        "400": {
          description: "Validation error or email already exists.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/api/auth/firebase": {
    post: {
      tags: ["Auth"],
      summary: "Exchange Firebase ID token for DLFS session",
      description:
        "Mobile Facebook sign-in: send Firebase `idToken` after client Firebase Auth. Returns the same `sessionToken` shape as POST /api/auth/login.",
      security: [],
      requestBody: {
        required: true,
        content: {
          [json]: {
            schema: { $ref: "#/components/schemas/FirebaseAuthRequest" },
          },
        },
      },
      responses: {
        "200": {
          description: "Session minted for linked Prisma user.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/AuthLoginResponse" },
            },
          },
        },
        "401": {
          description: "Invalid Firebase token.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "503": {
          description: "Firebase Admin not configured on server.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/api/auth/session": {
    get: {
      tags: ["Auth"],
      summary: "Validate session",
      description:
        "Returns current user and profile summary when Bearer token or session cookie is valid.",
      security: cookieSec,
      responses: {
        "200": {
          description: "Active session.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/AuthSessionResponse" },
            },
          },
        },
        "401": err401,
      },
    },
  },
  "/api/items": {
    get: {
      tags: ["Items"],
      summary: "List items",
      security: [],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "q", in: "query", schema: { type: "string" } },
        {
          name: "type",
          in: "query",
          schema: { type: "string", enum: ["LOST", "FOUND"] },
        },
        { name: "category", in: "query", schema: { type: "string" } },
        { name: "building", in: "query", schema: { type: "string" } },
        {
          name: "status",
          in: "query",
          schema: { type: "string", enum: ["OPEN", "RESOLVED", "CLOSED"] },
        },
        { name: "dateFrom", in: "query", schema: { type: "string", format: "date" } },
        { name: "dateTo", in: "query", schema: { type: "string", format: "date" } },
        {
          name: "mine",
          in: "query",
          schema: { type: "boolean", default: false },
          description: "When true, returns only the signed-in user's listings (requires auth).",
        },
      ],
      responses: {
        "200": { description: "Paginated item list." },
      },
    },
    post: {
      tags: ["Items"],
      summary: "Create item listing",
      description: "Requires session cookie from POST /api/auth/login.",
      security: cookieSec,
      requestBody: {
        required: true,
        content: { [json]: { schema: { type: "object" } } },
      },
      responses: {
        "201": { description: "Item created." },
        "400": { description: "Validation error." },
        "401": err401,
      },
    },
  },
  "/api/items/{id}": {
    get: {
      tags: ["Items"],
      summary: "Get item detail",
      security: [],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
        {
          name: "track",
          in: "query",
          schema: { type: "boolean", default: true },
          description: "Increment viewCount when true.",
        },
      ],
      responses: {
        "200": { description: "Item detail." },
        "404": { description: "Not found." },
      },
    },
    patch: {
      tags: ["Items"],
      summary: "Update item status",
      description: "Owner or admin only.",
      security: cookieSec,
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          [json]: {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["OPEN", "RESOLVED", "CLOSED"],
                },
              },
              required: ["status"],
            },
          },
        },
      },
      responses: {
        "200": { description: "Updated." },
        "401": err401,
        "403": { description: "Forbidden." },
        "404": { description: "Not found." },
      },
    },
  },
  "/api/items/{id}/similar": {
    get: {
      tags: ["Items"],
      summary: "Similar items by category",
      security: [],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": { description: "Similar items." },
        "404": { description: "Item not found." },
      },
    },
  },
  "/api/claims": {
    get: {
      tags: ["Claims"],
      summary: "List my claims",
      security: cookieSec,
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
      ],
      responses: {
        "200": { description: "Paginated claims for the signed-in user." },
        "401": err401,
      },
    },
    post: {
      tags: ["Claims"],
      summary: "Create claim",
      security: cookieSec,
      requestBody: {
        required: true,
        content: {
          [json]: {
            schema: {
              type: "object",
              properties: {
                itemId: { type: "string" },
                message: { type: "string", minLength: 30 },
                proofImageUrls: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["itemId", "message"],
            },
          },
        },
      },
      responses: {
        "201": { description: "Claim created." },
        "400": { description: "Validation error." },
        "401": err401,
      },
    },
  },
  "/api/notifications": {
    get: {
      tags: ["Notifications"],
      summary: "List notifications",
      security: cookieSec,
      parameters: [
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", minimum: 1, maximum: 200, default: 5 },
        },
      ],
      responses: {
        "200": {
          description: "Notifications list.",
          content: {
            [json]: {
              schema: {
                $ref: "#/components/schemas/NotificationsListResponse",
              },
            },
          },
        },
        "401": err401,
      },
    },
  },
  "/api/notifications/mark-read": {
    post: {
      tags: ["Notifications"],
      summary: "Mark notifications read",
      security: cookieSec,
      requestBody: {
        required: true,
        content: {
          [json]: {
            schema: { $ref: "#/components/schemas/MarkReadRequest" },
          },
        },
      },
      responses: {
        "200": { description: "Updated." },
        "401": err401,
      },
    },
  },
  "/api/notifications/stream": {
    get: {
      tags: ["Notifications"],
      summary: "Notification stream (SSE)",
      description: "Long-lived `text/event-stream`. Prefer testing in the app, not Swagger.",
      security: cookieSec,
      responses: {
        "200": { description: "SSE stream." },
        "401": err401,
      },
    },
  },
  "/api/notifications/sse": {
    get: {
      tags: ["Notifications"],
      summary: "Notification SSE (alias)",
      description: "Same as /api/notifications/stream.",
      security: cookieSec,
      responses: {
        "200": { description: "SSE stream." },
        "401": err401,
      },
    },
  },
  "/api/dashboard": {
    get: {
      tags: ["Dashboard"],
      summary: "User dashboard",
      description: "Stats, match suggestions, and recent activity for the signed-in user.",
      security: cookieSec,
      responses: {
        "200": { description: "Dashboard payload." },
        "401": err401,
      },
    },
  },
  "/api/profile": {
    get: {
      tags: ["Profile"],
      summary: "Get profile",
      security: cookieSec,
      responses: {
        "200": { description: "Profile with stats and recent activity." },
        "401": err401,
      },
    },
    patch: {
      tags: ["Profile"],
      summary: "Update profile",
      security: cookieSec,
      requestBody: {
        required: true,
        content: {
          [json]: {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", minLength: 2 },
                studentId: { type: "string", maxLength: 50 },
                image: { type: "string" },
              },
              required: ["name", "studentId", "image"],
            },
          },
        },
      },
      responses: {
        "200": { description: "Updated profile." },
        "400": { description: "Validation error." },
        "401": err401,
      },
    },
  },
  "/api/profile/password": {
    post: {
      tags: ["Profile"],
      summary: "Change password",
      description: "Credentials accounts only.",
      security: cookieSec,
      requestBody: {
        required: true,
        content: {
          [json]: {
            schema: {
              type: "object",
              properties: {
                currentPassword: { type: "string" },
                newPassword: { type: "string", minLength: 8 },
                confirmPassword: { type: "string" },
              },
              required: ["currentPassword", "newPassword", "confirmPassword"],
            },
          },
        },
      },
      responses: {
        "200": { description: "Password updated." },
        "400": { description: "Validation error." },
        "401": err401,
      },
    },
  },
  "/api/uploads": {
    post: {
      tags: ["Uploads"],
      summary: "Upload image file (multipart)",
      description:
        "Upload a JPEG or PNG (max 4MB) via Swagger **Choose File**. Requires session from POST /api/auth/login. Returns Cloudinary `url` for use in item/claim payloads (`imageUrls`, `proofImageUrls`).",
      security: cookieSec,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary",
                  description: "Image file (JPEG or PNG, max 4MB)",
                },
                folder: {
                  type: "string",
                  example: "biu-lost-found",
                  description: "Optional Cloudinary folder override",
                },
              },
              required: ["file"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Upload successful.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/UploadImageResponse" },
            },
          },
        },
        "400": {
          description: "Invalid file or validation error.",
          content: {
            [json]: {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        "401": err401,
        "500": { description: "Cloudinary not configured or upload failed." },
      },
    },
  },
  "/api/uploads/signature": {
    post: {
      tags: ["Uploads"],
      summary: "Cloudinary signed upload params (advanced)",
      description:
        "Returns signature fields for direct client → Cloudinary upload. For Swagger file upload, use POST /api/uploads instead.",
      security: cookieSec,
      requestBody: {
        content: {
          [json]: {
            schema: {
              type: "object",
              properties: {
                folder: { type: "string", example: "biu-lost-found" },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Signature payload." },
        "401": err401,
        "500": { description: "Cloudinary not configured." },
      },
    },
  },
  "/api/openapi": {
    get: {
      tags: ["Auth"],
      summary: "OpenAPI JSON",
      security: [],
      responses: {
        "200": { description: "This specification." },
      },
    },
  },
} as const;

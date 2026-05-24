import { handlers } from "@/lib/auth";

/**
 * @swagger
 * /api/auth/{nextauth}:
 * get:
 * tags: [Auth]
 * summary: NextAuth catch-all (GET)
 * parameters:
 * - in: path
 * name: nextauth
 * required: true
 * schema:
 * type: string
 * description: Subpath such as signin, session, providers.
 * responses:
 * 200:
 * description: HTML or JSON depending on subpath.
 * post:
 * tags: [Auth]
 * summary: NextAuth catch-all (POST)
 * parameters:
 * - in: path
 * name: nextauth
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Redirect or JSON depending on subpath.
 */
export const { GET, POST } = handlers;

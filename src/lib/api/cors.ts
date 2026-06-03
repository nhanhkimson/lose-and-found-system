import { NextResponse, type NextRequest } from "next/server";

const CORS_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const CORS_HEADERS =
  "Content-Type, Authorization, X-Requested-With, Accept, Origin";
const CORS_MAX_AGE = "86400";

function parseBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value.trim() === "") return defaultValue;
  const v = value.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return defaultValue;
}

function parseOriginList(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

export type ApiCorsConfig = {
  enabled: boolean;
  allowAll: boolean;
  allowedOrigins: string[];
};

/** Defaults: CORS on, allow any origin (`*`). */
export function getApiCorsConfig(): ApiCorsConfig {
  return {
    enabled: parseBool(process.env.API_CORS_ENABLED, true),
    allowAll: parseBool(process.env.API_CORS_ALLOW_ALL, true),
    allowedOrigins: parseOriginList(process.env.API_CORS_ORIGINS),
  };
}

function resolveAllowOrigin(
  request: NextRequest,
  config: ApiCorsConfig,
): string | null {
  if (!config.enabled) return null;

  if (config.allowAll) return "*";

  const requestOrigin = request.headers.get("origin");
  if (!requestOrigin) return null;

  if (config.allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return null;
}

export function applyApiCorsHeaders(
  request: NextRequest,
  response: NextResponse,
  config: ApiCorsConfig = getApiCorsConfig(),
): NextResponse {
  const allowOrigin = resolveAllowOrigin(request, config);
  if (!allowOrigin) return response;

  response.headers.set("Access-Control-Allow-Origin", allowOrigin);
  response.headers.set("Access-Control-Allow-Methods", CORS_METHODS);
  response.headers.set("Access-Control-Allow-Headers", CORS_HEADERS);
  response.headers.set("Access-Control-Max-Age", CORS_MAX_AGE);

  if (allowOrigin !== "*") {
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.append("Vary", "Origin");
  }

  return response;
}

export function apiCorsPreflightResponse(
  request: NextRequest,
  config: ApiCorsConfig = getApiCorsConfig(),
): NextResponse {
  const allowOrigin = resolveAllowOrigin(request, config);

  if (!config.enabled || !allowOrigin) {
    return new NextResponse(null, { status: 204 });
  }

  const res = new NextResponse(null, { status: 204 });
  return applyApiCorsHeaders(request, res, config);
}

export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

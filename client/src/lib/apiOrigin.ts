export const isGitHubPagesBuild = import.meta.env.BASE_URL === "/pipeline/";

export function getRuntimeApiOrigin(): string | undefined {
  const configured = import.meta.env.VITE_API_ORIGIN || "";
  if (typeof window === "undefined") return configured || undefined;
  const stored = window.localStorage.getItem("pipeline-api-origin") || "";
  return stored || configured || undefined;
}

export const staticPagesNeedsBackend = isGitHubPagesBuild && !getRuntimeApiOrigin();

export function getTrpcUrl(apiOrigin: string | undefined, isPagesBuild = false): string {
  const raw = apiOrigin || "";
  const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  if (normalized) return `${normalized}/api/trpc`;
  return isPagesBuild ? "/__pipeline_server_required__" : "/api/trpc";
}

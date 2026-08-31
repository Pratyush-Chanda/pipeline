export function getTrpcUrl(apiOrigin: string | undefined, isPagesBuild = false): string {
  const raw = apiOrigin || "";
  const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  if (normalized) return `${normalized}/api/trpc`;
  return isPagesBuild ? "/__pipeline_server_required__" : "/api/trpc";
}

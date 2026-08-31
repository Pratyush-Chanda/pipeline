export type NavigableResult = Record<string, any>;

export type PipelineRoute = "home" | "search" | "watch" | "channel" | "playlist" | "history" | "subscriptions" | "library";

export function pageRoute(path: string): PipelineRoute {
  if (path === "/search") return "search";
  if (path.startsWith("/watch/")) return "watch";
  if (path.startsWith("/channel/")) return "channel";
  if (path.startsWith("/playlist/")) return "playlist";
  if (path === "/history") return "history";
  if (path === "/subscriptions") return "subscriptions";
  if (path === "/library" || path === "/playlists") return "library";
  return "home";
}

export function chooseWebMirror(mirrors: NavigableResult[]): string | null { return mirrors.find(item => item.webHealthy && item.uri)?.uri || null; }

export function webFallbackUrl(source: string, options: { id?: string; query?: string }): string { const base = source.endsWith("/") ? source.slice(0, -1) : source; return options.id ? `${base}/watch?v=${encodeURIComponent(options.id)}` : `${base}/search?q=${encodeURIComponent(options.query || "")}`; }

export function resultHref(item: NavigableResult): string | null {
  if (item.type === "channel" && item.authorId) return `/channel/${item.authorId}`;
  if (item.type === "playlist" && item.playlistId) return `/playlist/${item.playlistId}`;
  const videoId = item.videoId || item.id;
  return videoId ? `/watch/${videoId}` : null;
}

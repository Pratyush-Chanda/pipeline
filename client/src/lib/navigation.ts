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

export function resultHref(item: NavigableResult): string | null {
  if (item.type === "channel" && item.authorId) return `/channel/${item.authorId}`;
  if (item.type === "playlist" && item.playlistId) return `/playlist/${item.playlistId}`;
  const videoId = item.videoId || item.id;
  return videoId ? `/watch/${videoId}` : null;
}

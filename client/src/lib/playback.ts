export type PlaybackStream = { url: string; label: string; container: string };
type StreamLike = Record<string, any>;

export function getPlayableStreams(data: StreamLike): PlaybackStream[] {
  const progressive = (data.formatStreams || []).filter((item: StreamLike) => item.url).map((item: StreamLike) => ({ url: item.url, label: item.qualityLabel || item.quality || item.resolution || "Standard", container: item.container || "video" }));
  const adaptive = (data.adaptiveFormats || []).filter((item: StreamLike) => item.url && item.type?.includes("video") && (item.type?.includes("audio") || /codecs=[^;]*,/i.test(item.type || ""))).map((item: StreamLike) => ({ url: item.url, label: item.qualityLabel || item.resolution || "Adaptive", container: item.container || "video" }));
  return [...progressive, ...adaptive].filter((item, index, all) => all.findIndex(other => other.url === item.url) === index);
}

const VIDEO_URL_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(?:[?#].*)?$/i;

export function isVideoUrl(url: string) {
  return VIDEO_URL_PATTERN.test(url.trim());
}

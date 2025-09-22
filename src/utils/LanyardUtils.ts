import { Spotify, YoutubeMusic, type Root } from "./LanyardTypes";
const youtubeMusicApplicationIds = [
  "834475359071633499" // Venipa/ytmdesktop2
];

export const discordMediaProxyRegex = /^mp:external\//;
export const discordAppAssetRegex = /^(\d+)$/;
const proxyUrl = "https://images-ext-1.discordapp.net/external/";
const createReplaceAppAsset = (appId: string) => (url: string) =>
	url.replace(discordAppAssetRegex, `https://cdn.discordapp.com/app-assets/${appId}/$1.png?size=160`).replace(discordMediaProxyRegex, proxyUrl);
export const parseLanyardData = (res: Root) => {
  if (res.success) {
    const youtubeMusic = res.data.activities.find((activity) => activity.type === 2 && youtubeMusicApplicationIds.includes(activity.application_id ?? ""));
    if (!youtubeMusic) {
      Object.assign(res.data, {
        listening_to_youtube_music: false,
        youtube_music: null,
      });
      return res;
    }
    const replaceAppAsset = createReplaceAppAsset(youtubeMusic.application_id!);
    const [artist, ...album] = youtubeMusic.state.split(", ");
    Object.assign(res.data, {
      listening_to_youtube_music: true,
      youtube_music: youtubeMusic?.assets?.large_image ? {
        track_id: null,
        timestamps: youtubeMusic.timestamps,
        song: youtubeMusic.details,
        artist: artist.replace(/^by ?/, ""),
        album_art_url: youtubeMusic.assets?.large_image ? replaceAppAsset(youtubeMusic.assets.large_image) : null,
        album: album?.length ? album.join(", ") : null,
        activity: youtubeMusic,
      } : null,
    });
  }
  return res;
};

export const extractAlbumState = (state: Root["data"]): {album: Spotify | YoutubeMusic, isListening: true} | {album: null, isListening: false} => {
  const spotify = state.listening_to_spotify ? state.spotify : null;
  const youtubeMusic = state.listening_to_youtube_music ? state.youtube_music : null;
  if (spotify) return { album: spotify, isListening: true };
  if (youtubeMusic) return { album: youtubeMusic, isListening: true };
  return { album: null, isListening: false };
};
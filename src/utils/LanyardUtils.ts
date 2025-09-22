import { type Root } from "./LanyardTypes";
const youtubeMusicApplicationIds = [
  "834475359071633499" // Venipa/ytmdesktop2
];
export const parseLanyardData = (res: Root) => {
  if (res.success) {
    const youtubeMusic = res.data.activities.find((activity) => activity.type === 2 && youtubeMusicApplicationIds.includes(activity.application_id ?? ""));
    Object.assign(res.data, {
      listening_to_youtube_music: !!youtubeMusic,
      youtube_music: youtubeMusic?.assets?.large_image ? {
        track_id: youtubeMusic.assets?.large_image,
        timestamps: youtubeMusic.timestamps,
        song: youtubeMusic.assets?.large_text,
        artist: youtubeMusic.assets?.large_text,
        album_art_url: youtubeMusic.assets?.large_image,
        album: youtubeMusic.assets?.large_text,
      } : null,
    });
  }
  return res;
};
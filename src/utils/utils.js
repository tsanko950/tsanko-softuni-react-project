export const convertYouTubeEmbedLink = (youtubeLink) => {
    const url = new URL(youtubeLink);
    const videoId = url.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    } else {
      return youtubeLink;
    }
};

export const getDuration = (mins) => {
    if (mins < 60) {
      return `${mins} min`;
    } else {
      const hours = Math.floor(mins / 60);
      const minsRest = mins % 60;
  
      if (minsRest === 0) {
        return `${hours} h`;
      } else {
        return `${hours} h ${minsRest} min`;
      }
    }
  };
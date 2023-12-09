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

export const getDateTime = (seconds) => {
  const date = new Date(seconds * 1000);
  const formatedDatetime = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${formatHour(date)}`;
  return formatedDatetime;
};

export const formatHour = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
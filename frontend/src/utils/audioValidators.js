export const validateSoundCloudUrl = (url) => {
  const soundcloudPatterns = [
    /^https?:\/\/(www\.)?soundcloud\.com\/[\w-]+\/[\w-]+/,
    /^https?:\/\/(www\.)?soundcloud\.com\/[\w-]+\/sets\/[\w-]+/
  ];
  
  return soundcloudPatterns.some(pattern => pattern.test(url));
};

export const validateSpotifyUrl = (url) => {
  const spotifyPatterns = [
    /^https?:\/\/(open\.)?spotify\.com\/(track|album|playlist|episode|show)\/[a-zA-Z0-9]+/,
    /^spotify:(track|album|playlist|episode|show):[a-zA-Z0-9]+$/
  ];
  
  return spotifyPatterns.some(pattern => pattern.test(url));
};

export const getAudioPlatform = (url) => {
  if (validateSoundCloudUrl(url)) return 'soundcloud';
  if (validateSpotifyUrl(url)) return 'spotify';
  return null;
};

export const isAudioUrl = (url) => {
  return getAudioPlatform(url) !== null;
};

// Get audio metadata (title, artist, etc.)
export const getAudioMetadata = async (url) => {
  const platform = getAudioPlatform(url);
  
  if (!platform) {
    throw new Error('Unsupported audio platform');
  }

  try {
    switch (platform) {
      case 'soundcloud':
        return await getSoundCloudMetadata(url);
      case 'spotify':
        return await getSpotifyMetadata(url);
      default:
        throw new Error('Platform not supported');
    }
  } catch (error) {
    console.error('Error fetching audio metadata:', error);
    return {
      title: 'Audio Track',
      artist: 'Unknown Artist',
      platform: platform
    };
  }
};

const getSoundCloudMetadata = async (url) => {
  // SoundCloud oEmbed API
  const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(oembedUrl);
    const data = await response.json();
    
    return {
      title: data.title || 'SoundCloud Track',
      artist: data.author_name || 'Unknown Artist',
      thumbnail: data.thumbnail_url,
      platform: 'soundcloud',
      description: data.description
    };
  } catch (error) {
    throw new Error('Failed to fetch SoundCloud metadata');
  }
};

const getSpotifyMetadata = async (url) => {
  // For Spotify, we'd need to use their Web API
  // This is a simplified version - in production you'd need proper API integration
  
  const match = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (!match) {
    throw new Error('Invalid Spotify URL');
  }

  const [, type, id] = match;
  
  // This would require Spotify Web API credentials
  // For now, return basic info
  return {
    title: `Spotify ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    artist: 'Spotify',
    platform: 'spotify',
    type: type,
    id: id
  };
};

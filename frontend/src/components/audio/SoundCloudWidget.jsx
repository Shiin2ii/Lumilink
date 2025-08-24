import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

const SoundCloudWidget = ({ 
  trackUrl, 
  autoPlay = false, 
  showArtwork = true, 
  color = "ff5500",
  height = 166,
  className = "" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract track ID from SoundCloud URL
  const getSoundCloudEmbedUrl = (url) => {
    if (!url) return null;
    
    // SoundCloud oEmbed API để lấy embed code
    const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23${color}&auto_play=${autoPlay}&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=${showArtwork}`;
    
    return embedUrl;
  };

  const embedUrl = getSoundCloudEmbedUrl(trackUrl);

  useEffect(() => {
    if (embedUrl) {
      setIsLoading(false);
    } else {
      setError('Invalid SoundCloud URL');
      setIsLoading(false);
    }
  }, [embedUrl]);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-red-600">
          <SpeakerWaveIcon className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      <iframe
        width="100%"
        height={height}
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={embedUrl}
        className="rounded-lg"
        title="SoundCloud Player"
      />
    </motion.div>
  );
};

export default SoundCloudWidget;

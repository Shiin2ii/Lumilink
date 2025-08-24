import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MusicalNoteIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SpotifyEmbed = ({ 
  spotifyUrl, 
  width = "100%", 
  height = 352,
  theme = "0", // 0 = dark, 1 = light
  compact = false,
  className = "" 
}) => {
  const [embedUrl, setEmbedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Spotify URL to embed URL
  const getSpotifyEmbedUrl = (url) => {
    if (!url) return null;

    try {
      // Extract Spotify ID from various URL formats
      let spotifyId = null;
      let type = null;

      // Handle different Spotify URL formats
      const patterns = [
        /spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/,
        /open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/,
        /spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]+)/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          type = match[1];
          spotifyId = match[2];
          break;
        }
      }

      if (!spotifyId || !type) {
        throw new Error('Invalid Spotify URL format');
      }

      // Build embed URL
      const baseUrl = 'https://open.spotify.com/embed';
      const params = new URLSearchParams({
        utm_source: 'generator',
        theme: theme
      });

      if (compact) {
        params.append('view', 'compact');
      }

      return `${baseUrl}/${type}/${spotifyId}?${params.toString()}`;

    } catch (err) {
      console.error('Error parsing Spotify URL:', err);
      return null;
    }
  };

  useEffect(() => {
    const url = getSpotifyEmbedUrl(spotifyUrl);
    if (url) {
      setEmbedUrl(url);
      setError(null);
    } else {
      setError('Invalid Spotify URL. Please use a valid Spotify track, album, or playlist URL.');
    }
    setIsLoading(false);
  }, [spotifyUrl, theme, compact]);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-red-600">
          <ExclamationTriangleIcon className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 ${className}`} style={{ height }}>
        <div className="animate-pulse flex items-center justify-center h-full">
          <div className="text-center">
            <MusicalNoteIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <div className="text-gray-500">Loading Spotify...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      <iframe
        src={embedUrl}
        width={width}
        height={height}
        frameBorder="0"
        allowTransparency="true"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
        title="Spotify Player"
      />
    </motion.div>
  );
};

export default SpotifyEmbed;

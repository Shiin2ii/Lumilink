import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  PauseIcon, 
  MusicalNoteIcon,
  ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/outline';
import { BrandIcon } from '../icons/BrandIcons';
import SoundCloudWidget from '../audio/SoundCloudWidget';
import SpotifyEmbed from '../audio/SpotifyEmbed';

const AudioLinkCard = ({ 
  link, 
  index, 
  theme = 'default',
  showPreview = true,
  onClick 
}) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Detect audio platform
  const getAudioPlatform = (url) => {
    if (url.includes('soundcloud.com')) return 'soundcloud';
    if (url.includes('spotify.com') || url.includes('open.spotify.com')) return 'spotify';
    return 'unknown';
  };

  const platform = getAudioPlatform(link.url);

  const handleCardClick = () => {
    if (onClick) {
      onClick(link);
    } else {
      window.open(link.url, '_blank');
    }
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    setShowPlayer(!showPlayer);
  };

  const renderAudioPlayer = () => {
    if (!showPlayer) return null;

    switch (platform) {
      case 'soundcloud':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <SoundCloudWidget 
              trackUrl={link.url}
              height={166}
              autoPlay={false}
              showArtwork={true}
            />
          </motion.div>
        );
      
      case 'spotify':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <SpotifyEmbed 
              spotifyUrl={link.url}
              height={152}
              compact={true}
              theme="0"
            />
          </motion.div>
        );
      
      default:
        return (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center text-gray-600">
            <MusicalNoteIcon className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm">Audio preview not available</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
        <div onClick={handleCardClick}>
          <div className="flex items-center space-x-4">
            {/* Platform Icon */}
            <div className="flex-shrink-0">
              {platform !== 'unknown' ? (
                <BrandIcon brand={platform} size={48} />
              ) : (
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <MusicalNoteIcon className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Link Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg truncate">
                {link.title}
              </h3>
              {link.description && (
                <p className="text-white/70 text-sm mt-1 line-clamp-2">
                  {link.description}
                </p>
              )}
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-white/60 text-xs uppercase tracking-wide">
                  {platform === 'soundcloud' ? 'SoundCloud' : 
                   platform === 'spotify' ? 'Spotify' : 'Audio'}
                </span>
                {link.isNew && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {showPreview && platform !== 'unknown' && (
                <button
                  onClick={handlePreviewClick}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title={showPlayer ? 'Hide Preview' : 'Show Preview'}
                >
                  {showPlayer ? (
                    <PauseIcon className="w-5 h-5 text-white" />
                  ) : (
                    <PlayIcon className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
              
              <button
                onClick={handleCardClick}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ArrowTopRightOnSquareIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {renderAudioPlayer()}
      </div>
    </motion.div>
  );
};

export default AudioLinkCard;

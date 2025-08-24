import React, { useState, useEffect, useRef } from 'react';
import { VideoBackgroundManager, USER_VIDEO_SETTINGS } from '../config/videoBackgrounds';

const VideoBackground = ({ 
  videoId = 'DEMON_SLAYER',
  quality = 'FULL_HD',
  isMuted = true,
  className = '',
  onVideoLoad = () => {},
  onVideoError = () => {},
  style = {}
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [videoConfig, setVideoConfig] = useState(null);

  useEffect(() => {
    const config = VideoBackgroundManager.getVideoConfig(videoId);
    setVideoConfig(config);
    setHasError(false);
    setIsLoading(true);
  }, [videoId]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleVideoLoad = () => {
    setIsLoading(false);
    onVideoLoad();
  };

  const handleVideoError = (error) => {
    console.error('Video loading error:', error);
    setHasError(true);
    setIsLoading(false);
    onVideoError(error);
  };

  const handleVideoEnd = (e) => {
    // Force loop for seamless playback
    e.target.currentTime = 0;
    e.target.play();
  };

  if (!videoConfig) {
    return (
      <div className={`bg-black flex items-center justify-center ${className}`}>
        <p className="text-white/60">Video không tìm thấy</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-gray-900 to-black flex items-center justify-center ${className}`}
        style={{
          backgroundImage: videoConfig.poster ? `url(${videoConfig.poster})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center text-white/60">
          <p className="mb-2">Không thể tải video</p>
          <p className="text-sm">{videoConfig.name}</p>
        </div>
      </div>
    );
  }

  const sources = VideoBackgroundManager.generateResponsiveSources(videoConfig);
  const defaultSettings = USER_VIDEO_SETTINGS.DEFAULT;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm opacity-60">Đang tải {videoConfig.name}...</p>
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay={defaultSettings.autoPlay}
        loop={defaultSettings.loop}
        muted={isMuted}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        style={{
          filter: `contrast(${defaultSettings.effects.contrast}) saturate(${defaultSettings.effects.saturate}) brightness(${defaultSettings.effects.brightness})`,
          imageRendering: 'crisp-edges',
          ...style
        }}
        poster={videoConfig.poster}
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onEnded={handleVideoEnd}
        controls={defaultSettings.showControls}
      >
        {sources.map((source, index) => (
          <source
            key={index}
            src={source.src}
            type={source.type}
            media={source.media}
          />
        ))}
        <p className="text-white">
          Trình duyệt của bạn không hỗ trợ video HTML5.
        </p>
      </video>

      {/* Overlay Gradient */}
      {defaultSettings.overlay.enabled && (
        <div 
          className={`absolute inset-0 bg-gradient-to-b ${defaultSettings.overlay.gradient}`}
          style={{ opacity: defaultSettings.overlay.opacity }}
        />
      )}

      {/* Video Info (Debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs p-2 rounded">
          <p>Video: {videoConfig.name}</p>
          <p>Quality: {quality}</p>
          <p>Duration: {videoConfig.duration}s</p>
          <p>Audio: {videoConfig.hasAudio ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default VideoBackground;

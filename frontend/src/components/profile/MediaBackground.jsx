import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MediaBackground = ({ background, onMediaLoad, className = "", videoRef: externalVideoRef }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // Audio enabled by default
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const internalVideoRef = useRef(null);
  const videoRef = externalVideoRef || internalVideoRef; // Use external ref if provided
  const audioRef = useRef(null);

  useEffect(() => {
    if (background?.type === 'video' && videoRef.current) {
      const video = videoRef.current;

      const handleLoadStart = () => {
        setIsLoading(true);
        setLoadProgress(0);
        setHasError(false);
      };

      const handleProgress = () => {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const duration = video.duration;
          if (duration > 0) {
            setLoadProgress((bufferedEnd / duration) * 100);
          }
        }
      };

      const handleLoadedData = () => {
        setIsLoading(false);
        setLoadProgress(100);
        setHasError(false);
        if (onMediaLoad) onMediaLoad();
      };

      const handleCanPlay = () => {
        setIsLoading(false);
        setLoadProgress(100);
      };

      const handleError = (e) => {
        console.error('Video failed to load:', background.url, e);
        setIsLoading(false);
        setHasError(true);
      };

      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('progress', handleProgress);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('progress', handleProgress);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [background, onMediaLoad]);

  useEffect(() => {
    if (background?.audio && audioRef.current) {
      const audio = audioRef.current;
      audio.volume = 0.3; // Default volume

      const handleAudioLoad = () => {
      };

      const handleAudioError = (e) => {
        console.error('Audio error:', e);
      };

      audio.addEventListener('loadeddata', handleAudioLoad);
      audio.addEventListener('error', handleAudioError);

      if (isPlaying && !isMuted && audioEnabled) {
        audio.play().catch((error) => {
          console.error('Audio play failed:', error);
        });
      } else {
        audio.pause();
      }

      return () => {
        audio.removeEventListener('loadeddata', handleAudioLoad);
        audio.removeEventListener('error', handleAudioError);
      };
    }
  }, [background?.audio, isPlaying, isMuted, audioEnabled]);

  const enableAudio = async () => {
    if (audioRef.current && background?.audio) {
      try {
        await audioRef.current.play();
        setAudioEnabled(true);
        setIsMuted(false);

      } catch (error) {

      }
    }
  };

  const togglePlay = () => {
    if (background?.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const restartMedia = () => {
    if (background?.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
    if (background?.audio && audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isMuted) {
        audioRef.current.play();
      }
    }
  };

  if (!background) {
    console.log('⚠️ [MediaBackground] No background provided');
    return null;
  }

  console.log('🎬 [MediaBackground] Rendering background:', {
    type: background.type,
    url: background.url,
    poster: background.poster
  });

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Gradient Background */}
      {background.type === 'gradient' && (
        <div className={`absolute inset-0 ${background.value}`} />
      )}

      {/* Image Background */}
      {background.type === 'image' && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background.url})` }}
        />
      )}

      {/* Video Background */}
      {background.type === 'video' && (
        <>
          {/* Fallback Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900" />

          {/* Simple Video Background with Audio */}
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover z-10 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000 cursor-pointer`}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            preload="auto"
            poster={background.poster}
            onClick={() => {
              // Enable audio on user interaction
              if (videoRef.current && !isMuted) {
                videoRef.current.muted = false;
                videoRef.current.play().catch(console.error);
              }
            }}
            onLoadedData={() => {
              console.log('✅ [MediaBackground] Video loaded successfully:', background.url);
              setIsLoading(false);
              setHasError(false);
              if (onMediaLoad) onMediaLoad();
            }}
            onError={(error) => {
              console.error('❌ [MediaBackground] Video background error:', {
                url: background.url,
                error: error,
                target: error.target,
                networkState: error.target?.networkState,
                readyState: error.target?.readyState,
                errorCode: error.target?.error?.code,
                errorMessage: error.target?.error?.message
              });

              // Try to fetch the video URL to check if it's accessible
              fetch(background.url, { method: 'HEAD' })
                .then(response => {
                  console.log('🔍 [MediaBackground] Video URL check:', {
                    status: response.status,
                    contentType: response.headers.get('content-type'),
                    contentLength: response.headers.get('content-length')
                  });
                })
                .catch(fetchError => {
                  console.error('🚫 [MediaBackground] Video URL not accessible:', fetchError);
                });

              setHasError(true);
              setIsLoading(false);
            }}
            onLoadStart={() => {
              console.log('🔄 [MediaBackground] Video loading started:', {
                url: background.url,
                type: background.type,
                fullUrl: background.url.startsWith('http') ? background.url : `${window.location.origin}${background.url}`
              });
            }}
            onCanPlay={() => {
              console.log('▶️ [MediaBackground] Video can play:', background.url);
            }}
          >
            <source src={background.url} type={background.mimetype || 'video/mp4'} />
            <source src={background.url} type="video/webm" />
            <source src={background.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Loading */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/90 to-blue-900/95 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center text-white">
                  {/* Enhanced Loading Animation */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 w-12 h-12 border-2 border-purple-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>

                  {/* Loading Text */}
                  <motion.p
                    className="text-lg font-medium mb-4"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Loading video experience...
                  </motion.p>

                  {/* Progress Bar */}
                  <div className="w-64 bg-white/20 rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-white/70">{Math.round(loadProgress)}% loaded</p>

                  {/* Loading Tips */}
                  <motion.p
                    className="text-xs text-white/60 mt-4 max-w-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    💡 Tip: Video backgrounds create immersive experiences for your lumilink!
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Error */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900 flex items-center justify-center"
              >
                <div className="text-center text-white p-4">
                  <p className="text-sm mb-2">Failed to load video</p>
                  <p className="text-xs text-gray-400 mb-3 break-all">{background.url}</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setHasError(false);
                        setIsLoading(true);
                        // Force reload the video element
                        if (videoRef.current) {
                          videoRef.current.load();
                        }
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 border border-blue-400 rounded"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => {
                        // Try to open video URL in new tab for debugging
                        window.open(background.url, '_blank');
                      }}
                      className="text-xs text-gray-400 hover:text-gray-300 px-2 py-1 border border-gray-400 rounded"
                    >
                      Test URL
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* GIF Background */}
      {background.type === 'gif' && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background.url})` }}
        />
      )}

      {/* Audio Element */}
      {background.audio && (
        <audio
          ref={audioRef}
          loop
          muted={isMuted}
          preload="auto"
        >
          <source src={background.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}







      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

export default MediaBackground;

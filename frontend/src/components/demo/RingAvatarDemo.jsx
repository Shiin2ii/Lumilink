import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import RingAvatarSettings from '../ui/RingAvatarSettings';
import RingAvatar from '../ui/RingAvatar';

const RingAvatarDemo = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const [ringSettings, setRingSettings] = useState({
    ringColor: 'gradient',
    animation: 'rotate',
    thickness: 4,
    speed: 'normal',
    ringPosition: 'around',
    overlayOpacity: 0.7,
    decorationImage: null
  });

  // Demo user data
  const demoUser = {
    username: 'demo_user',
    displayName: 'Demo User',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face'
  };

  // Load decorations from public folder
  useEffect(() => {
    const loadDecorations = () => {
      // Sample decorations - in real app, you'd fetch this list from API or scan directory
      const decorationList = [
        'a_duck.png',
        'angel.png',
        'angry.png',
        'arcane_sigil.png',
        'astronaut_helmet.png',
        'aurora.png',
        'autumn_crown.png',
        'baby_displacer_beast.png',
        'balance.png',
        'ballerina.png',
        'batarang.png',
        'beach_hat.png',
        'berry_bunny.png',
        'black_hole.png',
        'blade_storm.png',
        'bloodthirsty.png',
        'blue_gyroscope.png',
        'blue_hyper_helmet.png',
        'blue_mana.png',
        'blueberry_jam.png',
        'cat_ears.png',
        'cat_ears_blue.png',
        'cat_ears_green.png',
        'cat_ears_purple.png',
        'cat_ears_yellow.png',
        'crystal_ball_blue.png',
        'crystal_ball_purple.png',
        'cyber_katana.png',
        'devil.png',
        'dragon_balls.png',
        'fire.png',
        'fox_hat.png',
        'ghost.png',
        'golden_hex.png',
        'heart_to_heart.png',
        'ice_cube.png',
        'kitsune.png',
        'lightning.png',
        'magic_portal_blue.png',
        'magic_portal_purple.png',
        'phoenix.png',
        'sakura.png',
        'skull_medallion.png',
        'snowglobe.png',
        'unicorn.png',
        'wizard_hat_blue.png',
        'wizard_hat_purple.png'
      ];

      const decorationObjects = decorationList.map((filename, index) => ({
        id: index + 1,
        name: filename.replace('.png', '').replace(/_/g, ' '),
        filename,
        path: `/decorations/${filename}`,
        category: 'misc'
      }));

      setDecorations(decorationObjects);
    };

    loadDecorations();
  }, []);

  const handleApplySettings = (newSettings) => {
    setRingSettings(newSettings);
  };

  const handleSelectDecoration = (decoration) => {
    setSelectedDecoration(decoration);
    setRingSettings(prev => ({
      ...prev,
      decorationImage: decoration.path,
      ringColor: 'image'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Ring Avatar Demo
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Preview Section */}
          <div className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Avatar Preview</h2>

            <div className="flex justify-center mb-8">
              <RingAvatar
                user={demoUser}
                size="2xl"
                ringSettings={ringSettings}
              />
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={() => setShowSettings(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-lg transition-colors"
              >
                🎨 Customize Ring
              </button>
            </div>
          </div>

          {/* Avatar Decoration Section */}
          <div className="bg-gray-800 rounded-xl p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5" />
                      AVATAR DECORATION
                    </h3>
                    <p className="text-purple-100 text-sm">
                      Miscellaneous decorations and quest rewards
                    </p>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Decorations Grid */}
            <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
              {/* None Option */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDecoration(null);
                  setRingSettings(prev => ({
                    ...prev,
                    decorationImage: null,
                    ringColor: 'gradient'
                  }));
                }}
                className={`
                  aspect-square bg-gray-700 rounded-lg border-2 cursor-pointer
                  flex items-center justify-center transition-all
                  ${!selectedDecoration ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 hover:border-gray-500'}
                `}
              >
                <span className="text-gray-400 text-xs">None</span>
              </motion.div>

              {/* Decoration Items */}
              {decorations.map((decoration) => (
                <motion.div
                  key={decoration.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectDecoration(decoration)}
                  className={`
                    aspect-square bg-gray-700 rounded-lg border-2 cursor-pointer
                    overflow-hidden transition-all relative
                    ${selectedDecoration?.id === decoration.id ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 hover:border-gray-500'}
                  `}
                >
                  <img
                    src={decoration.path}
                    alt={decoration.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="w-full h-full flex items-center justify-center text-gray-400 text-xs hidden"
                  >
                    {decoration.name.slice(0, 3)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected Decoration Info */}
            {selectedDecoration && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-white font-medium capitalize">
                  {selectedDecoration.name}
                </p>
                <p className="text-gray-400 text-sm">
                  Avatar decoration applied
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Test Buttons */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-4">
            {/* Ring Position Toggle */}
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setRingSettings(prev => ({ ...prev, ringPosition: 'around' }))}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  ringSettings.ringPosition === 'around'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                }`}
              >
                ⭕ Around
              </button>
              <button
                onClick={() => setRingSettings(prev => ({ ...prev, ringPosition: 'overlay' }))}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  ringSettings.ringPosition === 'overlay'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                }`}
              >
                🎭 Overlay
              </button>
            </div>

            {/* Color Presets */}
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setRingSettings(prev => ({ ...prev, ringColor: 'gradient', animation: 'rotate' }))}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
              >
                Gradient
              </button>
              <button
                onClick={() => setRingSettings(prev => ({ ...prev, ringColor: 'rainbow', animation: 'rotate' }))}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Rainbow
              </button>
              <button
                onClick={() => setRingSettings(prev => ({ ...prev, ringColor: 'pulse', animation: 'pulse' }))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Pulse
              </button>
            </div>
          </div>
        </div>

        {/* Settings Display */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Ring Color:</span>
              <p className="text-white font-medium capitalize">{ringSettings.ringColor}</p>
            </div>
            <div>
              <span className="text-gray-400">Position:</span>
              <p className="text-white font-medium capitalize">{ringSettings.ringPosition}</p>
            </div>
            <div>
              <span className="text-gray-400">Animation:</span>
              <p className="text-white font-medium capitalize">{ringSettings.animation}</p>
            </div>
            <div>
              <span className="text-gray-400">Thickness:</span>
              <p className="text-white font-medium">{ringSettings.thickness}px</p>
            </div>
            <div>
              <span className="text-gray-400">Speed:</span>
              <p className="text-white font-medium capitalize">{ringSettings.speed}</p>
            </div>
            <div>
              <span className="text-gray-400">Decoration:</span>
              <p className="text-white font-medium capitalize">
                {selectedDecoration ? selectedDecoration.name : 'None'}
              </p>
            </div>
          </div>

          {ringSettings.ringPosition === 'overlay' && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm">
                <span className="text-gray-400">Overlay Opacity:</span>
                <span className="text-white font-medium ml-2">{Math.round(ringSettings.overlayOpacity * 100)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Ring Avatar Settings Modal */}
        <RingAvatarSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          user={demoUser}
          onApply={handleApplySettings}
          initialSettings={ringSettings}
        />
      </div>
    </div>
  );
};

export default RingAvatarDemo;

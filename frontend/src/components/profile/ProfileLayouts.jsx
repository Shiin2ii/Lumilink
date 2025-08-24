import React from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

// Default Layout
export const DefaultLayout = ({ profile, links, onLinkClick, containerVariants, itemVariants }) => (
  <div className="space-y-6">
    {/* Profile Header */}
    <motion.div variants={itemVariants} className="text-center">
      <div className="relative mx-auto mb-6">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden">
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.displayName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <UserIcon className="w-16 h-16 text-white/70" />
          )}
        </div>
        

      </div>

      <h1 className="text-3xl font-bold text-white mb-2">{profile.displayName}</h1>
      <p className="text-white/80 text-lg mb-6">@{profile.username}</p>
      <p className="text-white/70 text-sm leading-relaxed px-4">{profile.bio}</p>
    </motion.div>

    {/* Links */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {links.map((link) => (
        <motion.button
          key={link.id}
          onClick={() => onLinkClick(link)}
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="block w-full p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                {link.icon}
              </div>
              <div>
                <div className="text-white font-medium group-hover:text-white/90 transition-colors">
                  {link.title}
                </div>
                <div className="text-white/60 text-sm">
                  {link.clicks?.toLocaleString()} clicks
                </div>
              </div>
            </div>
            <ArrowTopRightOnSquareIcon className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
          </div>
        </motion.button>
      ))}
    </motion.div>
  </div>
);

// Grid Layout
export const GridLayout = ({ profile, links, onLinkClick, containerVariants, itemVariants }) => (
  <div className="space-y-6">
    {/* Profile Header */}
    <motion.div variants={itemVariants} className="text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden mb-4">
        {profile.avatar ? (
          <img 
            src={profile.avatar} 
            alt={profile.displayName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <UserIcon className="w-12 h-12 text-white/70" />
        )}
      </div>
      <h1 className="text-2xl font-bold text-white mb-1">{profile.displayName}</h1>
      <p className="text-white/80 mb-4">@{profile.username}</p>
      <p className="text-white/70 text-sm">{profile.bio}</p>
    </motion.div>

    {/* Links Grid */}
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3"
    >
      {links.map((link) => (
        <motion.button
          key={link.id}
          onClick={() => onLinkClick(link)}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group text-center"
        >
          <div className="text-3xl mb-2">{link.icon}</div>
          <div className="text-white font-medium text-sm group-hover:text-white/90 transition-colors">
            {link.title}
          </div>
        </motion.button>
      ))}
    </motion.div>
  </div>
);

// Minimal Layout
export const MinimalLayout = ({ profile, links, onLinkClick, containerVariants, itemVariants }) => (
  <div className="space-y-8">
    {/* Profile Header */}
    <motion.div variants={itemVariants} className="text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden mb-4">
        {profile.avatar ? (
          <img 
            src={profile.avatar} 
            alt={profile.displayName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <UserIcon className="w-10 h-10 text-white/70" />
        )}
      </div>
      <h1 className="text-xl font-bold text-white mb-1">{profile.displayName}</h1>
      <p className="text-white/60 text-sm">@{profile.username}</p>
    </motion.div>

    {/* Links */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {links.map((link) => (
        <motion.button
          key={link.id}
          onClick={() => onLinkClick(link)}
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="block w-full p-2.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 group text-left"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{link.icon}</span>
            <span className="text-white font-medium text-sm group-hover:text-white/90 transition-colors">
              {link.title}
            </span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  </div>
);

// Card Layout
export const CardLayout = ({ profile, links, onLinkClick, containerVariants, itemVariants }) => (
  <div className="space-y-6">
    {/* Profile Card */}
    <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden mb-4">
        {profile.avatar ? (
          <img 
            src={profile.avatar} 
            alt={profile.displayName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <UserIcon className="w-12 h-12 text-white/70" />
        )}
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{profile.displayName}</h1>
      <p className="text-white/80 mb-3">@{profile.username}</p>
      <p className="text-white/70 text-sm">{profile.bio}</p>
    </motion.div>

    {/* Links Cards */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {links.map((link) => (
        <motion.button
          key={link.id}
          onClick={() => onLinkClick(link)}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block w-full bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group overflow-hidden"
        >
          <div className="p-3 flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg">
              {link.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium group-hover:text-white/90 transition-colors">
                {link.title}
              </div>
              <div className="text-white/60 text-xs">
                {link.clicks?.toLocaleString()} clicks
              </div>
            </div>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" />
          </div>
        </motion.button>
      ))}
    </motion.div>
  </div>
);

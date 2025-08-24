import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  CursorArrowRaysIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// API Services
import linksApi from '../../../services/linksApi';

// Social Media Platforms với SVG icons chuẩn
const SOCIAL_PLATFORMS = [
  {
    id: 'website',
    name: 'Website',
    color: '#6B7280',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    )
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    color: '#000000',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#000000',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    )
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    id: 'github',
    name: 'GitHub',
    color: '#181717',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    )
  },
  {
    id: 'discord',
    name: 'Discord',
    color: '#5865F2',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
      </svg>
    )
  },
  {
    id: 'twitch',
    name: 'Twitch',
    color: '#9146FF',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
      </svg>
    )
  },
  {
    id: 'spotify',
    name: 'Spotify',
    color: '#1DB954',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    )
  },
  {
    id: 'telegram',
    name: 'Telegram',
    color: '#0088CC',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    )
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
      </svg>
    )
  },
  {
    id: 'email',
    name: 'Email',
    color: '#EA4335',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.455-6.269h.909c.904 0 1.636.732 1.636 1.636z"/>
      </svg>
    )
  },
  {
    id: 'phone',
    name: 'Phone',
    color: '#34C759',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    )
  },
  {
    id: 'custom',
    name: 'Custom Link',
    color: '#8B5CF6',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
      </svg>
    )
  }
];

const LinksTab = ({ data, refreshData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [linksData, setLinksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);





  // Load links data directly from API
  const loadLinksData = async () => {
    try {
      setInitialLoading(true);
      const result = await linksApi.getLinks();

      if (result && result.success) {
        const links = result.data || [];
        setLinksData(links);
      } else {
        setLinksData([]);
      }
    } catch (error) {

      setLinksData([]);
    } finally {
      setInitialLoading(false);
    }
  };

  // Load data on mount and when data changes
  useEffect(() => {
    // Load directly from API
    loadLinksData();

    // Also try to use props data as fallback
    if (data?.links?.data && Array.isArray(data.links.data) && data.links.data.length > 0) {
      setLinksData(data.links.data);
      setInitialLoading(false);
    }
  }, [data]);

  // Add new link
  const handleAddLink = async (linkData) => {
    try {
      await linksApi.createLink(linkData);
      toast.success('Đã thêm liên kết thành công!');

      // Refresh both Dashboard data and local data
      if (refreshData) {
        refreshData('links');
      }
      await loadLinksData();

      setShowAddModal(false);
    } catch (error) {

      toast.error(error.message || 'Không thể thêm liên kết');
    }
  };

  // Edit existing link
  const handleEditLink = async (linkData) => {
    try {
      await linksApi.updateLink(editingLink.id, linkData);
      toast.success('Đã cập nhật liên kết thành công!');

      // Refresh both Dashboard data and local data
      if (refreshData) {
        refreshData('links');
      }
      await loadLinksData();

      setEditingLink(null);
    } catch (error) {

      toast.error(error.message || 'Không thể cập nhật liên kết');
    }
  };

  // Toggle link visibility
  const handleToggleVisibility = async (linkId, currentStatus) => {
    try {
      await linksApi.toggleLinkStatus(linkId, !currentStatus);
      toast.success(currentStatus ? 'Đã ẩn liên kết' : 'Đã hiển thị liên kết');

      // Refresh both Dashboard data and local data
      if (refreshData) {
        refreshData('links');
      }
      await loadLinksData();
    } catch (error) {

      toast.error(error.message || 'Không thể cập nhật liên kết');
    }
  };

  // Delete link
  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa liên kết này?')) return;

    try {
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Đã xóa liên kết thành công!');

        // Refresh both Dashboard data and local data
        if (refreshData) {
          refreshData('links');
        }
        await loadLinksData();
      } else {
        throw new Error('Failed to delete link');
      }
    } catch (error) {

      toast.error('Không thể xóa liên kết');
    }
  };

  // Copy link to clipboard
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Đã sao chép liên kết!');
  };

  // Handle drag start
  const handleDragStart = (e, link) => {
    setDraggedItem(link);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', link.id);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drag enter
  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = async (e, targetLink) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetLink.id) {
      setDraggedItem(null);
      return;
    }

    try {
      setLoading(true);

      // Check if linksData is valid
      if (!linksData || !Array.isArray(linksData)) {
        return;
      }

      // Get current positions
      const draggedIndex = linksData.findIndex(link => link.id === draggedItem.id);
      const targetIndex = linksData.findIndex(link => link.id === targetLink.id);

      // Create new array with reordered items
      const newLinksData = [...linksData];
      const [removed] = newLinksData.splice(draggedIndex, 1);
      newLinksData.splice(targetIndex, 0, removed);

      // Update local state immediately for better UX
      setLinksData(newLinksData);

      // Update order on server
      const linksWithOrder = newLinksData.map((link, index) => ({
        id: link.id,
        sortOrder: index
      }));
      await linksApi.reorderLinks(linksWithOrder);

      toast.success('Đã cập nhật thứ tự liên kết!');

      // Refresh data
      if (refreshData) {
        refreshData('links');
      }
      await loadLinksData();
    } catch (error) {

      toast.error('Không thể cập nhật thứ tự liên kết');
      // Revert local state on error
      await loadLinksData();
    } finally {
      setLoading(false);
      setDraggedItem(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Quản Lý Liên Kết</h2>
          <p className="text-sm sm:text-base text-gray-400">Tạo, chỉnh sửa và sắp xếp các liên kết trong profile của bạn</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors w-full sm:w-auto"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Thêm Liên Kết</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-lg bg-blue-500/20">
              <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white mb-1">{linksData?.length || 0}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Tổng Liên Kết</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-lg bg-green-500/20">
              <EyeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white mb-1">
              {linksData?.filter(link => link.active)?.length || 0}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">Liên Kết Hiển Thị</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-lg bg-purple-500/20">
              <CursorArrowRaysIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white mb-1">
              {linksData.reduce((total, link) => total + (link.click_count || 0), 0)}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">Tổng Lượt Nhấp</p>
          </div>
        </motion.div>
      </div>

      {/* Links List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Danh Sách Liên Kết</h3>
        </div>
        
        <div className="p-6">
          {loading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-purple-400">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang cập nhật thứ tự...</span>
              </div>
            </div>
          )}



          {initialLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2 text-gray-400">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải danh sách liên kết...</span>
              </div>
            </div>
          ) : linksData?.length > 0 ? (
            <div className="space-y-4">
              {linksData.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gray-700/50 rounded-lg p-4 border transition-all duration-200 ${
                    draggedItem?.id === link.id
                      ? 'border-purple-500 bg-purple-500/10 opacity-50 scale-95'
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/70'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, link)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDrop={(e) => handleDrop(e, link)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    {/* Link Info */}
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      {/* Drag Handle - Hidden on mobile */}
                      <div
                        className={`hidden sm:block cursor-move transition-colors ${
                          draggedItem?.id === link.id
                            ? 'text-purple-400'
                            : 'text-gray-500 hover:text-gray-400'
                        }`}
                        title="Kéo để sắp xếp"
                      >
                        <Bars3Icon className="w-5 h-5" />
                      </div>

                      {/* Link Icon/Platform */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const platform = SOCIAL_PLATFORMS.find(p => p.id === link.icon) || SOCIAL_PLATFORMS[0];
                          return (
                            <div
                              className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center"
                              style={{ color: platform.color }}
                            >
                              <platform.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                          );
                        })()}
                      </div>

                      {/* Link Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-white font-medium truncate text-sm sm:text-base">{link.title}</h4>
                          {!link.active && (
                            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-600 text-gray-300 text-xs rounded">
                              Ẩn
                            </span>
                          )}
                          {link.featured && (
                            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-yellow-600 text-yellow-100 text-xs rounded">
                              Nổi bật
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm truncate">{link.url}</p>
                        {link.description && (
                          <p className="text-gray-500 text-xs truncate mt-1 hidden sm:block">{link.description}</p>
                        )}
                        <div className="flex items-center space-x-2 sm:space-x-4 mt-1">
                          <span className="text-gray-500 text-xs">
                            {link.click_count || 0} lượt nhấp
                          </span>
                          <span className="text-gray-500 text-xs hidden sm:inline">
                            Thứ tự: {link.sort_order || index + 1}
                          </span>
                          {link.created_at && (
                            <span className="text-gray-500 text-xs hidden lg:inline">
                              {new Date(link.created_at).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-shrink-0">
                      {/* Copy Link - Hidden on mobile */}
                      <button
                        onClick={() => handleCopyLink(link.url)}
                        className="hidden sm:flex p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        title="Sao chép liên kết"
                      >
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      </button>

                      {/* Open Link - Hidden on mobile */}
                      <button
                        onClick={() => window.open(link.url, '_blank')}
                        className="hidden sm:flex p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        title="Mở liên kết"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </button>

                      {/* Toggle Visibility */}
                      <button
                        onClick={() => handleToggleVisibility(link.id, link.active)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        title={link.active ? 'Ẩn liên kết' : 'Hiển thị liên kết'}
                      >
                        {link.active ? (
                          <EyeIcon className="w-4 h-4" />
                        ) : (
                          <EyeSlashIcon className="w-4 h-4" />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingLink(link)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Xóa liên kết"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <LinkIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">Chưa có liên kết nào</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-6 px-4">
                Hãy thêm liên kết đầu tiên để bắt đầu xây dựng profile của bạn
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Thêm Liên Kết Đầu Tiên
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Link Modal */}
      <AnimatePresence>
        {(showAddModal || editingLink) && (
          <LinkModal
            isOpen={showAddModal || !!editingLink}
            onClose={() => {
              setShowAddModal(false);
              setEditingLink(null);
            }}
            onSave={editingLink ? handleEditLink : handleAddLink}
            editingLink={editingLink}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Link Modal Component
const LinkModal = ({ onClose, onSave, editingLink }) => {
  const [formData, setFormData] = useState({
    title: editingLink?.title || '',
    url: editingLink?.url || '',
    description: editingLink?.description || '',
    icon: editingLink?.icon || 'website',
    active: editingLink?.active ?? true,
    featured: editingLink?.featured ?? false
  });

  const [showIconSelector, setShowIconSelector] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  // Filter platforms based on search
  const filteredPlatforms = SOCIAL_PLATFORMS.filter(platform =>
    platform.name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  // Get selected platform
  const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.id === formData.icon) || SOCIAL_PLATFORMS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Close icon selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.icon-selector')) {
        setShowIconSelector(false);
      }
    };

    if (showIconSelector) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showIconSelector]);

  // Handle modal close
  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleModalClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto mx-2 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
          {editingLink ? 'Chỉnh Sửa Liên Kết' : 'Thêm Liên Kết Mới'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
              placeholder="Nhập tiêu đề liên kết"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Icon Platform
            </label>
            <div className="relative icon-selector">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowIconSelector(!showIconSelector);
                }}
                className="w-full px-3 py-3 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none flex items-center justify-between text-sm sm:text-base hover:bg-gray-600 transition-colors touch-manipulation"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    style={{ color: selectedPlatform.color }}
                  >
                    <selectedPlatform.icon />
                  </div>
                  <span className="truncate">{selectedPlatform.name}</span>
                </div>
                <svg
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${showIconSelector ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Icon Dropdown */}
              {showIconSelector && (
                <div
                  className="absolute z-[60] w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-64 sm:max-h-60 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Search */}
                  <div className="p-2 sm:p-3 border-b border-gray-600 bg-gray-750">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm platform..."
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full pl-10 pr-3 py-2.5 sm:py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm touch-manipulation"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* Platform List */}
                  <div className="overflow-y-auto max-h-48 sm:max-h-40">
                    {filteredPlatforms.length > 0 ? (
                      filteredPlatforms.map((platform) => (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFormData({ ...formData, icon: platform.id });
                            setShowIconSelector(false);
                            setIconSearch('');
                          }}
                          className={`w-full px-3 py-3 sm:py-2 text-left hover:bg-gray-600 active:bg-gray-600 flex items-center space-x-2 sm:space-x-3 transition-colors touch-manipulation ${
                            formData.icon === platform.id ? 'bg-gray-600' : ''
                          }`}
                        >
                          <div
                            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                            style={{ color: platform.color }}
                          >
                            <platform.icon />
                          </div>
                          <span className="text-white text-sm sm:text-base">{platform.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-gray-400 text-sm">
                        Không tìm thấy platform nào
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="Mô tả ngắn về liên kết"
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="active" className="text-gray-300 text-sm">
                Hiển thị liên kết này
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
              />
              <label htmlFor="featured" className="text-gray-300 text-sm">
                Đánh dấu là liên kết nổi bật
              </label>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 sm:py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 active:bg-gray-700 transition-colors touch-manipulation text-sm sm:text-base"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 sm:py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg transition-colors touch-manipulation text-sm sm:text-base font-medium"
            >
              {editingLink ? 'Cập Nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LinksTab;

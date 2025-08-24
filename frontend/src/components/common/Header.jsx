import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Tính năng', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Templates', href: '/templates' },
    { name: 'Hỗ trợ', href: '/help' }
  ];

  return (
    <header className="bg-dark-900 border-b border-gray-800 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Logo size="default" variant="light" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm xl:text-base"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm xl:text-base"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-white hover:text-gray-900 text-sm xl:text-base px-3 xl:px-4 py-2"
                onClick={() => {}}
              >
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="accent"
                className="text-sm xl:text-base px-3 xl:px-4 py-2"
                onClick={() => {}}
              >
                🚀 Tạo miễn phí
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800 bg-dark-900">
            <div className="flex flex-col space-y-3 px-2">
              {navigation.map((item) => (
                item.href.startsWith('#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-gray-800 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-gray-800 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-800 mt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-white hover:text-gray-900 py-3 text-base">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="accent" className="w-full py-3 text-base">
                    🚀 Tạo miễn phí
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

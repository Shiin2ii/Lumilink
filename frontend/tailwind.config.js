/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a'
        },
        dark: {
          100: '#f5f5f5',
          800: '#1f2937',
          900: '#111827'
        },
        accent: {
          yellow: '#fbbf24',
          green: '#10b981',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 4s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.4'
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(180deg)',
            opacity: '1'
          }
        }
      }
    },
  },
  plugins: [],
}

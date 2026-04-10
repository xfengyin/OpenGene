/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stripe Design System
        stripe: {
          purple: '#533afd',
          'purple-hover': '#4434d4',
          'purple-deep': '#2e2b8c',
          'purple-light': '#b9b9f9',
          'purple-mid': '#665efd',
          'purple-soft': '#d6d9fc',
          navy: '#061b31',
          'dark-navy': '#0d253d',
          'brand-dark': '#1c1e54',
          white: '#ffffff',
          border: '#e5edf5',
          heading: '#061b31',
          label: '#273951',
          body: '#64748d',
          success: '#15be53',
          'success-text': '#108c3d',
          ruby: '#ea2261',
          magenta: '#f96bee',
          'magenta-light': '#ffd7ef',
          lemon: '#9b6829',
          'border-purple': '#b9b9f9',
          'border-magenta': '#ffd7ef',
          'border-dashed': '#362baa',
        },
        // Legacy gene colors (for galaxy nodes only)
        gene: {
          dna: '#8B5CF6',
          rna: '#EC4899',
          protein: '#10B981',
          cell: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['SourceCodePro', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
      },
      letterSpacing: {
        'display-xl': '-0.035em',
        'display-lg': '-0.02em',
        'display-md': '-0.02em',
        'display-sm': '-0.01em',
        'display-xs': '-0.01em',
        'tabular': '-0.03em',
      },
      lineHeight: {
        'display-xl': '1.03',
        'display-lg': '1.15',
        'display-md': '1.10',
        'display-sm': '1.12',
        'display-xs': '1.10',
        'body-lg': '1.40',
        'body': '1.40',
        'button': '1.00',
        'code': '2.00',
      },
      borderRadius: {
        'stripe': '4px',
        'stripe-md': '5px',
        'stripe-lg': '6px',
        'stripe-xl': '8px',
      },
      boxShadow: {
        'stripe-ambient': 'rgba(23,23,23,0.06) 0px 3px 6px',
        'stripe-standard': 'rgba(23,23,23,0.08) 0px 15px 35px',
        'stripe-elevated': 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
        'stripe-deep': 'rgba(3,3,39,0.25) 0px 14px 21px -14px, rgba(0,0,0,0.1) 0px 8px 17px -8px',
        'stripe-card': 'rgba(50,50,93,0.1) 0px 12px 24px -12px, rgba(0,0,0,0.06) 0px 8px 16px -8px',
        'stripe-card-hover': 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
        'stripe-button': 'rgba(50,50,93,0.15) 0px 4px 12px -2px, rgba(0,0,0,0.08) 0px 2px 6px -2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      }
    },
  },
  plugins: [],
}

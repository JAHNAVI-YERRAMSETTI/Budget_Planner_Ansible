// MainNavBar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MainNavBar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const navStyle = {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0,
    background: '#ffffff',
    padding: '14px 28px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    zIndex: 1000,
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    borderBottom: '1px solid #e5e7eb'
  }
  
  const linkStyle = { 
    textDecoration: 'none', 
    color: '#0f172a', 
    fontSize: '0.98rem', 
    fontWeight: 600, 
    position: 'relative',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'color 0.2s ease, transform 0.2s ease'
  }

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: '#0f172a',
    fontWeight: 800,
    fontSize: '22px',
    transition: 'all 0.3s ease',
    position: 'relative'
  }

  return (
    <div>
      <nav style={navStyle}>
        <Link to="/" style={logoStyle}>
          {/* Enhanced SVG Logo */}
          <svg
            width="50"
            height="50"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              transition: 'all 0.3s ease'
            }}
          >
            <defs>
              <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:"#667eea",stopOpacity:1}} />
                <stop offset="50%" style={{stopColor:"#764ba2",stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:"#f093fb",stopOpacity:1}} />
              </linearGradient>
              
              <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:"#4ecdc4",stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:"#44a08d",stopOpacity:1}} />
              </linearGradient>
              
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:"#FFD700",stopOpacity:1}} />
                <stop offset="50%" style={{stopColor:"#FFA500",stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:"#FF8C00",stopOpacity:1}} />
              </linearGradient>
              
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000020"/>
              </filter>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor:"#ffffff",stopOpacity:0.8}} />
                <stop offset="70%" style={{stopColor:"#ffffff",stopOpacity:0.3}} />
                <stop offset="100%" style={{stopColor:"#ffffff",stopOpacity:0}} />
              </radialGradient>
            </defs>
            
            {/* Outer Ring */}
            <circle cx="50" cy="50" r="45" 
                    fill="url(#primaryGradient)" 
                    filter="url(#softShadow)"/>
            
            {/* Inner Glow */}
            <circle cx="50" cy="50" r="40" 
                    fill="url(#centerGlow)" 
                    opacity="0.6"/>
            
            {/* Main Content Area */}
            <circle cx="50" cy="50" r="35" 
                    fill="rgba(255,255,255,0.1)" 
                    stroke="rgba(255,255,255,0.3)" 
                    strokeWidth="1"/>
            
            {/* Chart Bars */}
            <g transform="translate(50, 50)">
              <g fill="url(#accentGradient)">
                <rect x="-20" y="10" width="5" height="15" rx="2.5" filter="url(#softShadow)"/>
                <rect x="-10" y="5" width="5" height="20" rx="2.5" filter="url(#softShadow)"/>
                <rect x="0" y="-5" width="5" height="30" rx="2.5" filter="url(#softShadow)"/>
                <rect x="10" y="-10" width="5" height="35" rx="2.5" filter="url(#softShadow)"/>
                <rect x="20" y="-15" width="5" height="40" rx="2.5" filter="url(#softShadow)"/>
              </g>
              
              {/* Trend Line */}
              <path d="M-17.5 17.5 L-7.5 15 L2.5 10 L12.5 7.5 L22.5 5" 
                    stroke="url(#goldGradient)" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    filter="url(#glow)"/>
              
              {/* Arrow */}
              <path d="M20 7.5 L22.5 5 L20 2.5" 
                    stroke="url(#goldGradient)" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
              
              {/* Dollar Symbol */}
              <g transform="translate(-25, -25)">
                <circle cx="0" cy="0" r="10" fill="url(#goldGradient)" filter="url(#softShadow)"/>
                <text x="0" y="4" 
                      fontFamily="Arial, sans-serif" 
                      fontSize="12" 
                      fontWeight="bold" 
                      fill="white" 
                      textAnchor="middle">$</text>
              </g>
              
              {/* Data Points */}
              <g fill="white">
                <circle cx="-17.5" cy="17.5" r="2" filter="url(#softShadow)"/>
                <circle cx="-7.5" cy="15" r="2" filter="url(#softShadow)"/>
                <circle cx="2.5" cy="10" r="2" filter="url(#softShadow)"/>
                <circle cx="12.5" cy="7.5" r="2" filter="url(#softShadow)"/>
                <circle cx="22.5" cy="5" r="2" filter="url(#softShadow)"/>
              </g>
              
              {/* Growth Indicator */}
              <g transform="translate(25, -20)">
                <path d="M0 0 L4 -4 L8 0 L4 -2 Z" fill="url(#accentGradient)" filter="url(#softShadow)"/>
              </g>
            </g>
            
            {/* Outer Border */}
            <circle cx="50" cy="50" r="47" 
                    fill="none" 
                    stroke="url(#primaryGradient)" 
                    strokeWidth="1" 
                    opacity="0.3"/>
          </svg>
          
          <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px'
          }}>
            BudgetPlanner
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Navigation Links */}
          {[
            { to: '/', text: 'Home' },
            { to: '/about', text: 'About' },
            { to: '/contact', text: 'Contact' }
          ].map((link, i) => (
            <Link key={i} to={link.to} style={linkStyle}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.1)'
                e.target.style.color = '#667eea'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#2d3748'
                e.target.style.transform = 'translateY(0)'
              }}>
              {link.text}
            </Link>
          ))}

          {/* Register Button */}
          <Link to="/user/register" style={{ textDecoration: 'none' }}>
            <button style={{ 
              padding: '12px 25px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '15px', 
              cursor: 'pointer', 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.02)'
              e.target.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.4)'
              e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)'
              e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)'
              e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <span style={{ fontSize: '1rem' }}>👤</span>
              Register
            </button>
          </Link>

          {/* Login Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsLoginOpen(!isLoginOpen)} 
              style={{ 
                padding: '12px 25px', 
                background: isLoginOpen ? 'rgba(102, 126, 234, 0.1)' : 'transparent', 
                color: '#2d3748', 
                border: '2px solid rgba(102, 126, 234, 0.2)', 
                borderRadius: '15px', 
                cursor: 'pointer', 
                fontSize: '0.95rem', 
                fontWeight: 700, 
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.1)'
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.4)'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.color = '#667eea'
              }}
              onMouseOut={(e) => {
                if (!isLoginOpen) {
                  e.target.style.background = 'transparent'
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'
                  e.target.style.color = '#2d3748'
                }
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '1rem' }}>🔑</span>
              Login
              <span style={{ 
                display: 'inline-block', 
                transform: isLoginOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                transition: 'transform 0.3s ease',
                fontSize: '0.8rem'
              }}>▾</span>
            </button>

            {/* Dropdown Menu */}
            <div style={{ 
              position: 'absolute', 
              top: '110%', 
              right: 0, 
              background: 'rgba(255,255,255,0.98)', 
              backdropFilter: 'blur(25px)',
              borderRadius: '20px', 
              padding: '15px 10px', 
              marginTop: '10px', 
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              minWidth: '220px', 
              opacity: isLoginOpen ? 1 : 0, 
              visibility: isLoginOpen ? 'visible' : 'hidden', 
              transform: isLoginOpen ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)', 
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              border: '1px solid rgba(255,255,255,0.3)',
              zIndex: 1001
            }}>
              {/* Dropdown Arrow */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '30px',
                width: '16px',
                height: '16px',
                background: 'rgba(255,255,255,0.98)',
                transform: 'rotate(45deg)',
                borderTop: '1px solid rgba(255,255,255,0.3)',
                borderLeft: '1px solid rgba(255,255,255,0.3)'
              }} />
              
              {[
                { 
                  to: '/user/login', 
                  text: 'User Login', 
                  icon: '👤',
                  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                },
                { 
                  to: '/admin/login', 
                  text: 'Admin Login', 
                  icon: '⚙️',
                  gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                }
              ].map((link, i) => (
                <Link key={i}
                  to={link.to} 
                  onClick={() => setIsLoginOpen(false)} 
                  style={{ 
                    padding: '15px 20px', 
                    textDecoration: 'none', 
                    color: '#2d3748', 
                    borderRadius: '15px', 
                    background: 'transparent', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    fontWeight: '600',
                    fontSize: '1rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.08)'
                    e.target.style.transform = 'translateX(8px)'
                    e.target.style.color = '#667eea'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.transform = 'translateX(0)'
                    e.target.style.color = '#2d3748'
                  }}
                >
                  <div style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '10px',
                    background: link.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    {link.icon}
                  </div>
                  <span style={{ flex: 1 }}>{link.text}</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    opacity: 0.6,
                    transition: 'all 0.3s ease'
                  }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div style={{ paddingTop: 90 }} />

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes logoSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes navSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonPulse {
          0%, 100% {
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
          }
        }

        /* Logo hover animation */
        nav a[href="/"] svg {
          transition: all 0.3s ease;
        }

        nav a[href="/"]:hover svg {
          transform: scale(1.1) rotate(5deg);
        }

        /* Navbar background scroll effect */
        @media (max-width: 768px) {
          nav {
            padding: 12px 20px !important;
          }
          
          nav > div:last-child {
            gap: 0.5rem !important;
          }
          
          nav button, nav a {
            font-size: 0.85rem !important;
            padding: 8px 15px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MainNavBar;

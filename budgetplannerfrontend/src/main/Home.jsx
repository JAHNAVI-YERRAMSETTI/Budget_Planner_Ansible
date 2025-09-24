// Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import MainNavBar from './MainNavBar'

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <MainNavBar />
      
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
          filter: 'blur(1px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse',
          filter: 'blur(2px)'
        }} />
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite',
          filter: 'blur(3px)'
        }} />
        
        {/* Main Hero Card */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(25px)',
          borderRadius: '30px',
          padding: '80px 60px',
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: '0 35px 80px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
          maxWidth: '900px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          animation: 'slideUp 1s ease-out',
          transform: 'perspective(1000px) rotateX(5deg)',
          transition: 'all 0.3s ease'
        }}>
          {/* Glowing Effect */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)',
            borderRadius: '30px',
            zIndex: -1,
            opacity: 0.3,
            filter: 'blur(8px)',
            animation: 'glow 3s linear infinite'
          }} />
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: '900',
            color: 'white',
            margin: '0 0 25px 0',
            textShadow: '0 8px 32px rgba(0,0,0,0.3)',
            background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 50%, #e8f0ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-2px',
            position: 'relative'
          }}>
            BUDGET PLANNER
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '4px',
              background: 'linear-gradient(90deg, transparent, #fff, transparent)',
              borderRadius: '2px',
              opacity: 0.6
            }} />
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: '1.8',
            fontWeight: '300',
            maxWidth: '600px',
            margin: '0 auto 50px auto'
          }}>
            Transform your financial future with intelligent budget management, 
            real-time insights, and personalized recommendations
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '25px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <Link to="/user/register" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '18px 40px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 15px 35px rgba(255,107,107,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateY(0)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)'
                e.target.style.boxShadow = '0 20px 45px rgba(255,107,107,0.6), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)'
                e.target.style.boxShadow = '0 15px 35px rgba(255,107,107,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}>
                Get Started Free
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '0',
                  height: '0',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.3s ease'
                }} />
              </button>
            </Link>
            
            <Link to="/user/login" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '18px 40px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                backdropFilter: 'blur(15px)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)'
                e.target.style.transform = 'translateY(-3px) scale(1.05)'
                e.target.style.borderColor = 'rgba(255,255,255,0.5)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)'
                e.target.style.transform = 'translateY(0) scale(1)'
                e.target.style.borderColor = 'rgba(255,255,255,0.3)'
              }}>
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

    

      

      {/* Login/Register Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: '800',
            color: '#2d3748',
            margin: '0 0 25px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative'
          }}>
            Choose Your Portal
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '2px'
            }} />
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            color: '#718096',
            maxWidth: '700px',
            margin: '40px auto 80px auto',
            lineHeight: '1.6'
          }}>
            Access powerful financial tools designed for different user experiences
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
            marginTop: '60px'
          }}>
            {/* User Portal */}
            <div style={{
              background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '25px',
              padding: '50px 40px',
              color: 'white',
              textAlign: 'center',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
              transform: 'translateY(0)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)'
            }}>
              {/* Animated background effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                transition: 'left 0.5s ease'
              }} />
              
              <div style={{
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px auto',
                fontSize: '2.5rem',
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1)',
                animation: 'pulse 2s infinite'
              }}>
                👤
              </div>
              
              <h3 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '700', 
                margin: '0 0 20px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                User Portal
              </h3>
              
              <p style={{ 
                fontSize: '1.1rem', 
                opacity: '0.95', 
                margin: '0 0 35px 0', 
                lineHeight: '1.6',
                fontWeight: '300'
              }}>
                Manage your personal finances, track expenses, set budgets, and get personalized insights into your spending habits with advanced analytics.
              </p>
              
              <Link to="/user/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '15px 35px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)'
                  e.target.style.transform = 'scale(1)'
                }}>
                  Start Managing
                </button>
              </Link>
            </div>

            {/* Admin Portal */}
            <div style={{
              background: 'linear-gradient(145deg, #ff6b6b 0%, #ee5a24 100%)',
              borderRadius: '25px',
              padding: '50px 40px',
              color: 'white',
              textAlign: 'center',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)',
              transform: 'translateY(0)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(255, 107, 107, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 107, 0.3)'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px auto',
                fontSize: '2.5rem',
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1)',
                animation: 'pulse 2s infinite 0.5s'
              }}>
                ⚙️
              </div>
              
              <h3 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '700', 
                margin: '0 0 20px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Admin Portal
              </h3>
              
              <p style={{ 
                fontSize: '1.1rem', 
                opacity: '0.95', 
                margin: '0 0 35px 0', 
                lineHeight: '1.6',
                fontWeight: '300'
              }}>
                Monitor platform activities, manage users, generate comprehensive reports, and ensure smooth operations with complete administrative control.
              </p>
              
              <Link to="/admin/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '15px 35px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)'
                  e.target.style.transform = 'scale(1)'
                }}>
                  Admin Access
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{
        padding: '100px 20px',
        background: 'white',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: '800',
            color: '#2d3748',
            margin: '0 0 25px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative'
          }}>
            How It Works
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '2px'
            }} />
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            color: '#718096',
            margin: '40px auto 80px auto',
            maxWidth: '700px',
            lineHeight: '1.6'
          }}>
            Simple steps to transform your financial management experience
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '50px',
            marginTop: '60px'
          }}>
            {[
              { 
                step: '1', 
                title: 'Sign Up', 
                desc: 'Create your secure account and set up your personalized financial profile',
                color: '#667eea'
              },
              { 
                step: '2', 
                title: 'Connect', 
                desc: 'Link your bank accounts and payment apps for automatic transaction tracking',
                color: '#764ba2'
              },
              { 
                step: '3', 
                title: 'Track', 
                desc: 'Monitor your expenses and income with real-time updates and categorization',
                color: '#ff6b6b'
              },
              { 
                step: '4', 
                title: 'Analyze', 
                desc: 'Get intelligent insights and personalized recommendations for better financial health',
                color: '#4ecdc4'
              }
            ].map((item, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '25px',
                padding: '50px 30px',
                textAlign: 'center',
                boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                border: '1px solid rgba(0,0,0,0.05)',
                transform: 'translateY(0)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px)'
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px auto',
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  boxShadow: `0 10px 25px ${item.color}40`,
                  position: 'relative'
                }}>
                  {item.step}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: `2px solid ${item.color}`,
                    transform: 'translate(-50%, -50%) scale(1.2)',
                    animation: 'ripple 2s infinite',
                    opacity: 0.3
                  }} />
                </div>
                
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  margin: '0 0 20px 0', 
                  color: '#2d3748' 
                }}>
                  {item.title}
                </h3>
                
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#718096', 
                  margin: '0', 
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: '800',
            color: '#2d3748',
            margin: '0 0 25px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative'
          }}>
            What You Can Achieve
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '150px',
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '2px'
            }} />
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            color: '#718096',
            margin: '40px auto 80px auto',
            maxWidth: '800px',
            lineHeight: '1.6'
          }}>
            Powerful features designed to transform your financial management experience
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
            marginTop: '60px'
          }}>
            {[
              { 
                icon: '📊', 
                title: 'Smart Analytics', 
                desc: 'Get detailed insights into your spending patterns and financial health with advanced data visualization',
                link: '/user/analysis',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              },
              { 
                icon: '💰', 
                title: 'Budget Management', 
                desc: 'Set and track budgets for different categories with intelligent alerts and recommendations',
                link: '/user/budgets',
                gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
              },
              { 
                icon: '📱', 
                title: 'Transaction Tracking', 
                desc: 'Automatically categorize and track all your transactions with real-time synchronization',
                link: '/user/transaction',
                gradient: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
              },
              { 
                icon: '📈', 
                title: 'Monthly Reports', 
                desc: 'Generate comprehensive reports to understand your financial progress and trends',
                link: '/user/monthly-report',
                gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
              },
              { 
                icon: '🔔', 
                title: 'Smart Alerts', 
                desc: 'Get notified about unusual spending, budget overruns, and important financial events',
                link: '/user/alert',
                gradient: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'
              },
              { 
                icon: '📋', 
                title: 'Expense Management', 
                desc: 'Easily add and manage your daily expenses with detailed categorization and tagging',
                link: '/user/expense',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '25px',
                padding: '40px 30px',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                transform: 'translateY(0)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'
              }}>
                {/* Gradient background on hover */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: feature.gradient,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  borderRadius: '25px'
                }} className="gradient-bg" />
                
                <div style={{
                  fontSize: '4rem',
                  margin: '0 0 25px 0',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {feature.icon}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: '700',
                  margin: '0 0 20px 0', 
                  color: '#2d3748',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {feature.title}
                </h3>
                
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#718096', 
                  margin: '0 0 30px 0', 
                  lineHeight: '1.6',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {feature.desc}
                </p>
                
                <Link to={feature.link} style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '12px 25px',
                    background: feature.gradient,
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'
                  }}>
                    Explore Feature
                  </button>
                </Link>
              </div>
            ))}
          </div>
          </div>
        </section>

      {/* Testimonials */}
      <section style={{
        padding: '100px 20px',
        background: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: '800',
            color: '#2d3748',
            margin: '0 0 25px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative'
          }}>
            Loved by our users
            <div style={{
              position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)',
              width: '140px', height: '4px', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '2px'
            }} />
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
            marginTop: '60px'
          }}>
            {[
              { quote: 'BUDGET PLANNER helped me reduce impulsive spending and hit my savings goals.', name: 'Aisha', role: 'Student' },
              { quote: 'The monthly reports are beautiful and actionable. Love the clarity!', name: 'Rahul', role: 'Software Engineer' },
              { quote: 'Category budgets and alerts keep me right on track each month.', name: 'Meera', role: 'Entrepreneur' }
            ].map((t, i) => (
              <div key={i} style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '20px',
                padding: '28px',
                textAlign: 'left',
                boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.12)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17h3l2-4V7H6v6h3l-2 4zm7 0h3l2-4V7h-6v6h3l-2 4z" fill="#667eea"/>
                  </svg>
                  <span style={{ color: '#4b5563', fontWeight: 700 }}>Verified Review</span>
                </div>
                <p style={{ color: '#111827', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  “{t.quote}”
                </p>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 18, gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ color: '#1f2937', fontWeight: 700 }}>{t.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>

      {/* Services Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: '800',
            color: 'white',
            margin: '0 0 25px 0',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            Our Services
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '4px',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '2px'
            }} />
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.9)',
            margin: '40px auto 80px auto',
            maxWidth: '700px',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Comprehensive financial management solutions tailored for your success
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            marginTop: '60px'
          }}>
            {[
              { 
                title: 'Personal Finance', 
                desc: 'Complete personal budget management with intelligent categorization and insights',
                icon: '💼'
              },
              { 
                title: 'Expense Tracking', 
                desc: 'Real-time expense monitoring and automatic categorization with smart alerts',
                icon: '📊'
              },
              { 
                title: 'Financial Reports', 
                desc: 'Detailed analytics and insights with customizable reporting dashboard',
                icon: '📈'
              },
              { 
                title: 'Budget Planning', 
                desc: 'Smart budget creation and tracking with predictive analytics',
                icon: '🎯'
              }
            ].map((service, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(25px)',
                borderRadius: '25px',
                padding: '40px 30px',
                textAlign: 'center',
                border: '2px solid rgba(255,255,255,0.15)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateY(0)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              }}>
                <div style={{
                  fontSize: '3rem',
                  margin: '0 0 25px 0',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                  {service.icon}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: '700', 
                  margin: '0 0 20px 0', 
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {service.title}
                </h3>
                
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: 'rgba(255,255,255,0.9)', 
                  margin: '0', 
                  lineHeight: '1.6',
                  fontWeight: '300'
                }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
          </div>
        </section>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: 'white',
        padding: '80px 20px 40px 20px',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '50px',
            marginBottom: '50px'
          }}>
            {/* Company Info */}
            <div style={{ textAlign: 'left' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                }}>
                  💰
                </div>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '800', 
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  BUDGET PLANNER
                </h3>
              </div>
              <p style={{ 
                color: 'rgba(255,255,255,0.8)', 
                lineHeight: '1.8',
                fontSize: '1.1rem',
                margin: '0 0 25px 0'
              }}>
                Your trusted partner in financial management. Take control of your money with intelligent budgeting tools and personalized insights.
              </p>
              <div style={{
                display: 'flex',
                gap: '15px'
              }}>
                {['📧', '📱', '🌐'].map((icon, i) => (
                  <div key={i} style={{
                    width: '45px',
                    height: '45px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1.2rem'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)'
                    e.target.style.transform = 'translateY(0)'
                  }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '700', 
                margin: '0 0 25px 0',
                color: 'white'
              }}>
                Quick Links
              </h4>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '15px' 
              }}>
                {[
                  { to: '/', text: 'Home' },
                  { to: '/about', text: 'About Us' },
                  { to: '/contact', text: 'Contact' },
                  { to: '/user/register', text: 'Get Started' }
                ].map((link, i) => (
                  <Link key={i} to={link.to} style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    textDecoration: 'none', 
                    transition: 'all 0.3s ease',
                    fontSize: '1.05rem',
                    padding: '5px 0',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#667eea'
                    e.target.style.paddingLeft = '10px'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'rgba(255,255,255,0.8)'
                    e.target.style.paddingLeft = '0'
                  }}>
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Access Portals */}
            <div>
              <h4 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '700', 
                margin: '0 0 25px 0',
                color: 'white'
              }}>
                Access Portals
              </h4>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '15px' 
              }}>
                {[
                  { to: '/user/register', text: 'User Registration', icon: '👤' },
                  { to: '/user/login', text: 'User Login', icon: '🔑' },
                  { to: '/admin/login', text: 'Admin Portal', icon: '⚙️' }
                ].map((link, i) => (
                  <Link key={i} to={link.to} style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    textDecoration: 'none', 
                    transition: 'all 0.3s ease',
                    fontSize: '1.05rem',
                    padding: '8px 15px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)'
                    e.target.style.transform = 'translateX(5px)'
                    e.target.style.color = 'white'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                    e.target.style.transform = 'translateX(0)'
                    e.target.style.color = 'rgba(255,255,255,0.8)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{
            borderTop: '2px solid rgba(255,255,255,0.1)',
            paddingTop: '30px',
            textAlign: 'center'
          }}>
            <p style={{ 
              margin: '0',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1rem'
            }}>
              © 2024 BUDGET PLANNER. All rights reserved. | Smart Financial Management Solutions
            </p>
      </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes countShimmer {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
          100% { filter: brightness(1); }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-20px) rotate(5deg); 
          }
          66% { 
            transform: translateY(-10px) rotate(-5deg); 
          }
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(50px) perspective(1000px) rotateX(10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) perspective(1000px) rotateX(5deg);
          }
        }

        @keyframes glow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        /* Hover effects for gradient backgrounds */
        .feature-card:hover .gradient-bg {
          opacity: 0.1 !important;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }
      `}</style>
    </div>
  )
}

export default Home
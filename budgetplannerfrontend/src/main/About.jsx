import React from 'react'
import budgetImg from '../assets/budgetplannerimage.jpg'
import MainNavBar from './MainNavBar'

const About = () => {
  const pageWrap = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }

  const sectionWrap = {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
  }

  const twoCol = {
    width: '100%',
    maxWidth: 980,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
    alignItems: 'center',
  }

  const contentCard = {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 24,
    padding: '28px 26px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(16px)',
    color: 'white',
  }

  const imageStyle = {
    width: '100%',
    maxWidth: 460,
    borderRadius: 24,
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    display: 'block',
    objectFit: 'cover',
    justifySelf: 'center',
  }

  const heading = {
    margin: 0,
    marginBottom: 8,
    fontWeight: 900,
    textAlign: 'center',
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 50%, #e8f0ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }

  const subText = {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 0,
    marginBottom: 22,
  }

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  }

  const infoCard = {
    background: 'rgba(255,255,255,0.14)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
  }

  return (
    <div style={pageWrap}>
      <MainNavBar />
      <div style={sectionWrap}>
        <div style={twoCol}>
          <img
            src={budgetImg}
            alt="Planning future expenses illustration"
            style={imageStyle}
          />

          <div style={contentCard}>
            <h1 style={heading}>About Budget Planner</h1>
            <p style={subText}>Plan smarter, spend wiser, and reach your goals with clarity.</p>

            <div style={grid}>
            <div style={infoCard}>
              <h2 style={{ marginTop: 0, marginBottom: 8, color: 'white' }}>🧾 Track Expenses</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.95)' }}>
                Monitor daily expenses with real-time updates and intuitive UI.
              </p>
            </div>

            <div style={infoCard}>
              <h2 style={{ marginTop: 0, marginBottom: 8, color: 'white' }}>💰 Smart Budgeting</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.95)' }}>
                Create budgets, set limits, and receive alerts when nearing your budget.
              </p>
            </div>

            <div style={infoCard}>
              <h2 style={{ marginTop: 0, marginBottom: 8, color: 'white' }}>📊 Visual Reports</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.95)' }}>
                Analyze your spending patterns using easy-to-read graphs and charts.
              </p>
            </div>

            <div style={infoCard}>
              <h2 style={{ marginTop: 0, marginBottom: 8, color: 'white' }}>🔐 Secure & Private</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.95)' }}>
                Your data is protected with encryption and never shared.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default About

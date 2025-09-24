import React from 'react';
import MainNavBar from './MainNavBar';
import contactImg from '../assets/contact_image.jpg';

const Contact = () => {
  const pageWrap = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  };

  const sectionWrap = {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
  };

  const grid = {
    width: '100%',
    maxWidth: 980,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
    alignItems: 'center',
  };

  const card = {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 20,
    padding: '24px 22px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(16px)',
    color: 'white',
  };

  const imageStyle = {
    width: '100%',
    maxWidth: 460,
    borderRadius: 24,
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    display: 'block',
    objectFit: 'cover',
    justifySelf: 'center',
  };

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
  };

  const subText = {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 0,
    marginBottom: 22,
  };

  const inputStyle = {
    width: '100%',
    marginTop: 6,
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    outline: 'none',
  };

  const infoBox = {
    background: 'rgba(255,255,255,0.14)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
  };

  return (
    <div style={pageWrap}>
      <MainNavBar />
      <div style={sectionWrap}>
        <div style={{ width: '100%', maxWidth: 980 }}>
          <h1 style={heading}>Contact Us</h1>
          <p style={subText}>Reach us via email, GitHub, or phone.</p>

          <div style={grid}>
            <img
              src={contactImg}
              alt="Contact illustration"
              style={imageStyle}
            />

        <div style={card}>
              <h2 style={{ marginTop: 0, marginBottom: 12, color: 'white' }}>📞 Contact Information</h2>
              <div style={infoBox}>
                <h3 style={{ marginTop: 0, marginBottom: 6, color: 'white' }}>📧 Email</h3>
                <p style={{ margin: 0 }}>
                  <a href="mailto:jahnaviyerramsetti1@gmail.com" style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px dashed rgba(255,255,255,0.8)' }}>
                    jahnaviyerramsetti1@gmail.com
                  </a>
                </p>
              </div>

              <div style={{ ...infoBox, marginTop: 12 }}>
                <h3 style={{ marginTop: 0, marginBottom: 6, color: 'white' }}>👨‍💻 GitHub</h3>
                <p style={{ margin: 0 }}>
                  <a href="https://github.com/JAHNAVI-YERRAMSETTI" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px dashed rgba(255,255,255,0.8)' }}>
                    github.com/JAHNAVI-YERRAMSETTI
                  </a>
                </p>
              </div>

              <div style={{ ...infoBox, marginTop: 12 }}>
                <h3 style={{ marginTop: 0, marginBottom: 6, color: 'white' }}>📱 Phone</h3>
                <p style={{ margin: 0 }}>
                  <a href="tel:7396969334" style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px dashed rgba(255,255,255,0.8)' }}>
                    7396969334
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

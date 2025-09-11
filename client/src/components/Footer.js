import React from 'react';

const Footer = () => {
  const linkedinUrl = "https://www.linkedin.com/in/vedantdhande/"; 

  const footerStyle = {
    position: 'fixed', 
    bottom: 0,
    left: 0,
    padding: '10px 20px',
    fontSize: '12px',
    color: '#888',
    zIndex: 100,
  };

  return (
    <footer style={footerStyle}>
      <p>
        Made by{' '}
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0077b5' }}>
          Vedant Dhande
        </a>
      </p>
    </footer>
  );
};

export default Footer;
import React from 'react';
import './footer.css';
import { Colors } from './colors'; // Assuming you have a Colors file for consistent color usage

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          {/* Replace with your actual logo */}
          <img src="/images/logotextonly.png" alt="Worship Department Logo" className="logo" />
        </div>
        <div className="footer-social">
         
          <a href="https://www.youtube.com/@WorshipDepartmentIndia" target="_blank" rel="noopener noreferrer">
            <img src="/images/ytw.png" alt="YouTube" />
          </a>
          <a href="https://www.instagram.com/worshipdepartmentindia" target="_blank" rel="noopener noreferrer">
            <img src="/images/igw.png" alt="Instagram" />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer">
            <img src="/images/fbw.png" alt="Email" />
          </a>
          <a href="https://wa.me/15672945648" target="_blank" rel="noopener noreferrer">
            <img src="/images/whatsappw.png" alt="Whatsapp" />
          </a>
        </div>
        <div className="footer-links">
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
          <a href="/terms-conditions" className="footer-link">Terms & Conditions</a>
        </div>
        <div className="footer-copyright">
          <p>© 2024 WorshipDepartment.in</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

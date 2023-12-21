import React from 'react';

const Footer = () => {
  return (
    <footer >
      <div className="footer-content ">
        <div className="footer-icons text-center">
          <h6>
            <a className='p-4' href="https://www.facebook.com">
              <i className="bi bi-facebook"></i> www.facebook.com
            </a>
            <a className='p-4' href="https://www.instagram">
              <i className="bi bi-instagram"></i> www.instagram.com
            </a>
            <a className='p-4' href="https://www.github.com">
              <i className="bi bi-github"></i> www.github.com
            </a>
          </h6>
        </div>
        <div className="copyright-text text-center text-dark">
          <h6>&copy; 2023 Your Website Name. All rights reserved.</h6>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

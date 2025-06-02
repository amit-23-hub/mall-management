import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap'; // Added Nav for Nav.Link
import { Link } from 'react-router-dom'; // For internal navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faStoreAlt } from '@fortawesome/free-solid-svg-icons'; // Added faStoreAlt, faPhoneAlt

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-custom"> {/* Class is now primary for styling from custom.css */}
      <Container>
        <Row className="gy-4"> {/* gy-4 for vertical gutter spacing */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-4">
              <FontAwesomeIcon icon={faStoreAlt} className="me-2" /> Mall Management
            </h5>
            <p className="footer-text">
              Your premier destination for shopping, dining, and entertainment. 
              Experience the best with us, managed efficiently.
            </p>
          </Col>
          
          <Col lg={2} md={3} sm={6} className="mb-4 mb-lg-0"> {/* Adjusted column sizes for better layout */}
            <h5 className="text-uppercase mb-4">Explore</h5>
            <Nav className="flex-column footer-links">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/rules">Rules</Nav.Link>
              {/* Add more relevant links if they exist */}
            </Nav>
          </Col>

          <Col lg={3} md={3} sm={6} className="mb-4 mb-lg-0"> {/* Adjusted column sizes */}
            <h5 className="text-uppercase mb-4">Support</h5>
            <Nav className="flex-column footer-links">
                <Nav.Link as={Link} to="/about">About Us</Nav.Link> {/* Assuming an about page */} 
                <Nav.Link as={Link} to="/contact">Contact</Nav.Link> {/* Assuming a contact page */} 
                <Nav.Link as={Link} to="/privacy">Privacy Policy</Nav.Link> {/* Assuming a privacy page */} 
            </Nav>
          </Col>

          <Col lg={3} md={12} className="mb-4 mb-lg-0"> {/* Contact and Social combined for larger screens, stack on smaller */} 
            <h5 className="text-uppercase mb-4">Get In Touch</h5>
            <ul className="list-unstyled footer-contact-list mb-4">
              <li className="mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" /> 
                123 Mall Avenue, Shopsville, ST 54321
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faPhoneAlt} className="me-2" /> 
                (555) 123-4567
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" /> 
                <a href="mailto:contact@mallmanagement.system" className="footer-link-inline">contact@mallmanagement.system</a>
              </li>
            </ul>
            <h5 className="text-uppercase mb-3">Follow Us</h5>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-link me-3">
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-link me-3">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link me-3">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
              </a>
            </div>
          </Col>
        </Row>
        
        <div className="text-center copyright py-4 mt-4">
          &copy; {currentYear} Mall Management System. All Rights Reserved. 
          Designed with <span style={{color: 'var(--secondary-color)'}}>&#10084;</span> by Anuj Kumar
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
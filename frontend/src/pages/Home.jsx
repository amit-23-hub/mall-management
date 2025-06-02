import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignInAlt, 
  faTachometerAlt, 
  faUsersCog, 
  faFileContract, 
  faStoreAlt, 
  faBullhorn, 
  faCogs
} from '@fortawesome/free-solid-svg-icons';

const Home = ({ isLoggedIn }) => {
  return (
    <>
      {/* Hero Section - Uses styles from custom.css */}
      <header className="hero-section">
        <Container className="hero-content"> 
          <FontAwesomeIcon icon={faStoreAlt} size="4x" className="mb-4 icon-wrapper hero-icon-animated" />
          <h1 className="display-3 fw-bolder hero-title-animated">Welcome to the Mall Management Hub</h1>
          <p className="lead mb-4 mx-auto hero-text-animated" style={{ maxWidth: '700px' }}>
            Your ultimate solution for streamlined mall operations, user administration, and regulatory compliance. 
            Experience efficiency like never before.
          </p>
          {!isLoggedIn ? (
            <Button as={Link} to="/login" variant="secondary" size="lg" className="fw-bold shadow-sm hero-btn hero-btn-animated">
              <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Login & Explore
            </Button>
          ) : (
            <Button as={Link} to="/dashboard" variant="light" size="lg" className="fw-bold shadow-sm hero-btn hero-btn-animated">
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" /> Go to Dashboard
            </Button>
          )}
        </Container>
      </header>

      {/* Features Section - Uses styles from custom.css */}
      <section className="features-section py-5">
        <Container>
          <h2 className="section-heading">Why Choose Our Platform?</h2>
          <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
            <Col className="d-flex align-items-stretch">
              <Card className="feature-card">
                <Card.Body className="d-flex flex-column">
                  <div className="icon-wrapper mb-3">
                    <FontAwesomeIcon icon={faUsersCog} size="3x" />
                  </div>
                  <Card.Title as="h4">Advanced Role Management</Card.Title>
                  <Card.Text className="flex-grow-1">
                    Securely manage access with granular permissions for Super Admins, Admins, Managers, Staff, and Tenants.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="d-flex align-items-stretch">
              <Card className="feature-card">
                <Card.Body className="d-flex flex-column">
                  <div className="icon-wrapper mb-3">
                    <FontAwesomeIcon icon={faFileContract} size="3x" />
                  </div>
                  <Card.Title as="h4">Dynamic Rules Engine</Card.Title>
                  <Card.Text className="flex-grow-1">
                    Access and view specific rules, terms, and conditions tailored to your role, including text and video formats.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="d-flex align-items-stretch">
              <Card className="feature-card">
                <Card.Body className="d-flex flex-column">
                  <div className="icon-wrapper mb-3">
                    <FontAwesomeIcon icon={faCogs} size="3x" />
                  </div>
                  <Card.Title as="h4">Streamlined Operations</Card.Title>
                  <Card.Text className="flex-grow-1">
                    Enhance day-to-day mall management with tools for tenant communication, maintenance tracking, and more.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action Section - Uses styles from custom.css */}
      <section className="cta-section text-center">
        <Container>
          <FontAwesomeIcon icon={faBullhorn} size="3x" className="mb-3 icon-wrapper cta-icon-animated" style={{color: 'var(--secondary-color)'}}/>
          <h2 className="mb-3 cta-title-animated">Elevate Your Mall's Efficiency Today!</h2>
          <p className="lead mb-4 mx-auto cta-text-animated" style={{ maxWidth: '600px' }}>
            Discover how our comprehensive platform can transform your mall's operational landscape.
          </p>
          {!isLoggedIn ? (
            <Button as={Link} to="/login" variant="light" size="lg" className="fw-bold shadow-sm cta-btn cta-btn-animated">
              <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Get Started Now
            </Button>
          ) : (
            <Button as={Link} to="/dashboard" variant="light" size="lg" className="fw-bold shadow-sm cta-btn cta-btn-animated">
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" /> Explore Dashboard
            </Button>
          )}
        </Container>
      </section>
    </>
  );
};

export default Home;
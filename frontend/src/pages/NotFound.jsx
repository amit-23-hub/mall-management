import React from 'react'; // Added React
import { Container, Row, Col, Button, Card } from 'react-bootstrap'; // Added Card
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStoreSlash, faHome, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'; // Changed icon, added faQuestionCircle

const NotFound = () => {
  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 not-found-page animated-page">
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6} xl={5}>
          <Card className="not-found-card shadow-xl text-center animated-card">
            <Card.Body className="p-sm-5 p-4">
              <div className="icon-container mb-4 text-primary">
                <FontAwesomeIcon icon={faStoreSlash} size="6x" className="not-found-icon animated-icon" />
              </div>
              <h1 className="display-1 fw-bolder error-code mb-3">404</h1>
              <h2 className="mb-3 error-message h3">Page Not Found</h2>
              <p className="text-muted mb-4 lead px-md-3">
                Oops! It looks like this page has taken an unexpected detour. Don't worry, we can guide you back.
              </p>
              <Link to="/" className="d-block mb-3">
                <Button variant="primary" size="lg" className="home-button w-100 animated-button">
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  Return to Homepage
                </Button>
              </Link>
              <Link to="/contact" className="d-block">
                <Button variant="outline-secondary" size="lg" className="contact-button w-100 animated-button-secondary">
                  <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                  Contact Support
                </Button>
              </Link>
            </Card.Body>
            <Card.Footer className="text-center py-3 bg-light not-found-footer">
              <p className="mb-0 text-muted small">
                Mall Management System &copy; {new Date().getFullYear()}
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
import React, { useState } from 'react'; 
import { Container, Form, Button, Alert, Card, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUser, faLock, faExclamationTriangle, faStoreAlt } from '@fortawesome/free-solid-svg-icons';

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      // Call login function from props
      const success = await handleLogin(username, password);
      
      if (success) {
        // Login successful - redirection is handled in App.jsx
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    }

    setLoading(false);
  };

  return (
    <Container fluid className="login-page-wrapper"> 
      <Row className="g-0 align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 120px)' }}> 
        <Col lg={5} md={7} sm={9} xs={11}>
          <Card className="login-card animated-form">
            <Card.Body className="p-4 p-sm-5">
              <div className="text-center mb-4">
                <FontAwesomeIcon icon={faStoreAlt} size="3x" className="login-icon mb-3" />
                <h2 className="fw-bold">Mall Portal Access</h2>
                <p className="text-muted">Sign in to manage your mall operations.</p>
              </div>
              {error && 
                <Alert variant="danger" className="d-flex align-items-center animated-alert">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  {error}
                </Alert>
              }
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 floating-label-group" controlId="formBasicUsername">
                  <FontAwesomeIcon icon={faUser} className="form-icon" />
                  <Form.Control
                    type="text"
                    placeholder=" " 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                  <Form.Label>Username</Form.Label>
                </Form.Group>

                <Form.Group className="mb-4 floating-label-group" controlId="formBasicPassword">
                  <FontAwesomeIcon icon={faLock} className="form-icon" />
                  <Form.Control
                    type="password"
                    placeholder=" " 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                  <Form.Label>Password</Form.Label>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 btn-lg login-button" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Sign In
                    </>
                  )}
                </Button>
              </Form>
              <div className="mt-4 text-center">
                <small className="text-muted">Forgot your password? <a href="#" className="text-decoration-none footer-link-inline">Reset here</a>.</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
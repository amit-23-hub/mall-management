import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { userService, roleService, ruleService } from '../services/api';
import { 
  faUsersCog, // Changed from faUsers
  faFileContract, // Changed from faBook for main highlight
  faStoreAlt, // Changed from faStore
  faChartBar, // Changed from faChartLine
  faUserShield,
  faUserCircle, // Changed from faClipboardList for profile
  faBuilding, // For welcome icon
  faExclamationTriangle, // For unauthorized access
  faTasks, // For staff (example, if needed later)
  faPaperPlane, // For tenant (example, if needed later)
  faTachometerAlt // Added for welcome icon
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Dashboard = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <Container className="py-5 text-center dashboard-unauthorized">
        <Alert variant="warning" className="d-inline-flex align-items-center shadow-sm animated-alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Please <Link to="/login" className="alert-link fw-bold">login</Link> to view the dashboard.
        </Alert>
      </Container>
    );
  }

  const { role, name, username } = currentUser; // Assuming 'name' might be available, fallback to username
  const displayName = name || username;
  const roleDisplayName = role.charAt(0).toUpperCase() + role.slice(1);

  // Helper function to create dashboard cards for DRY principle
  const renderFeatureCard = (title, icon, description, link, linkText, variant = "primary") => (
    <Col md={6} lg={4} className="d-flex align-items-stretch">
      <Card className="dashboard-card h-100 animated-card">
        <Card.Body className="d-flex flex-column p-4">
          <div className="text-center mb-3 icon-wrapper-circle">
            <FontAwesomeIcon icon={icon} size="2x" className="dashboard-card-icon" />
          </div>
          <Card.Title as="h5" className="text-center fw-bold mb-2">{title}</Card.Title>
          <Card.Text className="text-muted small flex-grow-1 text-center mb-3">{description}</Card.Text>
          <Button as={Link} to={link} variant={variant} className="mt-auto w-100 btn-card-action">
            {linkText}
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container fluid className="dashboard-page py-4 px-md-4">
      <Row className="mb-4 align-items-center welcome-section animated-welcome">
        <Col md={8}>
          <h1 className="dashboard-heading">
            <FontAwesomeIcon icon={faBuilding} className="me-3 text-primary" />
            Welcome, <span className="fw-bold text-primary">{displayName}</span>!
          </h1>
          <p className="lead text-muted">
            Logged in as: <strong>{roleDisplayName}</strong>. Your personalized command center awaits.
          </p>
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          {/* Replaced placeholder image with an icon or a more theme-consistent element if desired */}
          <div className="dashboard-welcome-icon-container">
            <FontAwesomeIcon icon={faTachometerAlt} size="3x" className="text-secondary" /> 
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={12}>
          <Card className="dashboard-highlight-card text-white p-lg-4 animated-highlight-card">
            <Card.Body className="d-md-flex align-items-center justify-content-between">
              <div>
                <h4 className="card-title mb-2"><FontAwesomeIcon icon={faFileContract} className="me-2"/>Important: Rules & Regulations</h4>
                <p className="card-text mb-3 mb-md-0">
                  Stay updated with the latest mall policies and guidelines relevant to your role.
                </p>
              </div>
              <Button as={Link} to="/rules" variant="light" size="lg" className="highlight-button mt-3 mt-md-0">
                View Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-4 section-subheading">Your Tools & Resources</h3>
      <Row className="gy-4">
        {/* Dynamically render cards based on role */}
        {(role === 'superadmin' || role === 'admin') && renderFeatureCard('User Management', faUsersCog, 'Administer user accounts, assign roles, and manage permissions.', '/user-management', 'Manage Users')}
        {role === 'superadmin' && renderFeatureCard('Rule Management', faFileContract, 'Create, edit, and manage rules for different roles.', '/rule-management', 'Manage Rules')}
        {(role === 'superadmin' || role === 'admin' || role === 'manager') && renderFeatureCard('Store Operations', faStoreAlt, 'Oversee store details, tenant information, and lease agreements.', '/store-ops', 'Manage Stores')}
        
        {/* Common features for many roles */}
        {renderFeatureCard('View Regulations', faFileContract, 'Access and review all rules and guidelines applicable to your role.', '/rules', 'Access Rules', 'outline-primary')}
        
        {(role === 'superadmin' || role === 'admin' || role === 'manager') && renderFeatureCard('Operational Reports', faChartBar, 'Generate and analyze reports on mall performance and user activity.', '/reports', 'View Reports')}
        
        {/* Specific roles might have unique cards */}
        {role === 'staff' && renderFeatureCard('Daily Tasks', faTasks, 'View and manage your assigned daily tasks.', '/daily-tasks', 'View Tasks')}
        {role === 'tenant' && renderFeatureCard('My Store Profile', faStoreAlt, 'Manage your store information and details.', '/store-profile', 'Update Profile')}
        {role === 'tenant' && renderFeatureCard('Submit Requests', faPaperPlane, 'Submit maintenance or service requests.', '/submit-request', 'New Request')}

        {/* Always show Profile Management */}
        {renderFeatureCard('Profile Settings', faUserCircle, 'Update your personal information, preferences, and account settings.', '/profile', 'Manage Profile', 'secondary')}
      </Row>
       {(role !== 'superadmin' && role !== 'admin' && role !== 'manager' && role !== 'staff' && role !== 'tenant') && (
        <Alert variant="info" className="mt-4 shadow-sm">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          No specific features are currently configured for your role ({roleDisplayName}). Please contact an administrator for assistance.
        </Alert>
      )}
    </Container>
  );
};

export default Dashboard;
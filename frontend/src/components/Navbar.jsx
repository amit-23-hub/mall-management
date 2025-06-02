import React, { useState } from 'react'; // Combined React import
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faSignOutAlt, 
  faUsersCog, 
  faStoreAlt, // Changed from faShoppingBag for consistency
  faCog, 
  faTachometerAlt, 
  faFileContract,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';

// Renamed props for clarity to match App.jsx state
const AppNavbar = ({ currentUser, onLogout }) => { 
  const navigate = useNavigate();
  const location = useLocation(); // Get current location for active links
  const [expanded, setExpanded] = useState(false); // State for toggling navbar on small screens

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setExpanded(false); // Collapse navbar after logout
  };

  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar 
      collapseOnSelect // Ensures NavDropdown closes when an item is clicked
      expand="lg" 
      className="navbar-custom sticky-top" 
      variant="dark" // Ensures text is light on dark background
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container fluid> {/* Changed to fluid for full-width navbar */} 
        <Navbar.Brand as={Link} to="/" onClick={closeNavbar} className="fw-bold">
          <FontAwesomeIcon icon={faStoreAlt} className="me-2" />
          Mall Management System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Conditional rendering based on currentUser instead of isLoggedIn */} 
            {currentUser ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  onClick={closeNavbar} 
                  active={location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard')}
                >
                  <FontAwesomeIcon icon={faTachometerAlt} className="me-1" /> Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/rules" 
                  onClick={closeNavbar} 
                  active={location.pathname === '/rules'}
                >
                  <FontAwesomeIcon icon={faFileContract} className="me-1" /> Rules & Regulations
                </Nav.Link>
                
                <NavDropdown 
                  title={<span className="user-display"><FontAwesomeIcon icon={faUserCircle} className="me-2" />{currentUser.username} <small className="text-white-50">({currentUser.role})</small></span>} 
                  id="collasible-nav-dropdown" 
                  align="end"
                  className="user-dropdown" // For potential custom styling
                >
                  {currentUser.role === 'superadmin' && (
                    <NavDropdown.Item 
                      as={Link} 
                      to="/user-management" 
                      onClick={closeNavbar} 
                      active={location.pathname === '/user-management'}
                    >
                      <FontAwesomeIcon icon={faUsersCog} className="me-2" /> User Management
                    </NavDropdown.Item>
                  )}
                  {(currentUser.role === 'superadmin' || currentUser.role === 'admin') && (
                    <NavDropdown.Item 
                      as={Link} 
                      to="/system-settings"  // Example, ensure this route exists if used
                      onClick={closeNavbar} 
                      active={location.pathname === '/system-settings'}
                    >
                      <FontAwesomeIcon icon={faCog} className="me-2" /> System Settings
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link 
                as={Link} 
                to="/login" 
                onClick={closeNavbar} 
                active={location.pathname === '/login'}
              >
                <Button variant="outline-light" size="sm" className="login-nav-btn">
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Login
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
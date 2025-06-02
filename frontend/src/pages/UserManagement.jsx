import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { userService, roleService } from '../services/api';
import {
  faUsersCog, faUserPlus, faUserEdit, faTrashAlt, faTimesCircle, // Maintained/refined icons
  faExclamationTriangle, faCheckCircle, faSpinner, faListUl, faUserCircle, 
  faUserShield, faUserTag, faEnvelope, faIdCard, faLock, faSave, faUsersSlash, faBuildingUser // Added more specific icons
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // For unauthorized message

// Debounce function
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

const UserManagement = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]); // Renamed from 'roles' to avoid conflict with formData.role
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null); // Renamed from 'error' for clarity
  const [successMessage, setSuccessMessage] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); 
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    role: ''
  });
  const [formError, setFormError] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageUsers = currentUser && (currentUser.role === 'superadmin' || currentUser.role === 'admin');

  const fetchUsersAndRoles = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      // Fetch users from API
      const usersResponse = await userService.getAll();
      setUsers(usersResponse.data.data);
      
      // Fetch roles from API
      const rolesResponse = await roleService.getAll();
      setAllRoles(rolesResponse.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setPageError('Failed to load user and role data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UserManagement component mounted');
    console.log('Current user:', currentUser);
    console.log('Can manage users:', canManageUsers);
    
    if (canManageUsers) {
      console.log('Fetching users and roles...');
      fetchUsersAndRoles();
    } else {
      console.log('User does not have permission to manage users');
      setLoading(false);
    }
  }, [canManageUsers, fetchUsersAndRoles, currentUser]);

  const resetModalState = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setFormData({ id: null, username: '', password: '', confirmPassword: '', name: '', email: '', role: '' });
    setFormError('');
    setIsSubmitting(false);
  };

  const handleAddUserModalShow = () => {
    resetModalState(); 
    setFormData(prev => ({ ...prev, role: allRoles.length > 0 ? allRoles.find(r => r.name.toLowerCase() === 'staff')?.name.toLowerCase() || allRoles[0].name.toLowerCase() : '' }));
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    console.log('Editing user:', user);
    setEditingUser(user);
    setFormData({
      _id: user._id,
      username: user.username,
      password: '',
      confirmPassword: '',
      name: user.name,
      email: user.email || '',
      role: user.role
    });
    setShowUserModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError(''); // Clear error on input change
  };

  const debouncedSetSuccessMessage = useCallback(debounce((message) => setSuccessMessage(message), 3000), []);
  const debouncedSetPageError = useCallback(debounce((message) => setPageError(message), 5000), []);

  // Handle form submission
  const handleUserFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted, editingUser:', editingUser);
    setFormError('');
    
    if (validateForm()) {
      console.log('Form validation passed');
      if (editingUser) {
        console.log('Handling update for user:', editingUser._id);
        handleUpdateUser();
      } else {
        console.log('Handling create for new user');
        handleCreateUser();
      }
    } else {
      console.log('Form validation failed');
    }
  };
  
  // Check if user has permission to access this page
  if (!canManageUsers) {
    return (
      <Container className="py-5 text-center user-management-unauthorized animated-page">
        <Alert variant="danger" className="d-inline-flex align-items-center shadow-sm">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          You do not have permission to access the User Management page.
        </Alert>
      </Container>
    );
  }
  
  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading user data...</p>
      </Container>
    );
  }

  const validateForm = () => {
    console.log('Validating form data:', { 
      ...formData, 
      password: formData.password ? '[REDACTED]' : undefined,
      isEditing: !!editingUser
    });
    
    if (!formData.username.trim() || !formData.name.trim() || !formData.role) {
      setFormError('Username, name, and role are required');
      return false;
    }

    // Email validation - allow empty but if provided must be valid
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    if (!editingUser && !formData.password) {
      setFormError('Password is required for new users');
      return false;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }

    if (formData.password && formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleUpdateUser = async () => {
    setIsSubmitting(true);
    setFormError('');
    try {

      // Prepare update data
      const userData = {
        username: formData.username,
        name: formData.name,
        email: formData.email || '',
        role: formData.role
      };

      // Only include password if it was changed
      if (formData.password) {
        userData.password = formData.password;
      }

      console.log('Updating user with ID:', formData._id);
      console.log('Update data:', { ...userData, password: userData.password ? '[REDACTED]' : undefined });

      // Update user via API
      const response = await userService.update(formData._id, userData);
      console.log('User updated successfully:', response.data);

      // Update state with the updated user
      setUsers(users.map(user => user._id === formData._id ? response.data.data : user));
      setSuccessMessage('User updated successfully!');
      resetModalState();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setFormError(`Failed to update user: ${error.response.data.message}`);
      } else {
        setFormError('Failed to update user. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = async () => {
    setIsSubmitting(true);
    setFormError('');
    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      // Create new user via API
      const userData = {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email || '',
        role: formData.role
      };

      console.log('Creating new user with data:', { ...userData, password: '[REDACTED]' });
      
      const response = await userService.create(userData);
      console.log('User created successfully:', response.data);

      // Update state with the new user from the response
      setUsers([...users, response.data.data]);
      setSuccessMessage('User created successfully!');
      resetModalState();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setFormError(`Failed to create user: ${error.response.data.message}`);
      } else {
        setFormError('Failed to create user. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        
        // Delete user via API
        await userService.delete(userId);
        
        // Update state
        setUsers(users.filter(user => user._id !== userId));
        setSuccessMessage('User deleted successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setPageError('Failed to delete user. Please try again.');
        console.error('Error deleting user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'superadmin': return 'danger';
      case 'admin': return 'warning';
      case 'manager': return 'info';
      case 'staff': return 'success';
      case 'tenant': return 'primary'; // Changed from secondary for better visibility
      default: return 'light';
    }
  };

  if (!canManageUsers) {
    return (
      <Container className="py-5 text-center user-management-unauthorized animated-page">
        <Alert variant="danger" className="d-inline-flex align-items-center shadow-sm">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          You do not have permission to access the User Management page.
        </Alert>
      </Container>
    );
  }

  
  if (loading && !pageError) { // Show loading only if no major page error
    return (
      <Container className="py-5 text-center loading-user-management">
        <Spinner animation="grow" variant="primary" style={{ width: '4rem', height: '4rem' }} />
        <h3 className="mt-3 text-muted">Loading User Management Console...</h3>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 user-management-page animated-page px-md-4">
      <Row className="mb-4 align-items-center animated-header">
        <Col md={8}>
          <h1 className="user-management-heading">
            <FontAwesomeIcon icon={faBuildingUser} className="me-3 text-primary" /> {/* Changed icon */}
            User Administration
          </h1>
          <p className="lead text-muted">Oversee all user accounts, roles, and platform access permissions.</p>
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" onClick={handleAddUserModalShow} className="add-user-btn btn-lg shadow-sm animated-button">
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Add New User
          </Button>
        </Col>
      </Row>

      {pageError && <Alert variant="danger" onClose={() => setPageError(null)} dismissible className="shadow-sm animated-alert mb-3"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2"/>{pageError}</Alert>}
      {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible className="shadow-sm animated-alert mb-3"><FontAwesomeIcon icon={faCheckCircle} className="me-2"/>{successMessage}</Alert>}

      <Card className="user-list-card shadow-lg animated-card">
        <Card.Header className="user-list-card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0"><FontAwesomeIcon icon={faListUl} className="me-2" /> User Directory</h5>
          <span className="text-muted small">Total Users: {users.length}</span>
        </Card.Header>
        <Card.Body className="p-0">
          {users.length > 0 ? (
            <Table striped hover responsive className="user-table mb-0 align-middle">
              <thead className="table-header-custom">
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="user-table-row animated-row">
                    <td>{index + 1}</td>
                    <td>
                      <FontAwesomeIcon icon={faUserCircle} className="me-2 text-muted" />
                      {user.username}
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email || <span className="text-muted fst-italic">N/A</span>}</td>
                    <td>
                      <Badge pill bg={getRoleBadgeVariant(user.role)} className="text-capitalize p-2 user-role-badge shadow-sm">
                        <FontAwesomeIcon icon={faUserTag} className="me-1" /> {user.role}
                      </Badge>
                    </td>
                    <td className="text-center action-buttons-cell">
                      {(currentUser.role === 'superadmin' || (currentUser.role === 'admin' && user.role !== 'superadmin')) && (
                        <>
                          <Button variant="outline-primary" size="sm" onClick={() => handleEditUser(user)} className="me-2 action-btn edit-btn">
                            <FontAwesomeIcon icon={faUserEdit} /> Edit
                          </Button>
                          {(currentUser.role === 'superadmin' && user._id !== currentUser._id) && (
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user._id)} className="action-btn delete-btn">
                              <FontAwesomeIcon icon={faTrashAlt} /> Delete
                            </Button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-5 text-muted no-users-found animated-empty-state">
              <FontAwesomeIcon icon={faUsersSlash} size="3x" className="mb-3" />
              <h4>No Users Found</h4>
              <p>The user directory is currently empty. Click "Add New User" to begin.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showUserModal} onHide={resetModalState} centered backdrop="static" className="user-modal animated-modal">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <FontAwesomeIcon icon={editingUser ? faUserEdit : faUserPlus} className="me-2" />
            {editingUser ? 'Edit User Details' : 'Create New User Account'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 modal-body-custom">
          <Form onSubmit={handleUserFormSubmit} noValidate>
            {formError && <Alert variant="danger" className="text-center p-2 mb-3 animated-alert">{formError}</Alert>}
            
            <Form.Group className="mb-3 form-floating-label">
              <Form.Control
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleFormChange}
                required
                disabled={!!editingUser} 
                className="form-control-custom"
                aria-describedby="usernameHelp"
              />
              <Form.Label htmlFor="username"><FontAwesomeIcon icon={faUserCircle} className="me-2" />Username</Form.Label>
              {!editingUser && <Form.Text id="usernameHelp" muted>Must be 3-20 characters (letters, numbers, underscores).</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3 form-floating-label">
              <Form.Control
                type="text"
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="form-control-custom"
              />
              <Form.Label htmlFor="name"><FontAwesomeIcon icon={faIdCard} className="me-2" />Full Name</Form.Label>
            </Form.Group>

            <Form.Group className="mb-3 form-floating-label">
              <Form.Control
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address (optional)"
                value={formData.email || ''}
                onChange={handleFormChange}
                className="form-control-custom"
              />
              <Form.Label htmlFor="email"><FontAwesomeIcon icon={faEnvelope} className="me-2" />Email Address (optional)</Form.Label>
            </Form.Group>
            
            <Row>
              <Col md={editingUser && !formData.password && !formData.confirmPassword ? 12 : 6}>
                <Form.Group className="mb-3 form-floating-label">
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    placeholder={editingUser ? "New password (optional)" : "Enter password"}
                    value={formData.password}
                    onChange={handleFormChange}
                    required={!editingUser}
                    className="form-control-custom"
                    aria-describedby="passwordHelpBlock"
                  />
                  <Form.Label htmlFor="password"><FontAwesomeIcon icon={faLock} className="me-2" />Password</Form.Label>
                  <Form.Text id="passwordHelpBlock" muted>
                    {editingUser ? "Leave blank to keep current password." : "Must be at least 6 characters."}
                  </Form.Text>
                </Form.Group>
              </Col>
              {(!editingUser || formData.password) && (
                <Col md={6}>
                  <Form.Group className="mb-3 form-floating-label">
                    <Form.Control
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      required={!editingUser || !!formData.password}
                      className="form-control-custom"
                    />
                    <Form.Label htmlFor="confirmPassword"><FontAwesomeIcon icon={faLock} className="me-2" />Confirm Password</Form.Label>
                  </Form.Group>
                </Col>
              )}
            </Row>

            <Form.Group className="mb-4 form-floating-label">
              <Form.Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                required
                className="form-select-custom"
                disabled={currentUser.role === 'admin' && editingUser?.role === 'superadmin' && editingUser?.id !== currentUser.id}
              >
                <option value="" disabled>Select a role...</option>
                {allRoles.map(r => (
                  <option key={r.id} value={r.name.toLowerCase()} 
                          disabled={currentUser.role === 'admin' && r.name.toLowerCase() === 'superadmin' && (!editingUser || editingUser.role !== 'superadmin')}>
                    {r.name.charAt(0).toUpperCase() + r.name.slice(1)} {/* Capitalize role name */}
                  </option>
                ))}
              </Form.Select>
              <Form.Label htmlFor="role"><FontAwesomeIcon icon={faUserShield} className="me-2" />User Role</Form.Label>
            </Form.Group>

            <div className="d-grid gap-2 mt-4">
              <Button variant="primary" type="submit" size="lg" disabled={isSubmitting} className="submit-user-btn animated-button">
                {isSubmitting ? (
                  <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> Saving User...</>
                ) : (
                  <><FontAwesomeIcon icon={editingUser ? faSave : faUserPlus} className="me-2" /> {editingUser ? 'Save Changes' : 'Create User Account'}</>
                )}
              </Button>
              <Button variant="outline-secondary" onClick={resetModalState} disabled={isSubmitting} className="cancel-btn">
                <FontAwesomeIcon icon={faTimesCircle} className="me-2" /> Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserManagement;
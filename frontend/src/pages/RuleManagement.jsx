import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ruleService, roleService } from '../services/api';
import {
  faFileContract,
  faPlus,
  faEdit,
  faTrashAlt,
  faTimesCircle,
  faExclamationTriangle,
  faCheckCircle,
  faSpinner,
  faListAlt,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

const RuleManagement = ({ currentUser }) => {
  const [rules, setRules] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    roleId: ''
  });

  // Check if user has permission to manage rules
  const canManageRules = currentUser && (currentUser.role === 'superadmin');

  // Fetch rules and roles
  const fetchRulesAndRoles = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      // Fetch all rules
      const rulesResponse = await ruleService.getAll();
      setRules(rulesResponse.data.data);
      
      // Fetch all roles
      const rolesResponse = await roleService.getAll();
      setAllRoles(rolesResponse.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setPageError('Failed to load rules and roles data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canManageRules) {
      fetchRulesAndRoles();
    }
  }, [canManageRules, fetchRulesAndRoles]);

  const resetModalState = () => {
    setShowRuleModal(false);
    setEditingRule(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      videoUrl: '',
      roleId: allRoles.length > 0 ? allRoles[0]._id : ''
    });
    setFormError('');
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    resetModalState();
  };

  const handleAddRuleModalShow = () => {
    resetModalState();
    setFormData(prev => ({ 
      ...prev, 
      roleId: allRoles.length > 0 ? allRoles[0]._id : '' 
    }));
    setShowRuleModal(true);
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setFormData({
      _id: rule._id,
      title: rule.title,
      description: rule.description,
      content: rule.content,
      videoUrl: rule.videoUrl || '',
      roleId: rule.roleId
    });
    setShowRuleModal(true);
  };

  const handleCreateRule = async () => {
    setIsSubmitting(true);
    setFormError('');
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.content || !formData.roleId) {
        setFormError('Title, description, content, and role are required');
        setIsSubmitting(false);
        return;
      }

      // Create new rule via API
      const ruleData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        videoUrl: formData.videoUrl,
        roleId: formData.roleId
      };

      const response = await ruleService.create(ruleData);

      // Update state with the new rule from the response
      setRules([...rules, response.data.data]);
      setSuccessMessage('Rule created successfully!');
      handleCloseModal();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setFormError('Failed to create rule. Please try again.');
      console.error('Error creating rule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRule = async () => {
    setIsSubmitting(true);
    setFormError('');
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.content || !formData.roleId) {
        setFormError('Title, description, content, and role are required');
        setIsSubmitting(false);
        return;
      }

      // Prepare update data
      const ruleData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        videoUrl: formData.videoUrl,
        roleId: formData.roleId
      };

      // Update rule via API
      const response = await ruleService.update(formData._id, ruleData);

      // Update state with the updated rule
      setRules(rules.map(rule => rule._id === formData._id ? response.data.data : rule));
      setSuccessMessage('Rule updated successfully!');
      handleCloseModal();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setFormError('Failed to update rule. Please try again.');
      console.error('Error updating rule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        setLoading(true);
        
        // Delete rule via API
        await ruleService.delete(ruleId);
        
        // Update state
        setRules(rules.filter(rule => rule._id !== ruleId));
        setSuccessMessage('Rule deleted successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setPageError('Failed to delete rule. Please try again.');
        console.error('Error deleting rule:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getRoleName = (roleId) => {
    const role = allRoles.find(role => role._id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  if (!canManageRules && !loading) {
    return (
      <Container className="py-5 text-center rule-management-unauthorized animated-page">
        <Alert variant="danger" className="d-inline-flex align-items-center shadow-sm">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          You do not have permission to access the Rule Management page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-md-4 rule-management-page animated-page">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="page-title">
            <FontAwesomeIcon icon={faFileContract} className="me-2 text-primary" />
            Rule Management
          </h1>
          <p className="text-muted">Create and manage rules for different roles in the system.</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={handleAddRuleModalShow}
            disabled={loading}
            className="d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Rule
          </Button>
        </Col>
      </Row>

      {pageError && (
        <Alert variant="danger" className="mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {pageError}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" className="mb-4">
          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
          {successMessage}
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading rules...</p>
            </div>
          ) : rules.length === 0 ? (
            <Alert variant="info">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              No rules found. Click "Add New Rule" to create your first rule.
            </Alert>
          ) : (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map(rule => (
                  <tr key={rule._id}>
                    <td>{rule.title}</td>
                    <td>{rule.description}</td>
                    <td>
                      <Badge bg="info" className="text-white">
                        {getRoleName(rule.roleId)}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditRule(rule)}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteRule(rule._id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Rule Modal */}
      <Modal show={showRuleModal} onHide={handleCloseModal} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRule ? (
              <>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit Rule
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add New Rule
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && (
            <Alert variant="danger" className="mb-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {formError}
            </Alert>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                disabled={isSubmitting}
              >
                {allRoles.map(role => (
                  <option key={role._id} value={role._id}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter rule title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter rule description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter detailed rule content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Video URL (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                disabled={isSubmitting}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>
            <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={editingRule ? handleUpdateRule : handleCreateRule}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                {editingRule ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={editingRule ? faEdit : faPlus} className="me-2" />
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RuleManagement;

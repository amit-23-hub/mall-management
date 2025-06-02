import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Container, Row, Col, Card, Accordion, Alert, Spinner, Button, Badge, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ruleService, roleService } from '../services/api';
import {
  faLandmark,
  faFileAlt,
  faVideo,
  faExclamationTriangle,
  faInfoCircle,
  faPlayCircle,
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
  faShieldAlt,
  faUserTie,
  faStore,
  faClipboardList,
  faHandshake,
  faChartLine,
  faBell,
  faLock,
  faUsers,
  faCalendarAlt,
  faClock,
  faTag,
  faBullhorn,
  faHardHat,
  faFireExtinguisher,
  faFirstAid,
  faDoorOpen,
  faTrash,
  faRecycle,
  faWater,
  faLightbulb,
  faShoppingBag,
  faMoneyBillWave,
  faIdCard,
  faMapMarkerAlt,
  faStar
} from '@fortawesome/free-solid-svg-icons';
const ReactPlayer = lazy(() => import('react-player/lazy'));
import { Link } from 'react-router-dom';

// Helper functions for enhanced rules display
const getRuleIcon = (ruleId) => {
  const iconMap = {
    1: faUserTie,      // Super Admin
    2: faUsers,        // Admin User Management
    3: faChartLine,    // Admin Reporting
    4: faStore,        // Manager Operations
    5: faClipboardList, // Manager Reporting
    6: faIdCard,       // Staff Conduct
    7: faShieldAlt,    // Staff Safety
    8: faHandshake,    // Tenant Lease
    9: faBullhorn      // Tenant Marketing
  };
  return iconMap[ruleId] || faFileAlt;
};

const getRuleSectionTitle = (ruleId) => {
  const titleMap = {
    1: "Super Administrator Responsibilities",
    2: "User Management Protocol",
    3: "Reporting Standards",
    4: "Operational Management Guidelines",
    5: "Performance Reporting Requirements",
    6: "Staff Code of Conduct",
    7: "Safety & Emergency Protocols",
    8: "Lease Agreement Compliance",
    9: "Marketing & Promotion Standards"
  };
  return titleMap[ruleId] || "General Guidelines";
};

const getRulePoints = (ruleId) => {
  const pointsMap = {
    1: [ // Super Admin
      { icon: faLock, text: "Maintain system security by regularly auditing user access and permissions." },
      { icon: faUsers, text: "Oversee all user role assignments and permission levels across the mall management system." },
      { icon: faShieldAlt, text: "Implement and enforce security protocols for all system access points." },
      { icon: faChartLine, text: "Monitor system performance and implement necessary upgrades or modifications." },
      { icon: faExclamationCircle, text: "Respond to critical system alerts and security breaches within 30 minutes." }
    ],
    2: [ // Admin User Management
      { icon: faUserTie, text: "Create user accounts only after verifying employment status and required access level." },
      { icon: faIdCard, text: "Assign appropriate role permissions based on job responsibilities and department." },
      { icon: faLock, text: "Enforce strong password policies and two-factor authentication where applicable." },
      { icon: faTimesCircle, text: "Deactivate user accounts immediately upon employee termination or role change." },
      { icon: faClipboardList, text: "Maintain detailed logs of all user account activities and permission changes." }
    ],
    3: [ // Admin Reporting
      { icon: faChartLine, text: "Generate comprehensive monthly performance reports by the 5th of each month." },
      { icon: faLock, text: "Maintain strict confidentiality of all financial and operational data." },
      { icon: faUsers, text: "Distribute reports only to authorized personnel with appropriate clearance." },
      { icon: faClipboardList, text: "Archive all reports according to the data retention policy (minimum 7 years)." },
      { icon: faExclamationCircle, text: "Flag any significant deviations or anomalies in operational metrics." }
    ],
    4: [ // Manager Operations
      { icon: faCalendarAlt, text: "Create and publish staff schedules at least two weeks in advance." },
      { icon: faShoppingBag, text: "Maintain inventory levels within approved thresholds (15-20% buffer stock)." },
      { icon: faUsers, text: "Conduct weekly staff meetings to address operational challenges and updates." },
      { icon: faMoneyBillWave, text: "Ensure daily cash reconciliation and deposit procedures are followed." },
      { icon: faMapMarkerAlt, text: "Monitor store cleanliness and presentation standards throughout operating hours." }
    ],
    5: [ // Manager Reporting
      { icon: faClipboardList, text: "Submit weekly sales reports by Monday 10 AM for the previous week." },
      { icon: faChartLine, text: "Track and report key performance indicators including foot traffic and conversion rates." },
      { icon: faUsers, text: "Provide detailed staff performance evaluations on a quarterly basis." },
      { icon: faExclamationCircle, text: "Report any security incidents or policy violations within 24 hours." },
      { icon: faShoppingBag, text: "Maintain accurate inventory records with monthly reconciliation reports." }
    ],
    6: [ // Staff Conduct
      { icon: faClock, text: "Arrive 15 minutes before shift start time for proper handover and preparation." },
      { icon: faIdCard, text: "Wear appropriate uniform and name badge at all times while on duty." },
      { icon: faUsers, text: "Maintain professional and courteous demeanor with all customers and colleagues." },
      { icon: faTimesCircle, text: "Refrain from personal phone use or social media during working hours." },
      { icon: faCheckCircle, text: "Follow all mall protocols for customer service and complaint resolution." }
    ],
    7: [ // Staff Safety
      { icon: faFireExtinguisher, text: "Know the location of all fire extinguishers and emergency exits in your area." },
      { icon: faFirstAid, text: "Complete basic first aid training within 30 days of employment." },
      { icon: faBell, text: "Participate in all scheduled emergency drills without exception." },
      { icon: faExclamationCircle, text: "Report any safety hazards or equipment malfunctions immediately." },
      { icon: faDoorOpen, text: "Follow proper lockdown procedures during security incidents." }
    ],
    8: [ // Tenant Lease
      { icon: faHandshake, text: "Submit rent payments by the 1st of each month; late fees apply after the 5th." },
      { icon: faClock, text: "Adhere to mall operating hours; early closure requires management approval." },
      { icon: faStore, text: "Maintain storefront appearance according to mall design guidelines." },
      { icon: faTrash, text: "Dispose of waste in designated areas using proper sorting procedures." },
      { icon: faLightbulb, text: "Implement energy conservation measures during non-operating hours." }
    ],
    9: [ // Tenant Marketing
      { icon: faBullhorn, text: "Submit all promotional materials for approval at least 14 days before display." },
      { icon: faTag, text: "Ensure all sale signage complies with mall design and size regulations." },
      { icon: faCalendarAlt, text: "Participate in at least 75% of mall-wide promotional events annually." },
      { icon: faUsers, text: "Train staff on current promotions and mall-wide marketing initiatives." },
      { icon: faStar, text: "Maintain consistent branding that aligns with mall's luxury positioning." }
    ]
  };
  return pointsMap[ruleId] || [
    { icon: faCheckCircle, text: "Follow all general mall policies and procedures." },
    { icon: faUsers, text: "Maintain professional relationships with all mall staff and tenants." },
    { icon: faExclamationCircle, text: "Report any policy violations to appropriate management." }
  ];
};

const getRuleHighlight = (ruleId) => {
  const highlightMap = {
    1: "As Super Admin, you are the final authority on system access and security. Any breach must be reported to the IT Director and Mall General Manager immediately.",
    2: "Never share admin credentials or create generic accounts. Each user must have their own unique login credentials.",
    3: "All reports containing sensitive financial data must be encrypted before transmission and marked as confidential.",
    4: "Manager override codes for POS systems must be changed every 30 days and never shared with staff members.",
    5: "Failure to submit reports by the deadline three times in a quarter will result in a performance review.",
    6: "Any staff member receiving three customer complaints within a 30-day period will be subject to disciplinary action.",
    7: "In case of fire alarm activation, staff must assist in customer evacuation before leaving the premises.",
    8: "Any modifications to leased space, including fixtures and signage, require written approval from mall management.",
    9: "Sales or promotions claiming 'Mall-wide Event' without proper authorization will result in a compliance violation."
  };
  return highlightMap[ruleId] || null;
};

const getComplianceGuidelines = (ruleId) => {
  const guidelinesMap = {
    1: [ // Super Admin
      { icon: faClipboardList, text: "Conduct monthly security audits of all system access points and user permissions." },
      { icon: faUsers, text: "Review and approve all role changes for management-level accounts." },
      { icon: faLock, text: "Update system security protocols quarterly or after any security incident." }
    ],
    2: [ // Admin User Management
      { icon: faIdCard, text: "Verify identity documentation before creating any new user account." },
      { icon: faClipboardList, text: "Document all permission changes with reason and authorization source." },
      { icon: faTimesCircle, text: "Perform quarterly audit of inactive accounts and remove as appropriate." }
    ],
    3: [ // Admin Reporting
      { icon: faLock, text: "Use encrypted channels for all report distribution containing sensitive data." },
      { icon: faClipboardList, text: "Include data source and methodology footnotes in all analytical reports." },
      { icon: faChartLine, text: "Maintain version control on all reports with change tracking enabled." }
    ],
    4: [ // Manager Operations
      { icon: faCalendarAlt, text: "Submit staffing plans for peak seasons 60 days in advance for approval." },
      { icon: faCheckCircle, text: "Complete daily opening and closing checklists without exception." },
      { icon: faExclamationCircle, text: "Document all policy exceptions with management approval." }
    ],
    5: [ // Manager Reporting
      { icon: faChartLine, text: "Use approved templates and formats for all performance reports." },
      { icon: faClipboardList, text: "Include action plans for addressing any metrics below target." },
      { icon: faUsers, text: "Provide supporting documentation for all performance evaluations." }
    ],
    6: [ // Staff Conduct
      { icon: faIdCard, text: "Complete customer service refresher training annually." },
      { icon: faUsers, text: "Adhere to the conflict resolution protocol for all customer complaints." },
      { icon: faCheckCircle, text: "Maintain attendance record with no more than 3 unexcused absences per quarter." }
    ],
    7: [ // Staff Safety
      { icon: faFireExtinguisher, text: "Complete fire safety certification within 60 days of employment." },
      { icon: faFirstAid, text: "Know location and contents of first aid kits in your department." },
      { icon: faClipboardList, text: "Document all safety incidents regardless of severity." }
    ],
    8: [ // Tenant Lease
      { icon: faHandshake, text: "Schedule annual lease review meeting with mall management." },
      { icon: faStore, text: "Submit maintenance requests through the official tenant portal only." },
      { icon: faRecycle, text: "Achieve minimum 70% compliance with mall recycling program." }
    ],
    9: [ // Tenant Marketing
      { icon: faBullhorn, text: "Use approved marketing templates for all mall-related promotions." },
      { icon: faTag, text: "Maintain accurate pricing on all advertised items throughout the promotion period." },
      { icon: faCalendarAlt, text: "Submit annual marketing calendar by December 1st for the following year." }
    ]
  };
  return guidelinesMap[ruleId] || [
    { icon: faCheckCircle, text: "Adhere to all mall policies and procedures at all times." },
    { icon: faClipboardList, text: "Document any policy exceptions with appropriate management approval." },
    { icon: faExclamationCircle, text: "Report compliance concerns through the proper channels." }
  ];
};

const Rules = ({ currentUser }) => {
  const [userRules, setUserRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      setError(null);
      try {
        if (currentUser && currentUser.role) {
          // Get all roles to find the role ID
          const rolesResponse = await roleService.getAll();
          const rolesData = rolesResponse.data.data;
          
          const userRoleObject = rolesData.find(role => role.name.toLowerCase() === currentUser.role.toLowerCase());
          
          if (userRoleObject) {
            // Get rules by role ID
            const rulesResponse = await ruleService.getByRoleId(userRoleObject._id);
            const filteredRules = rulesResponse.data.data;
            
            setUserRules(filteredRules);
            if (filteredRules.length > 0) {
              setOpenAccordion(String(filteredRules[0]._id)); // Open first rule by default
            }
          } else {
            setUserRules([]);
          }
        } else {
          setUserRules([]);
        }
      } catch (err) {
        console.error('Error fetching rules:', err);
        setError('Failed to load rules and regulations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [currentUser]);

  const toggleAccordion = (eventKey) => {
    setOpenAccordion(openAccordion === eventKey ? null : eventKey);
  };

  if (!currentUser) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 rules-unauthorized animated-page">
        <Alert variant="warning" className="text-center shadow-xl p-4 p-sm-5 animated-alert">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="mb-3 text-warning" />
          <Alert.Heading as="h2" className="mb-3">Access Restricted</Alert.Heading>
          <p className="lead mb-4">Please <Link to="/login" className="fw-bold text-decoration-underline">login</Link> to view the rules and regulations specific to your role.</p>
          <Button as={Link} to="/" variant="outline-secondary">Go to Homepage</Button>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 loading-rules">
        <div className="text-center">
          <Spinner animation="grow" variant="primary" style={{ width: '4rem', height: '4rem' }} />
          <h3 className="mt-4 text-muted">Loading Mall Regulations...</h3>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 rules-error animated-page">
        <Alert variant="danger" className="text-center shadow-xl p-4 p-sm-5 animated-alert">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="mb-3 text-danger" />
          <Alert.Heading as="h2" className="mb-3">Error Loading Regulations</Alert.Heading>
          <p className="lead mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()} className="me-2 animated-button">Try Again</Button>
          <Button as={Link} to="/dashboard" variant="outline-secondary" className="animated-button-secondary">Back to Dashboard</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 rules-page animated-page px-lg-5 px-md-4">
      <Row className="mb-5 pt-4 align-items-center animated-header">
        <Col lg={8} md={7}>
          <h1 className="rules-heading display-5 mb-3">
            <FontAwesomeIcon icon={faLandmark} className="me-3 text-primary shimmer-effect" />
            Mall Regulations & Guidelines
          </h1>
          <p className="lead mb-3">
            Official policies and procedures for <Badge bg="primary" pill className="px-3 py-1 fs-6 align-middle shadow-sm">{currentUser.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'All Users'}</Badge>
          </p>
          <p className="text-muted">
            <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-secondary" />
            These regulations are designed to ensure a safe, efficient, and professional mall environment. 
            Please review all sections carefully and implement them in your daily operations.
          </p>
        </Col>
        <Col lg={4} md={5} className="d-flex justify-content-md-end justify-content-center mt-4 mt-md-0">
          <div className="rules-header-graphic text-center">
            <div className="rules-icon-container mb-2 mx-auto">
              <FontAwesomeIcon icon={faShieldAlt} className="rules-main-icon" />
            </div>
            <div className="rules-stat-box">
              <div className="rules-stat-item">
                <span className="rules-stat-number">{userRules.length}</span>
                <span className="rules-stat-label">Applicable Rules</span>
              </div>
              <div className="rules-stat-item">
                <span className="rules-stat-number">{new Date().getFullYear()}</span>
                <span className="rules-stat-label">Current Edition</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {!loading && !error && userRules.length === 0 && (
        <Card className="shadow-lg text-center p-5 animated-card no-rules-card">
          <Card.Body>
            <FontAwesomeIcon icon={faInfoCircle} size="4x" className="text-info mb-4" />
            <Card.Title as="h3" className="mb-3">No Specific Regulations Found</Card.Title>
            <Card.Text className="text-muted lead px-md-5">
              There are currently no specific rules or guidelines defined for your role ({currentUser?.role}). 
              Please adhere to general mall policies. If you have questions, contact administration.
            </Card.Text>
            <Button as={Link} to="/dashboard" variant="primary" className="mt-4 animated-button">Return to Dashboard</Button>
          </Card.Body>
        </Card>
      )}

      {!loading && !error && userRules.length > 0 && (
        <Accordion activeKey={openAccordion} onSelect={toggleAccordion} flush className="rules-accordion shadow-lg rounded overflow-hidden">
          {userRules.map((rule) => (
            <Accordion.Item eventKey={String(rule.id)} key={rule.id} className={`rule-accordion-item animated-accordion-item ${openAccordion === String(rule.id) ? 'item-active' : ''}`}>
              <Accordion.Header as={Button} variant="link" className="rule-accordion-header w-100 text-start d-flex justify-content-between align-items-center p-3">
                <span className="fw-bold fs-5 rule-title">
                  <FontAwesomeIcon icon={faFileAlt} className="me-2 text-primary opacity-75" /> 
                  {rule.title}
                </span>
              </Accordion.Header>
              <Accordion.Body className="rule-accordion-body p-3 p-md-4">
                {rule.description && <p className="rule-description text-muted mb-3 fst-italic">{rule.description}</p>}
                
                {/* Enhanced Rule Content with Icons and Sections */}
                <div className="rule-content mb-3">
                  {/* Main rule content section */}
                  <div className="rule-section">
                    <h4 className="rule-section-title">
                      <FontAwesomeIcon icon={getRuleIcon(rule.id)} className="section-icon" />
                      {getRuleSectionTitle(rule.id)}
                    </h4>
                    <p>{rule.content}</p>
                  </div>
                  
                  {/* Key Points with Icons */}
                  <div className="rule-section">
                    <h5 className="rule-section-title">
                      <FontAwesomeIcon icon={faClipboardList} className="section-icon" />
                      Key Requirements
                    </h5>
                    <ul className="rule-points">
                      {getRulePoints(rule.id).map((point, index) => (
                        <li key={index}>
                          <FontAwesomeIcon icon={point.icon} className="rule-point-icon" />
                          <span className="rule-point-text">{point.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Important Highlights */}
                  {getRuleHighlight(rule.id) && (
                    <div className="rule-highlight">
                      <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                      <strong>Important:</strong> {getRuleHighlight(rule.id)}
                    </div>
                  )}
                  
                  {/* Compliance Guidelines */}
                  <div className="rule-section">
                    <h5 className="rule-section-title">
                      <FontAwesomeIcon icon={faShieldAlt} className="section-icon" />
                      Compliance Guidelines
                    </h5>
                    <ul className="rule-points">
                      {getComplianceGuidelines(rule.id).map((guideline, index) => (
                        <li key={index}>
                          <FontAwesomeIcon icon={guideline.icon} className="rule-point-icon" />
                          <span className="rule-point-text">{guideline.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Video section */}
                {rule.videoUrl && (
                  <div className="video-player-container mt-4 mb-3 p-3 bg-light rounded shadow-sm">
                    <h5 className="video-section-title mb-3 text-primary">
                      <FontAwesomeIcon icon={faVideo} className="me-2" /> Instructional Video Guide
                    </h5>
                    <Suspense 
                      fallback={
                        <div className="text-center py-5">
                          <Spinner animation="border" variant="secondary" />
                          <p className="mt-2 text-muted">Loading video player...</p>
                        </div>
                      }
                    >
                      <div className="player-wrapper ratio ratio-16x9">
                        <ReactPlayer 
                          url={rule.videoUrl} 
                          width='100%' 
                          height='100%' 
                          controls 
                          className='react-player'
                          config={{
                            youtube: {
                              playerVars: { showinfo: 1, modestbranding: 1, rel: 0, color: 'white', iv_load_policy: 3 }
                            },
                            vimeo: {
                              playerOptions: { byline: false, portrait: false, color: '00adef' }
                            }
                          }}
                          light={true} 
                          playing={openAccordion === String(rule.id)} 
                          playIcon={<Button variant="light" size="lg" className="play-icon-button"><FontAwesomeIcon icon={faPlayCircle} size="3x" className="text-primary" /></Button>}
                        />
                      </div>
                    </Suspense>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default Rules;
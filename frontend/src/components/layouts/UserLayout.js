import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaTasks, FaChartLine, FaSignOutAlt } from 'react-icons/fa';

const UserLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} lg={2} className="sidebar">
          <div className="sidebar-heading">
            Task Management
          </div>
          <Nav className="flex-column">
            <NavLink to="/dashboard" className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              <FaChartLine /> Dashboard
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              <FaTasks /> My Tasks
            </NavLink>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="ms-auto">
          <Navbar bg="white" expand="lg" className="border-bottom px-3">
            <Navbar.Brand>User Panel</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text className="me-3">
                Signed in as: <strong>{user?.name}</strong>
              </Navbar.Text>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                <FaSignOutAlt className="me-1" /> Logout
              </Button>
            </Navbar.Collapse>
          </Navbar>
          
          <div className="content-container">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLayout; 
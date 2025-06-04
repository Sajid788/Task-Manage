import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { FaUsers, FaTasks, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { adminAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getDashboardStats();
        setStats(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard stats');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-5"><FaSpinner className="fa-spin" /> Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaUsers size={30} className="text-primary" />
              </div>
              <Card.Title as="h2">{stats.totalUsers}</Card.Title>
              <Card.Text>Total Users</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaTasks size={30} className="text-info" />
              </div>
              <Card.Title as="h2">{stats.totalTasks}</Card.Title>
              <Card.Text>Total Tasks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaCheckCircle size={30} className="text-success" />
              </div>
              <Card.Title as="h2">{stats.completedTasks}</Card.Title>
              <Card.Text>Completed Tasks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaSpinner size={30} className="text-warning" />
              </div>
              <Card.Title as="h2">{stats.pendingTasks}</Card.Title>
              <Card.Text>Pending Tasks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Activity</Card.Title>
              <p>This is a placeholder for recent activity. In a real application, this would show the latest actions like user registrations, task creations, status changes, etc.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
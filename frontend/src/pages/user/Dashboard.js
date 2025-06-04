import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { FaCheck, FaSpinner, FaClock } from 'react-icons/fa';
import { tasksAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await tasksAPI.getTasks(1, 100); // Get a larger number to calculate stats
        const tasks = res.data.tasks;

        setStats({
          totalTasks: tasks.length,
          completedTasks: tasks.filter(task => task.status === 'completed').length,
          pendingTasks: tasks.filter(task => task.status === 'pending').length,
          inProgressTasks: tasks.filter(task => task.status === 'in-progress').length
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load dashboard data');
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
      <h2 className="mb-4">My Dashboard</h2>
      
      <Row>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaCheck size={30} className="text-success" />
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
                <FaSpinner size={30} className="text-primary" />
              </div>
              <Card.Title as="h2">{stats.inProgressTasks}</Card.Title>
              <Card.Text>In Progress</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaClock size={30} className="text-warning" />
              </div>
              <Card.Title as="h2">{stats.pendingTasks}</Card.Title>
              <Card.Text>Pending Tasks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100 bg-light">
            <Card.Body>
              <Card.Title as="h2">{stats.totalTasks}</Card.Title>
              <Card.Text>Total Tasks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Task Overview</Card.Title>
              <p>Welcome to your task management dashboard! Here you can see an overview of your tasks and their status.</p>
              <p>To view all your tasks and manage them, please visit the "My Tasks" section.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 
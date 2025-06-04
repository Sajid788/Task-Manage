import React, { useState, useEffect } from 'react';
import { Card, Badge, Alert, Row, Col, Spinner, Pagination, Button, Modal } from 'react-bootstrap';
import { FaCheck, FaSpinner, FaClock, FaPlus } from 'react-icons/fa';
import { tasksAPI } from '../../services/api';
import TaskForm from '../../components/TaskForm';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks(pagination.page);
  }, [pagination.page]);

  const fetchTasks = async (page) => {
    try {
      setLoading(true);
      const res = await tasksAPI.getTasks(page, 5);
      
      setTasks(res.data.tasks);
      setPagination({
        page,
        pages: res.data.pagination.pages,
        total: res.data.pagination.total
      });
      
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchTasks(pagination.page);
  };

  const renderStatusBadge = (status) => {
    let variant, icon;
    
    switch (status) {
      case 'pending':
        variant = 'warning';
        icon = <FaClock className="me-1" />;
        break;
      case 'in-progress':
        variant = 'primary';
        icon = <FaSpinner className="me-1" />;
        break;
      case 'completed':
        variant = 'success';
        icon = <FaCheck className="me-1" />;
        break;
      default:
        variant = 'secondary';
        icon = null;
    }
    
    return (
      <Badge bg={variant} className="d-flex align-items-center" style={{ width: 'fit-content' }}>
        {icon} {status}
      </Badge>
    );
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const renderPagination = () => {
    const { page, pages } = pagination;
    
    if (pages <= 1) return null;
    
    let items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      />
    );
    
    // First page
    items.push(
      <Pagination.Item 
        key={1} 
        active={page === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );
    
    // Ellipsis if needed
    if (page > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" />);
    }
    
    // Pages around current
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
      items.push(
        <Pagination.Item 
          key={i} 
          active={page === i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    // Ellipsis if needed
    if (page < pages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis2" />);
    }
    
    // Last page if there are more than 1 page
    if (pages > 1) {
      items.push(
        <Pagination.Item 
          key={pages} 
          active={page === pages}
          onClick={() => handlePageChange(pages)}
        >
          {pages}
        </Pagination.Item>
      );
    }
    
    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        disabled={page === pages}
        onClick={() => handlePageChange(page + 1)}
      />
    );
    
    return <Pagination>{items}</Pagination>;
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <Row className="page-header">
        <Col>
          <h2>My Tasks</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {tasks.length === 0 ? (
        <Alert variant="info">No tasks assigned to you yet.</Alert>
      ) : (
        <>
          {tasks.map(task => (
            <Card key={task._id} className="mb-3 task-card">
              <Card.Body>
                <div className="task-header mb-2">
                  <h5 className="mb-0">{task.title}</h5>
                  <div>{renderStatusBadge(task.status)}</div>
                </div>
                <p className="text-muted mb-2">{task.description}</p>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    Created by: {task.createdBy?.name || 'Unknown'}
                  </small>
                  <small className="text-muted">
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </small>
                </div>
              </Card.Body>
            </Card>
          ))}
          
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              Showing {tasks.length} of {pagination.total} tasks
            </div>
            <div>{renderPagination()}</div>
          </div>
        </>
      )}

      
    </div>
  );
};

export default Tasks; 
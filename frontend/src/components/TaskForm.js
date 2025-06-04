import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { tasksAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskForm = ({ task, onSubmitSuccess, onCancel }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    assignedTo: '',
    dueDate: ''
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        assignedTo: task.assignedTo?._id || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  // Load users for assignment dropdown (admin only)
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users for assignment');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // If not admin, assign to self
      const submissionData = { ...formData };
      if (!isAdmin) {
        submissionData.assignedTo = user._id;
      }
      
      if (isEditing) {
        await tasksAPI.updateTask(task._id, submissionData);
        toast.success('Task updated successfully');
      } else {
        await tasksAPI.createTask(submissionData);
        toast.success('Task created successfully');
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          assignedTo: '',
          dueDate: ''
        });
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error(isEditing ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter task title"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Enter task description"
          rows={3}
        />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col>
          <Form.Group>
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {isAdmin && (
        <Form.Group className="mb-3">
          <Form.Label>Assign To</Form.Label>
          {loadingUsers ? (
            <div className="text-center py-2">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <Form.Select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>
      )}

      <div className="d-flex justify-content-end gap-2 mt-4">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Task' : 'Create Task'
          )}
        </Button>
      </div>
    </Form>
  );
};

export default TaskForm; 
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Alert, Form, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingUser, setUpdatingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      setUsers(res.data);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUpdatingUser(userId);
      
      const res = await adminAPI.updateUserStatus(userId, newStatus);
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading && users.length === 0) {
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
          <h2>User Management</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {users.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        users.map(user => (
          <Card key={user._id} className="mb-3">
            <Card.Body>
              <div className="user-header">
                <div>
                  <h5>{user.name}</h5>
                  <p className="text-muted mb-1">{user.email}</p>
                  <div>
                    <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'} className="me-2">
                      {user.role}
                    </Badge>
                    <Badge 
                      bg={user.status === 'active' ? 'success' : 'danger'}
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  {user.role !== 'admin' && (
                    <>
                      {updatingUser === user._id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          {user.status === 'active' ? (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleStatusChange(user._id, 'inactive')}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleStatusChange(user._id, 'active')}
                            >
                              Activate
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default UserManagement; 
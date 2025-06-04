import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Alert, Form, Row, Col, Spinner, Pagination, Dropdown, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaCheck, FaSpinner, FaClock, FaPlus, FaEdit } from 'react-icons/fa';
import { tasksAPI } from '../../services/api';
import TaskForm from '../../components/TaskForm';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTasks, setSelectedTasks] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [updatingTasks, setUpdatingTasks] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Keep track of loaded pages to avoid reloading data
  const [loadedPages, setLoadedPages] = useState({});
  const [tasksPerPage, setTasksPerPage] = useState({});

  useEffect(() => {
    fetchTasks(pagination.page);
  }, [pagination.page]);

  const fetchTasks = async (page) => {
    try {
      // Check if we've already loaded this page
      if (loadedPages[page]) {
        // Use cached data
        setTasks(tasksPerPage[page]);
        return;
      }

      setLoading(true);
      const res = await tasksAPI.getTasks(page, 5);
      
      setTasks(res.data.tasks);
      setPagination({
        page,
        pages: res.data.pagination.pages,
        total: res.data.pagination.total
      });

      // Cache the loaded page
      setLoadedPages(prev => ({ ...prev, [page]: true }));
      setTasksPerPage(prev => ({ ...prev, [page]: res.data.tasks }));
      
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setCurrentTask(null);
    
    // Clear cache to refresh data
    setLoadedPages({});
    setTasksPerPage({});
    
    fetchTasks(pagination.page);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowEditForm(true);
  };

  const getSelectedCount = () => {
    return Object.values(selectedTasks).filter(selected => selected).length;
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));

    // Update selectAll state based on selection
    const currentPageTaskIds = tasks.map(task => task._id);
    const selectedCount = Object.entries(selectedTasks)
      .filter(([id, selected]) => selected && currentPageTaskIds.includes(id))
      .length;
    
    if (selectedCount + 1 === tasks.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const handleSelectAllTasks = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    // Update selected tasks based on select all
    const newSelectedTasks = { ...selectedTasks };
    tasks.forEach(task => {
      newSelectedTasks[task._id] = newSelectAll;
    });
    
    setSelectedTasks(newSelectedTasks);
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      setUpdatingTasks(true);
      
      // Get all selected task IDs
      const taskIds = Object.entries(selectedTasks)
        .filter(([_, selected]) => selected)
        .map(([id, _]) => id);
      
      if (taskIds.length === 0) {
        toast.warning('No tasks selected');
        return;
      }
      
      // Call API to update tasks
      await tasksAPI.bulkUpdateTasks(taskIds, status);
      
      // Update local state
      let updatedTasksPerPage = { ...tasksPerPage };
      
      // Update each page's tasks
      Object.keys(updatedTasksPerPage).forEach(page => {
        updatedTasksPerPage[page] = updatedTasksPerPage[page].map(task => 
          taskIds.includes(task._id) ? { ...task, status } : task
        );
      });
      
      setTasksPerPage(updatedTasksPerPage);
      
      // Update current displayed tasks
      setTasks(tasks.map(task => 
        taskIds.includes(task._id) ? { ...task, status } : task
      ));
      
      // Clear selection
      setSelectedTasks({});
      setSelectAll(false);
      
      toast.success(`${taskIds.length} tasks updated to ${status}`);
    } catch (error) {
      console.error('Error updating tasks:', error);
      toast.error('Failed to update tasks');
    } finally {
      setUpdatingTasks(false);
    }
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
          <h2>Task Management</h2>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          {getSelectedCount() > 0 && (
            <div className="d-flex align-items-center">
              <span className="me-2">
                <strong>{getSelectedCount()}</strong> tasks selected
              </span>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-actions" disabled={updatingTasks}>
                  {updatingTasks ? 'Updating...' : 'Bulk Actions'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleBulkStatusUpdate('pending')}>
                    Mark as Pending
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBulkStatusUpdate('in-progress')}>
                    Mark as In Progress
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBulkStatusUpdate('completed')}>
                    Mark as Completed
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          <Button 
            variant="success"
            onClick={() => setShowCreateForm(true)}
          >
            <FaPlus className="me-2" /> Create Task
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Check 
        type="checkbox"
        id="select-all"
        label="Select All"
        className="mb-3"
        checked={selectAll}
        onChange={handleSelectAllTasks}
      />

      {tasks.length === 0 ? (
        <Alert variant="info">No tasks found.</Alert>
      ) : (
        <>
          {tasks.map(task => (
            <Card key={task._id} className="mb-3 task-card">
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <Form.Check 
                    type="checkbox"
                    id={`task-${task._id}`}
                    checked={selectedTasks[task._id] || false}
                    onChange={() => handleTaskSelection(task._id)}
                    className="me-3"
                  />
                  <div className="task-header w-100 d-flex justify-content-between">
                    <div className='d-flex align-items-center'>
                      <h5 className="mb-0">{task.title}</h5>
                      <div className='ms-2'>{renderStatusBadge(task.status)}</div>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleEditTask(task)}
                    >
                      <FaEdit /> Edit
                    </Button>
                  </div>
                </div>
                <p className="text-muted mb-2">{task.description}</p>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    {task.assignedTo ? `Assigned to: ${task.assignedTo.name}` : 'Unassigned'}
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

      {/* Create Task Modal */}
      <Modal show={showCreateForm} onHide={() => setShowCreateForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm 
            onSubmitSuccess={handleFormSubmit}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Edit Task Modal */}
      <Modal show={showEditForm} onHide={() => setShowEditForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm 
            task={currentTask}
            onSubmitSuccess={handleFormSubmit}
            onCancel={() => setShowEditForm(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskManagement; 
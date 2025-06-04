const User = require('../models/User');
const Task = require('../models/Task');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If status is being changed to inactive, increment token version to invalidate sessions
    if (user.status !== status && status === 'inactive') {
      user.tokenVersion += 1;
    }
    
    user.status = status;
    await user.save();
    
    res.json({ 
      message: 'User status updated', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const tasksCount = await Task.countDocuments();
    const completedTasksCount = await Task.countDocuments({ status: 'completed' });
    const pendingTasksCount = await Task.countDocuments({ status: { $ne: 'completed' } });

    res.json({
      totalUsers: usersCount,
      totalTasks: tasksCount,
      completedTasks: completedTasksCount,
      pendingTasks: pendingTasksCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers, updateUserStatus, getDashboardStats }; 
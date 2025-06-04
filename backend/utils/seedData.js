require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const connectDB = require('../config/db');

// Connect to MongoDB
connectDB();

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    
    console.log('Previous data cleared');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    
    console.log('Admin user created');
    
    // Create regular users
    const userPassword = await bcrypt.hash('user123', 10);
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: userPassword,
        role: 'user'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: userPassword,
        role: 'user'
      }
    ]);
    
    console.log('Regular users created');
    
    // Create tasks
    const tasks = [];
    
    // Create 20 dummy tasks
    for (let i = 1; i <= 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomStatus = ['pending', 'in-progress', 'completed'][Math.floor(Math.random() * 3)];
      
      tasks.push({
        title: `Task ${i}`,
        description: `This is a description for task ${i}. It contains some details about what needs to be done.`,
        status: randomStatus,
        assignedTo: randomUser._id,
        createdBy: admin._id,
        dueDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date within next 30 days
      });
    }
    
    await Task.insertMany(tasks);
    
    console.log('Tasks created');
    console.log('Seed data completed successfully!');
    
    console.log('\nUser Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: john@example.com / user123');
    console.log('User: jane@example.com / user123');
    console.log('User: mike@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 
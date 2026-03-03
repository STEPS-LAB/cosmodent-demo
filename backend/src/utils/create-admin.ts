import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from './config';
import { Admin } from './models/Admin';

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const uri = config.mongodb.uri.replace('localhost', '127.0.0.1');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@cosmodent.ua' });
    
    if (existingAdmin) {
      console.log('Admin already exists, updating password...');
      existingAdmin.password = 'Admin123!';
      await existingAdmin.save();
      console.log('Admin password updated to: Admin123!');
    } else {
      console.log('Creating admin user...');
      const admin = await Admin.create({
        email: 'admin@cosmodent.ua',
        password: 'Admin123!',
        name: 'Адміністратор',
        role: 'super-admin',
        isActive: true,
      });
      console.log('Admin created successfully!');
      console.log('Email: admin@cosmodent.ua');
      console.log('Password: Admin123!');
    }

    await mongoose.connection.close();
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();

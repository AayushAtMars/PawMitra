import dotenv from 'dotenv';

// Load environment variables before anything else
dotenv.config();

console.log('Environment variables loaded');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED');

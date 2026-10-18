import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { connectDB } from './config/db.js';

const port = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(port, () => console.log(`AgriTech API listening on port ${port}`)))
  .catch((error) => {
    console.error('Could not start API:', error.message);
    process.exit(1);
  });

import { config } from 'dotenv';
config();  // Load environment variables from .env file

import express, { Request, Response } from 'express';
import routes from './routes/index';
import db from './config/connection'; 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  })
  .catch((error: Error) => {
    console.error("Error starting the server:", error);
    process.exit(1);
  });

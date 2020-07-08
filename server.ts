import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
import './config/db';

// Route files
import users from './router/users';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Pass socket to req
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.io = io;
    next();
  }
);

//  Cors middlware
app.use(cors());

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve Static React
app.use(express.static(path.join(__dirname, './frontend/build')));

// Mount routers
app.use('/api/v1/users', users);

// Catch all back to React Router
app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

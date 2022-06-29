import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import router from './routes';

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/', router);

server.listen(port, () => console.info(`Listening on port ${port}...`));

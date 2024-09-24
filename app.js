import { env } from './config/env.js';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import error from './middlewares/error.js';
import { swaggerSpec, swaggerUi } from './config/swagger.js';
import path from 'path';

import { fileURLToPath } from 'url';
// Get the file path of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = path.dirname(__filename);

const app= express();

// app.get('/favicon.ico', (req, res) => res.status(204));
if (env("NODE_ENV") !== 'production') {
  app.use(morgan('dev'));
}
app.use('/api-docs', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));
// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helmet());

// parse json request body
app.use(bodyParser.json());

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
// app.options('*', cors);

// v1 api routes
app.use('/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);


export default app;


import express from 'express';
import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
import { env } from '../config/env.js';

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
      status: 'ok',
      processEnv: env("NODE_ENV") || 'not set',
      CURRENT_PROJECT: env("CURRENT_PROJECT"),
      nodeVersion: process?.versions?.node
    });
});


router.use('/auth', authRoute); //add routes
router.use('/users', userRoute)

export default router;

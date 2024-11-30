import express from 'express';
import {userRouter} from './userRoutes.js';
import {thoughtRouter} from './thoughtRoutes.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/thoughts', thoughtRouter);

export default router;

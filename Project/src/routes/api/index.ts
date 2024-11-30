import express from 'express';
import {userRouter} from './userRoutes';
import {thoughtRouter} from './thoughtRoutes';

const router = express.Router();

router.use('/users', userRouter);
router.use('/thoughts', thoughtRouter);

export default router;

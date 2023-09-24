import express from 'express';
import {
  // check,
  checkToken,
  userDelete,
  users,
  userPost,
  userById,
  userDeleteAdmin,
  userUpdateAdmin,
  userUpdate,
} from '../controllers/userController';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.route('').post(userPost)
.get(users)
.put(authenticate, userUpdate)
.delete(authenticate, userDelete);

router.get('/token', authenticate, checkToken);

router.route('/check').get(checkToken);

router.route('/:id').get(userById).put(authenticate, userUpdateAdmin).delete(authenticate, userDeleteAdmin);

export default router;

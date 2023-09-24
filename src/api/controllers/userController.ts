import jwt from 'jsonwebtoken';
// Description: This file contains the functions for the user routes
// TODO: add function check, to check if the server is alive
// TODO: add function to get all users
// TODO: add function to get a user by id
// TODO: add function to create a user
// TODO: add function to update a user
// TODO: add function to delete a user
// TODO: add function to check if a token is valid

import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {
  OutputUser,
  TokenMessageResponse,
  TokenUser,
  User,
  inputUser,
} from '../../interfaces/User';
import {validationResult} from 'express-validator';
import userModel from '../models/userModel';
import bcrypt from 'bcrypt';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import UserQuery from '../../interfaces/UserQuery';
import RegisterMessageResponse from '../../interfaces/RegisterMessageResponse';

const userPost = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }

    const user = req.body;
    user.role = 'user';

    const a = await bcrypt.hash(user.password, 12);

    user.password = a;

    console.log(user);

    const newUser = await userModel.create(user);

    console.log(newUser);


    const response: RegisterMessageResponse = {
      message: 'User created',
      user: {
        user_name: newUser.user_name,
        email: newUser.email,
        id: newUser._id,
      },
    };

    res.json(response);
  } catch (error) {
    next(new CustomError('User creation failed: ' + error, 500));
  }
};

const users = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find();
    if (users.length === 0) {
      return next(new CustomError('Users not found', 404));
    }
    res.json(users).status(200);
  } catch (error) {
    next(new CustomError('Users not found', 500));
  }
};

const userById = async (
  req: Request<UserQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (!user) {
      return next(new CustomError('User not found', 404));
    }
    res.json(user).status(200);
  } catch (error) {
    res.json(new CustomError('User not found', 500));
  }
};

const userUpdate = async (
  req: Request<{}, {}, inputUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    const userFromToken = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as TokenUser;

    const id = userFromToken.id;
    const user = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(id, user, {
      new: true,
    });

    if (!updatedUser) {
      return next(new CustomError('User not found', 404));
    }

    const response: TokenMessageResponse = {
      message: 'User updated',
      user: {
        user_name: updatedUser.user_name,
        email: updatedUser.email,
        id: updatedUser._id,
      },
      token: token as string,
    };

    res.json(response).status(200);
  } catch (error) {
    next(new CustomError('User update failed', 500));
  }
};

const checkToken = async (
  req: Request<{}, {}, string>,
  res: Response,
  next: NextFunction
) => {
  try {
    req.headers.authorization?.split(' ')[1];
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      next(new CustomError('No token provided', 401));
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
      if (!err) {
        return res.json({valid: true}).status(200);
      }
    });
  } catch (error) {
    next(new CustomError('Invalid token', 401));
  }
};
const userUpdateAdmin = async (
  req: Request<UserQuery, {}, inputUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user = req.body;

    console.log(id);
    console.log(user);

    const updatedUser = await userModel.findByIdAndUpdate(id, user, {
      new: true,
    });

    if (!updatedUser) {
      return next(new CustomError('User not found', 404));
    }

    const response: TokenMessageResponse = {
      message: 'User updated',
      user: {
        user_name: updatedUser.user_name,
        email: updatedUser.email,
        id: updatedUser._id,
      },
      token: ''
    };

    res.json(response).status(200);
  } catch (error) {
    next(new CustomError('User update failed', 500));
  }
};
const userDeleteAdmin = async (
  req: Request<UserQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return next(new CustomError('User not found', 404));
    }

    const response: TokenMessageResponse = {
      message: 'User deleted',
      user: {
        user_name: deletedUser.user_name,
        email: deletedUser.email,
        id: deletedUser._id,
      },
      token: '',
    };

    res.json(response).status(200);
  } catch (error) {
    next(new CustomError('User delete failed', 500));
  }
};

const userDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    const userFromToken = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as TokenUser;

    const deletedUser = await userModel.findByIdAndDelete(userFromToken.id);

    if (!deletedUser) {
      return next(new CustomError('User not found', 404));
    }

    const response: TokenMessageResponse = {
      message: 'User deleted',
      user: {
        user_name: deletedUser.user_name,
        email: deletedUser.email,
        id: deletedUser._id,
      },
      token: token as string,
    };

    res.json(response).status(200);
  } catch (error) {
    next(new CustomError('User delete failed', 500));
  }
};

export {
  userPost,
  users,
  userById,
  userUpdate,
  userDelete,
  checkToken,
  userUpdateAdmin,
  userDeleteAdmin,
};

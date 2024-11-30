import { Request, Response } from 'express';
import Thought from '../models/Thought.js';
import User from '../models/User.js';


// get users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get a single user by ID
export const getUserById = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.userId).populate('friends thoughts');
    if (!user) {
      return res.status(404).json({ message: 'No user found with this ID' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// update user by ID
export const updateUser = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this ID' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete user by ID
export const deleteUser = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'No user found with this ID' });
    }

    // delete all thoughts with user
    const deletedThoughts = await Thought.deleteMany({ userId: user._id });
    
    if (deletedThoughts.deletedCount === 0) {
      return res.status(404).json({ message: 'User found, but no associated thoughts to delete' });
    }

    res.status(200).json({
      message: 'User and associated thoughts deleted',
      deletedUser: user,
      deletedThoughtsCount: deletedThoughts.deletedCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user and thoughts', error: err });
  }
};

// add a friend to a users friend list
export const addFriend = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'No user found with this ID' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// remove a friend from a user's friend list
export const removeFriend = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'No user found with this ID' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

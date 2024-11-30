import { Request, Response } from 'express';
import Thought from '../models/Thought.js';
import User from '../models/User.js';


// gets thoughts
export const getAllThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
};

// gets thought by ID
export const getThoughtById = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const thought = await Thought.findById(req.params.thoughtId).populate('reactions');
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this ID' });
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// create new thought
export const createThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thought._id } });
    res.status(201).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// update thought by ID
export const updateThought = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    // Ensure the 'text' field is included in the request body
    if (!req.body.text) {
      return res.status(400).json({ message: 'Text is required for update' });
    }

    // update thought by ID
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { text: req.body.text },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'No thought found with this ID' });
    }

    res.status(200).json(updatedThought);
  } catch (err) {
    res.status(500).json({ message: 'Error updating thought', error: err });
  }
};

// delete a thought by ID
export const deleteThought = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this ID' });
    }
    await User.findByIdAndUpdate(thought.userID, { $pull: { thoughts: thought._id } });
    res.status(200).json({ message: 'Thought deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
};

// create a reaction to a thought
export const createReaction = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this ID' });
    }
    thought.reactions.push(req.body);
    await thought.save();
    res.status(201).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete a reaction
export const deleteReaction = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this ID' });
    }
    const reactionIndex = thought.reactions.findIndex(
      (reaction) => reaction.reactionId.toString() === req.params.reactionId
    );
    if (reactionIndex === -1) {
      return res.status(404).json({ message: 'No reaction found with this ID' });
    }
    thought.reactions.splice(reactionIndex, 1);
    await thought.save();
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};


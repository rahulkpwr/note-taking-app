import { Request, Response } from 'express';
import { Note } from '../models/Note';

interface AuthRequest extends Request {
  user?: any;
}

// Create a new note
export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = new Note({
      title,
      content,
      userId
    });

    await note.save();

    res.status(201).json({
      message: 'Note created successfully',
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all notes for the authenticated user
export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    res.json({
      notes: notes.map(note => ({
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single note by ID
export const getNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a note
export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { title, content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      message: 'Note updated successfully',
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a note
export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 
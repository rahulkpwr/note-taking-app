import { Router } from 'express';
import { 
  createNote, 
  getNotes, 
  getNote, 
  updateNote, 
  deleteNote 
} from '../controllers/notesController';
import { auth } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(auth as any);

// CRUD operations
router.post('/', createNote as any);
router.get('/', getNotes as any);
router.get('/:id', getNote as any);
router.put('/:id', updateNote as any);
router.delete('/:id', deleteNote as any);

export default router; 
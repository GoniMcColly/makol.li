import express from 'express';

const router = express.Router();
import {notesController} from '../controller/notes-controller.js';

router.get('/', notesController.index.bind(notesController));
router.get('/:name', notesController.index.bind(notesController));

export const notesRoutes = router;
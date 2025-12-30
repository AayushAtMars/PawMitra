import express from 'express';
import multer from 'multer';
import { sendMessage, transcribeAudio } from '../controllers/chatController.js';

const router = express.Router();

// Configure multer for memory storage to access buffer directly
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/text', sendMessage);
router.post('/audio', upload.single('audio'), transcribeAudio);

export default router;

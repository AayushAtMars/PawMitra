import geminiService from '../services/openaiService.js'; // Renaming import to minimize changes, or better:
import openAIService from '../services/openaiService.js';

export const sendMessage = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await openAIService.chat(message, history || []);
        res.json({ response });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
};

export const transcribeAudio = async (req, res) => {
    try {
        if (!req.file) {
            // Check if file is missing because of upload error or not sent
            console.log('No file in request:', req.headers['content-type']);
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        const audioBuffer = req.file.buffer;
        const mimeType = req.file.mimetype; // e.g., 'audio/m4a', 'audio/mp3'

        // console.log('Transcribing audio:', mimeType, audioBuffer.length);
        const transcription = await openAIService.transcribeAudio(audioBuffer, mimeType);
        res.json({ text: transcription });
    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
};

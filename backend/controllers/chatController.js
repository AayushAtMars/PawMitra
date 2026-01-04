import openAIService from '../services/openaiService.js';


export const sendMessage = async (req, res) => {
    try {
        const { message, history, location } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        let contextMessage = message;

        // If location provided and user asks for services/doctors, fetch and append context
        // (Removed as per revert request)


        const response = await openAIService.chat(contextMessage, history || []);
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

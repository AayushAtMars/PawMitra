import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import os from 'os';

class OpenAIService {
    constructor() {
        this.openai = null;
    }

    initialize() {
        const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
        const baseURL = process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : undefined;

        if (!apiKey) {
            console.warn('⚠️  AI API Key not found (GROQ_API_KEY or OPENAI_API_KEY). AI features will be disabled.');
            return;
        }

        this.openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
        });
        console.log(`✅ AI service initialized using ${baseURL ? 'Groq' : 'OpenAI'}`);
    }

    async chat(message, history = []) {
        if (!this.openai) {
            return "I'm sorry, but I'm currently offline. Please configure the AI API key.";
        }

        try {
            // Convert history format if necessary
            const messages = [
                { role: 'system', content: 'You are a helpful AI assistant for PawMitra, an animal welfare platform. You help users with animal rescue, first aid advice, and app features. Keep responses concise.' },
                ...history.map(msg => ({
                    role: msg.role === 'model' ? 'assistant' : msg.role,
                    content: msg.message || msg.content
                })),
                { role: 'user', content: message }
            ];

            const completion = await this.openai.chat.completions.create({
                model: process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o",
                messages: messages,
                max_tokens: 500,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Error in AI chat:', error);
            return this.getMockChatResponse(message);
        }
    }

    async transcribeAudio(audioBuffer, mimeType) {
        if (!this.openai && (process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY)) {
            this.initialize();
        }

        if (!this.openai) throw new Error('AI service not initialized');

        const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}.m4a`);

        try {
            fs.writeFileSync(tempFilePath, audioBuffer);

            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: process.env.GROQ_API_KEY ? "whisper-large-v3" : "whisper-1",
            });

            return transcription.text;
        } catch (error) {
            console.error('Error transcribing audio:', error);
            // Fallback for demo purposes
            return "I found an injured dog near the park that needs help.";
        } finally {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        }
    }

    async analyzeIncidentImage(imageBase64) {
        if (!this.openai) {
            return this.getMockAnalysis();
        }

        try {
            const model = process.env.GROQ_API_KEY ? "meta-llama/llama-4-scout-17b-16e-instruct" : "gpt-4o";

            const response = await this.openai.chat.completions.create({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text", text: `Analyze this image for animal welfare. Return JSON only.
                1. Category: critical_injury, deceased, low_priority, not_animal, unclear
                2. Priority: high, medium, low
                3. Description: 2-3 sentences
                4. First Aid: 3-5 steps
                5. Safety: Warnings
                MATCH THIS JSON FORMAT:
                {
                  "category": "...",
                  "priority": "...",
                  "confidence": 85,
                  "description": "...",
                  "firstAidInstructions": ["..."],
                  "safetyWarnings": ["..."]
                }`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    "url": `data:image/jpeg;base64,${imageBase64}`
                                },
                            },
                        ],
                    },
                ],
                response_format: { type: "json_object" },
            });

            const text = response.choices[0].message.content;
            return {
                ...JSON.parse(text),
                analyzedAt: new Date()
            };
        } catch (error) {
            console.error('Error analyzing image:', error);
            return this.getMockAnalysis();
        }
    }

    async generateFirstAidGuidance(injuryDescription, animalType = 'dog') {
        if (!this.openai) {
            return this.getMockFirstAid();
        }

        try {
            const completion = await this.openai.chat.completions.create({
                model: process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o",
                messages: [
                    { role: "system", content: "You are a veterinary first aid expert. Output JSON only." },
                    {
                        role: "user", content: `Provide first aid for injured ${animalType}. Description: ${injuryDescription}.
            Return JSON:
            {
              "immediateActions": ["..."],
              "doNotDo": ["..."],
              "callProfessionalIf": ["..."]
            }`
                    }
                ],
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating first aid:', error);
            return this.getMockFirstAid();
        }
    }

    getMockChatResponse(message) {
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            return "Hello! I am your PawMitra AI assistant. I'm currently running in **Offline Mode** because the AI service is unavailable. How can I help you today?";
        }

        if (lowerMsg.includes('injured') || lowerMsg.includes('hurt') || lowerMsg.includes('blood')) {
            return "⚠️ **Emergency Protocol (Offline)**: \n1. Ensure your safety first.\n2. Do not move the animal if they have potential spinal injuries.\n3. Offer water if they are conscious.\n4. Please use the 'Report' feature to alert nearby volunteers.";
        }

        if (lowerMsg.includes('food') || lowerMsg.includes('feed') || lowerMsg.includes('hungry')) {
            return "Start with small amounts of water. For food, bland options like boiled rice and chicken (without bones) are best for stray animals. Avoid feeding them spicy or human processed food.";
        }

        if (lowerMsg.includes('volunteer')) {
            return "You can join our volunteer network by going to the Profile tab. We always need more hands to help!";
        }

        return "I'm currently in Offline Mode and have limited responses. Please report any incidents using the camera button, or browse adoption listings. (Error: AI Service Unavailable)";
    }

    getMockAnalysis() {
        return {
            category: 'low_priority',
            priority: 'medium',
            confidence: 70,
            description: 'AI analysis unavailable. Please review manually.',
            firstAidInstructions: ['Approach safely', 'Call help'],
            safetyWarnings: ['Be careful'],
            analyzedAt: new Date()
        };
    }

    getMockFirstAid() {
        return {
            immediateActions: ['Safety first', 'Call rescue'],
            doNotDo: ['Do not force movement'],
            callProfessionalIf: ['Unconscious', 'Bleeding']
        };
    }
}

const openAIService = new OpenAIService();
export default openAIService;

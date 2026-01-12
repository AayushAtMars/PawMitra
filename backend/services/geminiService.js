import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.chatSession = null;
  }

  initialize() {
    console.log('🔧 Initializing Gemini service...');
    console.log('🔑 GEMINI_API_KEY present:', process.env.GEMINI_API_KEY ? 'YES (length: ' + process.env.GEMINI_API_KEY.length + ')' : 'NO');
    
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY not found. AI features will be disabled.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Use gemini-1.5-flash for better availability and speed
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('✅ Gemini AI service initialized (gemini-1.5-flash)');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini:', error.message);
    }
  }

  async chat(message, history = []) {
    if (!this.model) {
      return "I'm sorry, but I'm currently offline. Please try again later.";
    }

    try {
      // Initialize chat session if needed or with provided history
      // Note: For a stateless REST API, we typically recreate the chat session with history for each request
      // unless we store state in the service (which is single instance). 
      // Better to start fresh with history for each request to handle multiple users.
      const chat = this.model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.message }]
        })),
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in Gemini chat:', error);
      return "I'm having trouble understanding right now. Please try again.";
    }
  }

  async transcribeAudio(audioBuffer, mimeType) {
    if (!this.model) {
      throw new Error('Gemini service not initialized');
    }

    try {
      const prompt = "Transcribe the following audio exactly as spoken. Return only the transcription text.";

      const audioPart = {
        inlineData: {
          data: audioBuffer.toString('base64'),
          mimeType: mimeType
        }
      };

      const result = await this.model.generateContent([prompt, audioPart]);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error transcribing audio with Gemini:', error);
      throw new Error('Failed to transcribe audio');

    }
  }

  async analyzeIncidentImage(imageBase64) {
    console.log('🔍 analyzeIncidentImage called');
    console.log('🔍 Model initialized:', this.model ? 'YES' : 'NO');
    
    if (!this.model) {
      console.log('⚠️ Model not initialized, returning mock analysis');
      return this.getMockAnalysis();
    }

    try {
      const prompt = `You are an AI assistant for an animal welfare platform. Analyze this image and provide:

1. Category: Classify the image into one of these categories:
   - critical_injury: Animal with severe injuries requiring immediate medical attention
   - deceased: Dead animal that needs to be removed
   - low_priority: Minor issues like skin infection, hunger, or stray animal
   - not_animal: Image doesn't contain an animal
   - unclear: Cannot determine from the image

2. Priority: Based on the category, assign priority (high, medium, low)

3. Description: Brief description of what you see (2-3 sentences)

4. First Aid Instructions: If it's an injury case, provide 3-5 simple first aid steps that a citizen can safely perform while waiting for professional help. Include safety warnings.

5. Safety Warnings: List any safety precautions the person should take (e.g., risk of bites, infections, etc.)

Respond in JSON format:
{
  "category": "critical_injury|deceased|low_priority|not_animal|unclear",
  "priority": "high|medium|low",
  "confidence": 85,
  "description": "Description here",
  "firstAidInstructions": ["Step 1", "Step 2", ...],
  "safetyWarnings": ["Warning 1", "Warning 2", ...]
}`;

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      let text = response.text();

      // Clean markdown code blocks
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      // Extract JSON from response if still mixed with text
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        text = text.substring(jsonStart, jsonEnd + 1);
        try {
          const analysis = JSON.parse(text);
          return {
            ...analysis,
            analyzedAt: new Date()
          };
        } catch (e) {
          console.error("JSON parse error", e);
          // Fallthrough to mock
        }
      }

      return this.getMockAnalysis();
    } catch (error) {
      console.error('❌ Error analyzing image with Gemini:');
      console.error('   Error name:', error.name);
      console.error('   Error message:', error.message);
      if (error.response) {
        console.error('   API Response error:', error.response);
      }
      return this.getMockAnalysis();
    }
  }

  async generateFirstAidGuidance(injuryDescription, animalType = 'dog') {
    if (!this.model) {
      return this.getMockFirstAid();
    }

    try {
      const prompt = `You are a veterinary first aid expert. Provide step-by-step first aid guidance for a citizen who found an injured ${animalType}.

Injury description: ${injuryDescription}

Provide:
1. Immediate actions (3-5 steps)
2. What NOT to do (safety warnings)
3. When to call professional help immediately

Keep instructions simple, clear, and safe for untrained individuals. Focus on stabilizing the animal until professional help arrives.

Respond in JSON format:
{
  "immediateActions": ["Step 1", "Step 2", ...],
  "doNotDo": ["Don't do this", "Avoid that", ...],
  "callProfessionalIf": ["Condition 1", "Condition 2", ...]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean markdown code blocks
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        text = text.substring(jsonStart, jsonEnd + 1);
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("JSON parse error", e);
        }
      }

      return this.getMockFirstAid();
    } catch (error) {
      console.error('Error generating first aid guidance:', error);
      return this.getMockFirstAid();
    }
  }

  getMockAnalysis() {
    return {
      category: 'low_priority',
      priority: 'medium',
      confidence: 70,
      description: 'AI analysis unavailable. Please review manually.',
      firstAidInstructions: [
        'Approach the animal slowly and calmly',
        'Do not make sudden movements',
        'Keep a safe distance if the animal appears aggressive',
        'Contact local animal welfare organization'
      ],
      safetyWarnings: [
        'Injured animals may bite when scared or in pain',
        'Wear gloves if available',
        'Do not attempt to move the animal unless absolutely necessary'
      ],
      analyzedAt: new Date()
    };
  }

  getMockFirstAid() {
    return {
      immediateActions: [
        'Ensure your own safety first',
        'Approach the animal calmly and slowly',
        'If safe, provide water in a shallow container',
        'Keep the animal warm with a blanket if available',
        'Contact animal rescue services immediately'
      ],
      doNotDo: [
        'Do not force the animal to move',
        'Do not give food or medication without professional advice',
        'Do not attempt to treat severe wounds yourself'
      ],
      callProfessionalIf: [
        'Animal is unconscious or unresponsive',
        'Severe bleeding that won\'t stop',
        'Broken bones or inability to move',
        'Difficulty breathing'
      ]
    };
  }
}

// Create singleton instance
const geminiService = new GeminiService();

export default geminiService;

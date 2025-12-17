import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  initialize() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY not found. AI features will be disabled.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini AI service initialized');
  }

  async analyzeIncidentImage(imageBase64) {
    if (!this.model) {
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
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          ...analysis,
          analyzedAt: new Date()
        };
      }
      
      return this.getMockAnalysis();
    } catch (error) {
      console.error('Error analyzing image with Gemini:', error);
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
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
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

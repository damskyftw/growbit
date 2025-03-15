/**
 * AI Task Verification Module
 * 
 * This module provides functions to verify user-submitted evidence for task completion 
 * using OpenAI's API. The AI will evaluate the evidence and determine if the task 
 * has been completed successfully.
 */

const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Verifies task completion evidence using AI
 * @param {string} taskDescription - The description of the task to verify
 * @param {string} evidence - The user-submitted evidence for task completion
 * @returns {Promise<Object>} - The verification result
 */
async function verifyTaskEvidence(taskDescription, evidence) {
  try {
    const prompt = `
      You are an AI assistant tasked with verifying if a user has completed a personal growth task.
      
      Task Description: "${taskDescription}"
      
      User's Completion Evidence: "${evidence}"
      
      Based on the task description and the user's evidence, determine if the task appears to be completed.
      
      Evaluate the evidence critically, considering:
      1. Does it demonstrate the key requirements of the task?
      2. Does it appear authentic and sincere?
      3. Is it specific enough to reasonably conclude task completion?
      
      Provide your verification in the following format:
      {
        "verified": true/false,
        "confidence": (a number between 0 and 1),
        "feedback": "Your reasoning and any feedback for the user"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a critical but fair AI verification assistant. Your job is to verify if a user has completed a task based on evidence they provide. Be diligent but not overly harsh."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);

    // Add timestamp for audit trail
    result.verifiedAt = new Date().toISOString();
    
    return result;
  } catch (error) {
    console.error('Error verifying task evidence:', error);
    throw new Error('Failed to verify task evidence');
  }
}

module.exports = { verifyTaskEvidence }; 
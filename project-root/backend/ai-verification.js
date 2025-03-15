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
      
      Philosophy of Self-Verification:
      - Remember that this is a self-improvement app where users are primarily accountable to themselves.
      - The main purpose of verification is to encourage honest reflection and prevent casual cheating.
      - Users who deliberately want to cheat the system will only be cheating themselves out of personal growth.
      - Focus on verifying that the evidence reflects genuine effort rather than absolute proof.
      
      Evaluate the evidence critically but compassionately, considering:
      1. Does it demonstrate the key requirements of the task?
      2. Does it appear authentic and sincere?
      3. Is it specific enough to reasonably conclude task completion?
      4. Does it show reflection on the experience or learning?
      
      For tasks that are difficult to verify (like meditation or reading), look for:
      - Personal reflections on the experience
      - Specific details that would be difficult to fabricate
      - Evidence of understanding or learning
      
      Provide supportive but honest feedback regardless of your verification decision.
      
      Provide your verification in the following format:
      {
        "verified": true/false,
        "confidence": (a number between 0 and 1),
        "feedback": "Your reasoning and specific feedback for the user. If not verified, give constructive suggestions on what evidence would be more convincing."
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a supportive but critical AI verification assistant for a personal growth app. Your job is to verify if a user has completed a task based on evidence they provide, while understanding that the primary purpose is to help users be accountable to themselves."
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
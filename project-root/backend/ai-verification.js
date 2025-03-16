/**
 * AI Task Verification Module
 * 
 * This module provides functions to verify user-submitted evidence for task completion 
 * using OpenAI's API. The AI will evaluate the evidence and determine if the task 
 * has been completed successfully.
 */

const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Verify task evidence using AI
 * 
 * @param {string} taskDescription - The description of the task to verify
 * @param {string} evidence - The evidence provided by the user (text or image URL/base64)
 * @returns {Object} Verification result
 */
async function verifyTaskEvidence(taskDescription, evidence) {
  try {
    // Determine if the evidence is an image (base64 or URL)
    const isImage = evidence.startsWith('data:image') || 
                    evidence.startsWith('http') && 
                    (evidence.endsWith('.png') || 
                     evidence.endsWith('.jpg') || 
                     evidence.endsWith('.jpeg') ||
                     evidence.includes('imgur') || 
                     evidence.includes('ibb.co'));
    
    let messages = [];
    
    // For Twitter-related tasks, use a more specific system prompt for image analysis
    if (taskDescription.toLowerCase().includes('tweet') || 
        taskDescription.toLowerCase().includes('twitter')) {
      
      if (isImage) {
        messages = [
          {
            role: "system",
            content: `You are an AI trained to verify the authenticity of Twitter posts based on screenshots. 
                     Your task is to determine if a given screenshot shows an authentic tweet as evidence for completing the task: "${taskDescription}".
                     
                     Analyze the screenshot for:
                     1. Twitter UI elements (header, profile picture, tweet formatting)
                     2. Username and handle
                     3. Tweet content related to web3 or blockchain
                     4. Timestamp
                     5. Engagement metrics (likes, retweets)
                     
                     Respond with:
                     - Whether this is a valid Twitter screenshot (yes/no)
                     - The Twitter username shown
                     - A summary of the tweet content
                     - Whether it meets the requirements of the task
                     - Confidence level (1-10) and justification
                     
                     Your verification should be strict but fair. The screenshot must show a real tweet about web3 experiences, not a mockup or edited image.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Here is the screenshot evidence for the tweet. Please verify it:" },
              { type: "image_url", image_url: { url: evidence } }
            ]
          }
        ];
      } else {
        // Handle text evidence for Twitter tasks
        messages = [
          {
            role: "system",
            content: `You are an AI trained to verify the completion of Twitter-related tasks.
                     Your task is to determine if the provided evidence indicates completion of the task: "${taskDescription}".
                     
                     Look for:
                     1. Twitter URL or tweet ID
                     2. Description of tweet content
                     3. Details about what was shared
                     
                     Respond with whether this evidence is sufficient, and why it does or doesn't meet the requirements.`
          },
          {
            role: "user",
            content: `Here is my evidence for completing the Twitter task: ${evidence}`
          }
        ];
      }
    } else if (isImage) {
      // General image evidence verification
      messages = [
        {
          role: "system",
          content: `You are an AI trained to verify task completion evidence. You need to determine if the provided image evidence demonstrates completion of this task: "${taskDescription}".
                   
                   Analyze the image carefully and decide if it shows clear evidence of task completion. 
                   Consider what would constitute valid evidence for this specific task.
                   
                   Respond with:
                   1. Your verification decision (verified/not verified)
                   2. Detailed explanation of what you see in the image
                   3. How it relates to the task requirements
                   4. Any concerns about the validity of the evidence`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Here is my evidence for completing the task:" },
            { type: "image_url", image_url: { url: evidence } }
          ]
        }
      ];
    } else {
      // General text evidence verification
      messages = [
        {
          role: "system",
          content: `You are an AI trained to verify if evidence supports task completion. 
                   For this task: "${taskDescription}", determine if the provided evidence is sufficient proof.
                   
                   Consider:
                   - Does the evidence directly address the task requirements?
                   - Is it specific and detailed enough?
                   - Are there any inconsistencies or vague statements?
                   
                   Provide a verification decision (verified/not verified) with justification.`
        },
        {
          role: "user",
          content: `Here is my evidence for completing the task: ${evidence}`
        }
      ];
    }
    
    // Call OpenAI API for verification
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.2
    });
    
    const aiResponse = completion.choices[0].message.content;
    
    // Parse the response to determine verification result
    const lowerResponse = aiResponse.toLowerCase();
    const isVerified = (
      lowerResponse.includes('verified') || 
      lowerResponse.includes('valid evidence') || 
      lowerResponse.includes('sufficient evidence') ||
      (lowerResponse.includes('yes') && (
        lowerResponse.includes('valid twitter') || 
        lowerResponse.includes('authentic tweet')
      ))
    );
    
    // For debugging during development
    console.log('AI Verification for task:', taskDescription);
    console.log('Verification result:', isVerified);
    
    return {
      verified: isVerified,
      feedback: aiResponse,
      taskDescription,
      evidenceType: isImage ? 'image' : 'text'
    };
  } catch (error) {
    console.error('Error in AI verification:', error);
    throw error;
  }
}

module.exports = {
  verifyTaskEvidence
}; 
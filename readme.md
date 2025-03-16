# GrowBit: Agent-Powered Goal Achievement System

**DISCLAIMER:** This project was created for the ETHSF hackathon but wasn't completed within the official time constraints. It represents a work-in-progress with core functionalities implemented but some features still under development. The codebase is being shared for educational purposes and as a demonstration of the concept.

Welcome to GrowBit, a groundbreaking application built for the ETHSF hackathon that redefines personal growth through autonomous onchain intelligence. Using AgentKit by Coinbase, GrowBit empowers users to set personal growth goals in natural language, while an AI agent autonomously generates customized task sequences, verifies completion, distributes crypto micro-rewards, and adapts the plan based on user performance—all seamlessly integrated with blockchain technology. This project showcases the potential of AgentKit to abstract crypto complexities, facilitate agentic commerce, and push the limits of what autonomous agents can achieve.

## Project Vision

GrowBit is more than just a goal-tracking tool—it's an experiment in autonomous motivation. By combining advanced AI with AgentKit's blockchain capabilities, we've created an agent that acts as a personal coach, financial incentivizer, and adaptive strategist. Whether you're learning a new skill, improving your health, or tackling a passion project, GrowBit makes the journey engaging, rewarding, and effortless, with crypto micro-rewards delivered directly to your wallet.

## Features

- **Natural Language Goal Setting**: Describe your personal growth goals in your own words—no rigid forms required.
- **Autonomous Task Generation**: An AI agent crafts a tailored sequence of tasks to guide you toward your goal.
- **Task Verification**: Submit evidence of completion, and the agent verifies it using AI-driven analysis.
- **Crypto Micro-Rewards**: Earn small crypto rewards for every verified task, powered by AgentKit's seamless blockchain integration.
- **Adaptive Intelligence**: The agent learns from your performance, adjusting tasks to keep you challenged yet motivated.

## Why This is Innovative

GrowBit leverages AgentKit in a way that pushes the boundaries of autonomous agents and aligns with ETHSF's prize criteria:

- **Agentic Commerce Revolution**: The agent autonomously manages crypto reward distribution, creating a frictionless payment rail that motivates users without requiring them to understand blockchain mechanics.
- ** UX**: AgentKit abstracts all crypto complexities behind a natural language interface, making rewards feel intuitive and accessible to anyone, regardless of crypto expertise.
- **Crazy Experiment**: An autonomous agent that acts as a personal growth coach, verifies real-world task completion, and self-funds rewards via blockchain rails demonstrates a bold new paradigm for AI-driven motivation.

This isn't just useful—it's a wild, creative leap into what agents can do when given financial autonomy and a mission to inspire human growth.

## Getting Started

Follow these instructions to set up and run GrowBit locally.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- An OpenAI API key
- A wallet with Base Sepolia testnet ETH (for testing staking features)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/damskyftw/growbit.git
   cd growbit
   ```

2. Set up the backend:
   ```
   cd project-root/backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   PROVIDER_URL=https://sepolia.base.org
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up the frontend:
   ```
   cd ../../frontend-app
   npm install
   ```

5. Create a `.env.local` file in the frontend directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

### Running the Application

1. Start the backend server:
   ```
   cd project-root/backend
   node index.js
   ```

2. In a new terminal, start the frontend:
   ```
   cd frontend-app
   npm run dev -- -p 3001
   ```

3. Access the application at http://localhost:3001

### Demo Flow

1. Connect your wallet (works with any Ethereum wallet)
2. Create a goal using the "Create Twitter Task Demo" button
3. Complete the task (post a tweet about web3)
4. Submit evidence (screenshot of your tweet)
5. The AI will verify your evidence
6. If verified, you can claim your staked ETH (if you staked any)

### Pushing Changes to GitHub

If you make changes to the codebase and want to push them:

1. Stage your changes:
   ```
   git add .
   ```

2. Commit your changes:
   ```
   git commit -m "Your commit message"
   ```

3. Push to GitHub:
   ```
   git push origin main
   ```

## Known Issues

- The evidence submission currently only accepts text input. Image upload functionality is planned for a future update.
- The application requires a stable connection to the Base Sepolia testnet.


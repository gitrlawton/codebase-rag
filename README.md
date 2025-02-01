# AI Codebase Chat Assistant

## Overview

This project is a web-based platform that enables users to engage in conversations with an AI assistant about the contents of codebases. By integrating a backend API with a user-friendly frontend interface, the application streamlines the process of adding codebases, submitting queries, and soliciting context-specific insights from the AI.

## Features

- **Codebase Management**: Users can add codebases by providing links to their GitHub repos.
- **Chat Interface**: The application provides a chat interface where users can ask questions related to the selected codebases.
- **Contextual Responses**: The AI assistant responds based on the context of the selected codebases, providing detailed and relevant information.

## Installation

To set up the project, ensure you have Node.js and npm installed on your machine. Then, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the required packages:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add your API keys:

   ```plaintext
   GROQ_API_KEY=your_groq_api_key
   GITHUB_TOKEN=your_github_token
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your web browser and navigate to `http://localhost:3000`.

3. Use the Codebase Manager to add codebases by entering their GitHub URLs.

4. Select the codebases you want to query and interact with the AI assistant through the chat interface.

## File Descriptions

- **app/api/chat/route.js**: The server-side code handling chat requests and generating responses from the AI assistant.
- **app/api/codebases/route.js**: The server-side code managing the addition, retrieval, and deletion of codebases.
- **app/page.js**: The main entry point for the web application, rendering the home page and managing state.
- **components/CodebaseManager.jsx**: A React component for managing codebases, allowing users to add or remove them.
- **components/ChatInterface.jsx**: A React component for interacting with the AI assistant, displaying chat messages and input fields.
- **utils/ragUtils.js**: Utility functions for generating embeddings and fetching repository contents from GitHub.

## Dependencies

- **Next.js**: A React framework for building server-rendered applications.
- **React**: A JavaScript library for building user interfaces.
- **Groq SDK**: For interacting with the Groq API for AI responses.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.


const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Basic security headers
app.use(helmet());

app.use(cors());
app.use(express.json());

// Check for Gemini API Key
if (!process.env.GEMINI_API_KEY) {
    console.error('FATAL ERROR: GEMINI_API_KEY is not set.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory conversation history (for demonstration purposes)
const conversationHistory = {};

app.post('/api/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'userId is required.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Initialize history for new users
        if (!conversationHistory[userId]) {
            conversationHistory[userId] = [];
        }

        const history = conversationHistory[userId];

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessageStream(message);

        // Update history
        history.push({ role: "user", parts: [{ text: message }] });
        
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let fullResponse = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(`data: ${JSON.stringify({ response: chunkText })}\n\n`);
            fullResponse += chunkText;
        }
        
        history.push({ role: "model", parts: [{ text: fullResponse }] });

        res.end();

    } catch (error) {
        console.error('Error in /api/chat:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Recommend using HTTPS in production
// For example, with a self-signed certificate for development:
// const https = require('https');
// const fs = require('fs');
// const options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// };
// https.createServer(options, app).listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// TODO: Add tests for the API endpoints.

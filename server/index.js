
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    console.log("Received a request to /api/chat");
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    console.log("Sending request to Gemini API...");
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    console.log("Received response from Gemini API.");

    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

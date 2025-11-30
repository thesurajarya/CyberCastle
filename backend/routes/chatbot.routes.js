const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message required" });
  if (message.length > 500) return res.status(400).json({ error: "Message too long" });

  try {
    // Make request to Gemini
    const response = await genAI.chat.completions.create({
      model: "chat-bison-001",
      messages: [
        { role: "system", content: "You are a cybersecurity expert AI assistant." },
        { role: "user", content: message }
      ]
    });

    // Gemini returns text in response.candidates[0].content
    const reply = response?.candidates?.[0]?.content || "⚠️ Could not get a reply.";
    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ reply: "⚠️ AI service is temporarily unavailable." });
  }
});

module.exports = router;

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ Backend protection (you asked about this earlier)
    if (!message || message.length > 500) {
      return res.status(400).json({ error: "Message too long" });
    }

    // ✅ TEMP reply (we will connect real AI next)
    const aiReply = `You asked about: ${message}`;

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "AI service failed" });
  }
};

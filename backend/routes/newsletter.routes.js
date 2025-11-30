const router = require("express").Router();
const Subscriber = require("../models/subscriber.model");

// ✅ SUBSCRIBE USER
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email });
    res.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Subscription failed" });
  }
});

module.exports = router;

const express = require("express");
const bodyParser = require("body-parser");
const { Telegraf } = require("telegraf");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const apiKey = "YOUR_API_KEY";

// Middleware for API key authentication
const authenticate = (req, res, next) => {
  const providedApiKey = req.headers.authorization;

  if (!providedApiKey || providedApiKey !== `Bearer ${process.env.API_KEY}`) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Invalid API key." });
  }

  next();
};

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Reset API endpoint with simple API key authentication
app.post("/send/message", authenticate, (req, res) => {
  const chatId = req.body.chatId;
  const message = req.body.message;

  if (message) {
    // Send the received message to the specified Telegram chat
    bot.telegram.sendMessage(chatId, message);
    res
      .status(200)
      .json({ success: true, message: "Message sent to Telegram." });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid request. Message is missing.",
    });
  }
});

// Start Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

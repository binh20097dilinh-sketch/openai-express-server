require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

// Kết nối OpenAI bằng API key trong .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API để Blynk hoặc ứng dụng khác gửi câu hỏi
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Missing question field" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini", // Hoặc model thực tế bạn đang dùng
      messages: [{ role: "user", content: question }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
});

// ĐÂY LÀ PHẦN QUAN TRỌNG: Xuất ứng dụng cho Vercel
// Vercel sẽ tự động lắng nghe và xử lý các yêu cầu
module.exports = app;
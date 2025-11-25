// Bước 1: Khai báo thư viện cần thiết
const express = require("express");
const OpenAI = require("openai");

// Vercel không cần dotenv vì API Key đã được cung cấp qua Environment Variables
// const dotenv = require("dotenv").config(); 
// HOẶC 
// require("dotenv").config(); 

// Bước 2: Khởi tạo ứng dụng Express
const app = express();
app.use(express.json()); // Cho phép ứng dụng xử lý JSON từ request body

// Bước 3: Khởi tạo OpenAI Client
// Client sẽ tự động tìm biến OPENAI_API_KEY trong môi trường Vercel
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

// Bước 4: Định nghĩa Endpoint API chính (/api/ask)
// Endpoint này được gọi từ ứng dụng Blynk của bạn
app.post("/ask", async (req, res) => {
    try {
        // Lấy câu hỏi từ body của request (từ Blynk gửi lên)
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Missing 'question' field in request body." });
        }

        // Gọi API của OpenAI
        const response = await client.chat.completions.create({
            model: "gpt-4-turbo", // Bạn có thể chọn model phù hợp (ví dụ: gpt-3.5-turbo)
            messages: [{ role: "user", content: question }],
        });

        // Trả về câu trả lời cho Blynk dưới dạng JSON
        // Blynk sẽ dùng JSON Path (.reply) để lấy nội dung này
        res.json({ reply: response.choices[0].message.content });

    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        // Trả về lỗi nếu có vấn đề xảy ra
        res.status(500).json({ error: "AI request failed due to server or API error." });
    }
});

// Bước 5: EXPORT ứng dụng Express cho Vercel
// Đây là bước BẮT BUỘC cho Serverless Functions (không dùng app.listen)
// Thêm route GET đơn giản này để kiểm tra tình trạng máy chủ
app.get("/", (req, res) => {
    res.json({ status: "API is running successfully!", endpoint: "/api/ask (POST)" });
});

module.exports = app;
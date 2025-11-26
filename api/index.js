// server.js (Node.js, express)
import express from "express";
import fetch from "node-fetch"; // or use OpenAI SDK
const app = express();
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { image_url, image_analysis, metadata } = req.body;
  // build prompt
  const prompt = `You are an agricultural assistant. Input:
image_analysis: "${image_analysis}"
metadata: ${JSON.stringify(metadata)}
Task: ... respond as JSON ...`;
  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // chọn model phù hợp, kiểm tra docs
        input: prompt,
        max_tokens: 500
      })
    });
    const data = await r.json();
    // parse data.output_text hoặc theo responses schema
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "server error"});
  }
});

app.listen(3000, ()=>console.log("listening 3000"));
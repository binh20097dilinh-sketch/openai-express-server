import OpenAI from "openai";
import axios from "axios";

const client = new OpenAI({ apiKey: process.env.OPENAI });
const TOKEN = process.env.BLYNK_TOKEN;

async function loop() {
  // Lấy câu hỏi từ Terminal (V0)
  const q = await axios.get(
    `https://blynk.cloud/external/api/get?token=${TOKEN}&V0`
  );

  if (!q.data) return; // chưa nhập gì thì bỏ qua

  // Gửi sang ChatGPT
  const ai = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: q.data }]
  });

  const reply = ai.choices[0].message.content;

  // Gửi câu trả lời lại vào Terminal (V0)
  await axios.get(
    `https://blynk.cloud/external/api/terminal?token=${TOKEN}&V0=${encodeURIComponent(
      reply + "\n"
    )}`
  );

  // Xóa input để không xử lý lại
  await axios.get(
    `https://blynk.cloud/external/api/update?token=${TOKEN}&V0=`
  );

  console.log("✅ Replied:", reply);
}

setInterval(loop, 1500); // quét mỗi 1.5s

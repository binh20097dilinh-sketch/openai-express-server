import OpenAI from "openai";
import axios from "axios";

const client = new OpenAI({ apiKey: process.env.OPENAI });
const TOKEN = process.env.BLYNK_TOKEN;

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const ai = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: message }]
    });

    const reply = ai.choices[0].message.content;

    await axios.get(
      `https://blynk.cloud/external/api/terminal?token=${TOKEN}&V0=${encodeURIComponent(
        reply + "\n"
      )}`
    );

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
}

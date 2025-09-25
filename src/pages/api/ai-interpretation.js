import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log("🔥 API route called:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { systemPrompt, userPrompt } = req.body;

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({ error: "Missing prompts" });
    }

    console.log("🔑 API Key present:", !!process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const interpretation = completion.choices[0].message.content;
    console.log("✅ OpenAI response received, length:", interpretation?.length);

    return res.status(200).json({
      success: true,
      interpretation,
    });
  } catch (error) {
    console.error("🚨 Full OpenAI API error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error type:", error.type);
    console.error("Error status:", error.status);

    if (error.code === "insufficient_quota") {
      return res.status(402).json({
        success: false,
        error: "Quota OpenAI insuffisant. Veuillez vérifier votre abonnement.",
      });
    }

    if (error.code === "invalid_api_key") {
      return res.status(401).json({
        success: false,
        error: "Clé API OpenAI invalide.",
      });
    }

    return res.status(500).json({
      success: false,
      error: `OpenAI Error: ${error.message} (Code: ${
        error.code || "unknown"
      })`,
    });
  }
}

// app.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

// Define a route
app.post("/bot", async (req, res) => {
  const question = req.query.question;
  const model = req.query.model;

  if (!question) return res.status(400).send("Please provide your question");

  if (!model) return res.status(400).send("Please provide your model input.");

  try {
    const chatResponse = await openai.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: model,
      stream: true,
    });

    for await (const chunk of chatResponse) {
      res.write(chunk.choices[0]?.delta?.content || "");
    }

    res.end();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

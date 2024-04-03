require("dotenv").config();
var express = require("express");
var router = express.Router();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const fs = require("fs");

async function transcribe() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("audio.mp3"),
    model: "whisper-1",
  });

  console.log(transcription.text);
  return transcription.text;
}

// router POST create an audio file from bytes
router.post("/audio", async function (req, res, next) {
  try {
    console.log("Creating audio file:", req.body.audio);
    const audio = req.body.audio;
    const audioBuffer = Buffer.from(audio, "base64");
    fs.writeFileSync("audio.mp3", audioBuffer);
    console.log("Audio file created");
    res.json({ message: "Audio file created" });
  } catch (error) {
    console.error("Error creating audio file:", error);
    res.status(500).json({ error: "Failed to create audio file" });
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage } = require("@langchain/core/messages");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.3,
  apiKey: process.env.GEMINI_API_KEY,
});

/* --------------------------------------------------
   UNSPLASH IMAGE FETCH (STRICT & DESTINATION SAFE)
-------------------------------------------------- */
async function getUnsplashImage({ destination, specificPlace, timeOfDay }) {
  const queries = [
    `${specificPlace} ${destination}`,
    `${destination} ${specificPlace}`,
    `${destination} ${timeOfDay}`,
    `${destination} sightseeing`,
    `${destination} tourism`,
    `${destination} city`
  ].filter(Boolean);

  for (let query of queries) {
    try {
      const res = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: {
            query,
            per_page: 1,
            orientation: "landscape",
          },
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      const img = res.data.results?.[0]?.urls?.regular;
      if (img) return img;
    } catch (err) {
      console.error("Unsplash error:", err.message);
    }
  }

  // ❌ No static image
  return null;
}

/* --------------------------------------------------
   GENERATE 2-DAY ITINERARY (DEST_NEXT)
-------------------------------------------------- */
router.post("/generate-itinerary", async (req, res) => {
  const destination = req.body?.destination;

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  const prompt = `
You are Veyora — a friendly Indian travel planner.

Create a simple, realistic 2-day itinerary for "${destination}".

RULES:
- EXACTLY 2 days
- Morning, Afternoon, Evening MUST be arrays
- Simple Indian English
- Real places

JSON ONLY:
{
  "title": "string",
  "days": [
    {
      "day": 1,
      "theme": "string",
      "morning": ["place or activity"],
      "afternoon": ["place or activity"],
      "evening": ["place or activity"],
      "fomo": "string",
      "safety": "string",
      "unexplored": "string"
    }
  ]
}
`;

  try {
    const response = await model.invoke([
      new HumanMessage({ content: prompt }),
    ]);

    const clean = response.content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    /* -------------------------------
       Attach Unsplash images
    ------------------------------- */
    for (let day of parsed.days) {
      day.images = {
        morning: await getUnsplashImage({
          destination,
          specificPlace: day.morning?.[0],
          timeOfDay: "morning",
        }),
        afternoon: await getUnsplashImage({
          destination,
          specificPlace: day.afternoon?.[0],
          timeOfDay: "afternoon",
        }),
        evening: await getUnsplashImage({
          destination,
          specificPlace: day.evening?.[0],
          timeOfDay: "evening",
        }),
      };
    }

    res.json(parsed);
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

module.exports = router;

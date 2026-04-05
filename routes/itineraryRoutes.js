const express = require("express");
const router = express.Router();
const Input = require("../models/Input");
const axios = require("axios");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage } = require("@langchain/core/messages");

/* ---------------- GEMINI MODEL ---------------- */

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.3,
  apiKey: process.env.GEMINI_API_KEY,
});

/* ---------------- PLACE TYPE DETECTION ---------------- */

function isNonLandmarkPlace(place = "") {
  const keywords = [
    "chai", "tea", "cafe", "bakery", "restaurant",
    "dhaba", "stall", "shop", "market",
    "breakfast", "lunch", "dinner",
    "bread", "snack", "food"
  ];

  return keywords.some(word =>
    place.toLowerCase().includes(word)
  );
}

/* ---------------- SMART UNSPLASH FETCH ---------------- */

async function getUnsplashImageSmart({
  destination,
  specificPlace,
  timeOfDay,
  regionHint = ""
}) {
  const generic = isNonLandmarkPlace(specificPlace);

  const queries = generic
    ? [
        `${destination} ${timeOfDay}`,
        `${destination} city view`,
        `${destination} landmarks`,
        `${destination} tourism`,
        `${regionHint} landscape`
      ]
    : [
        `${specificPlace} ${destination}`,
        `${destination} ${specificPlace}`,
        `${destination} landmarks`,
        `${destination} ${timeOfDay}`,
        `${regionHint} landscape`
      ];

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

      const image = res.data.results?.[0]?.urls?.regular;
      if (image) return image;
    } catch (err) {
      console.error("Unsplash error:", err.message);
    }
  }

  // ✅ FINAL SAFE DESTINATION-BASED FALLBACK
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(destination)}`;
}

/* ---------------- ITINERARY ROUTE ---------------- */

router.post("/final-itinerary", async (req, res) => {
  try {
    console.log("🟢 itinerary HIT");

    const trip = await Input.findOne().sort({ createdAt: -1 });
    if (!trip) {
      return res.status(404).json({ error: "No trip data found" });
    }

    /* --------- DAY CALCULATION --------- */

    const start = new Date(trip.fromDate);
    const end = new Date(trip.toDate);
    const totalDays =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    /* --------- GEMINI PROMPT --------- */

    const prompt = `
Create a ${totalDays}-day travel itinerary.

RETURN JSON ONLY:

{
  "tripOverview": {
    "destination": "${trip.destination}",
    "dates": "${trip.fromDate} to ${trip.toDate}",
    "totalDays": ${totalDays},
    "travelMode": "${trip.mode}"
  },
  "dayByDayItinerary": [
    {
      "dayNumber": 1,
      "dayTitle": "string",
      "morning": {
        "time": "string",
        "activities": ["string"],
        "speciality": "string",
        "image": "specific tourist place or activity"
      },
      "afternoon": {
        "time": "string",
        "activities": ["string"],
        "speciality": "string",
        "image": "specific tourist place or activity"
      },
      "evening": {
        "time": "string",
        "activities": ["string"],
        "speciality": "string",
        "image": "specific tourist place or activity"
      },
      "localTip": "string",
      "safetyNote": "string"
    }
  ]
}
`;

    const response = await model.invoke([
      new HumanMessage({ content: prompt }),
    ]);

    const clean = response.content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    /* --------- IMAGE ENRICHMENT --------- */

    for (let day of parsed.dayByDayItinerary) {
      day.morning.image = await getUnsplashImageSmart({
        destination: parsed.tripOverview.destination,
        specificPlace: day.morning.image,
        timeOfDay: "morning",
        regionHint: trip.destination
      });

      day.afternoon.image = await getUnsplashImageSmart({
        destination: parsed.tripOverview.destination,
        specificPlace: day.afternoon.image,
        timeOfDay: "afternoon",
        regionHint: trip.destination
      });

      day.evening.image = await getUnsplashImageSmart({
        destination: parsed.tripOverview.destination,
        specificPlace: day.evening.image,
        timeOfDay: "evening",
        regionHint: trip.destination
      });
    }

    res.json(parsed);

  } catch (err) {
    console.error("❌ Itinerary error:", err);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

module.exports = router;

const express = require("express");
const Input = require("../models/Input");
const auth=require("./auth");

const router = express.Router();

router.post("/input", auth,async (req, res) => {
  const {
    source,
    destination,
    fromDate,
    toDate,
    budget,
    travellers,
    mode,
    interests
  } = req.body;

  try {
    const input1 = await Input.create({
      source,
      destination,
      fromDate,
      toDate,
      budget,
      travellers,
      mode,
      interests,
      userId: req.userId
    });

    res.status(200).json(input1);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/latest',async(req,res)=>{
  try{
    const latestInput=await Input.findOne().sort({createdAt:-1});
    res.json(latestInput);
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
});


// ================= MY TRIPS =================
router.get("/my-trips", auth, async (req, res) => {
  try {
    const trips = await Input.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

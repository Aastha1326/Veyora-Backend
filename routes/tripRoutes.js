const express = require("express");
const Input = require("../models/Input");

const router = express.Router();

router.post("/input", async (req, res) => {
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
      interests
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

module.exports = router;

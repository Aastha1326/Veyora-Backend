const mongoose = require('mongoose');

const inputSchema= new mongoose.Schema(
    {
        source:{
            type:String,
            required:true
        },
        destination:{
            type:String,
            required:true
        },
        fromDate:{
            type:Date,
            required:true
        },
        toDate:{
            type:Date,
            required:true
        },
        budget:{
            type:Number,
            required:true
        },
        travellers:{
            type:Number,
            required:true
        },
        mode:{
            type:String,
            required:true
        },
        interests:{
            type:[String],
            required:true
        }


    },
    {
        timestamps: true
    }
);

const customCollectionName = "veyora_inputs";

module.exports = mongoose.model("Input", inputSchema, customCollectionName);


const Feature = require('../../models/Features');

const addFeatureImage = async(req,res)=>{
    try {
        const {image} = req.body;
        const newFeature = new Feature({ image });

        await newFeature.save();
        res.status(201).json({
            success: true,
            message: "Feature image added successfully",
            data: newFeature
        });
    } catch (error) {
        console.error("Error adding feature image:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" });
    }
}

const getFeatureImages = async(req,res)=>{
    try {
        const images= await Feature.find({});

        res.status(200).json({
            success: true,
            message: "Feature images fetched successfully",
            data: images    
        });
    } catch (error) {
        console.error("Error fetching feature images:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" });
    }
}

module.exports = {
    addFeatureImage,getFeatureImages};
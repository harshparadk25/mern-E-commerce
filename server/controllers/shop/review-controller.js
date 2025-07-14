const Review = require("../../models/Review");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

const addProductReview = async(req,res)=>{
    try {
        const {productId, userId,userName,reviewMessage,reviewValue} = req.body;
        const order = await Order.findOne({
            userId,
            "cartItems.productId": productId,
            orderStatus: "confirmed"
        })

        console.log("Order found:", order);

        if(!order){
            return res.status(400).json({ 
                success: false,
                message: "You can only review products from confirmed orders." });
        }

        const checkExistingReview = await Review.findOne({
            userId,
            productId
        });

        if(checkExistingReview){
            return res.status(400).json({ 
                success: false,
                message: "You have already reviewed this product." 
            });
        }

        const newReview = new Review({
            productId,userId,userName,reviewMessage,reviewValue
        })
        await newReview.save();

        const reviews = await Review.find({ productId });
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((acc, reviewItem) => acc + reviewItem.reviewValue, 0) / totalReviews;

        await Product.findByIdAndUpdate(productId, {
            averageRating});

            res.status(201).json({
                success: true,
                message: "Review added successfully",
                data: newReview,
            });

    } catch (error) {
        console.error("Error adding product review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getProductReviews = async(req,res)=>{
    try{
        const { productId} = req.params;
        const reviews = await Review.find({ productId });
        res.status(200).json({
            success: true,
            message: "Product reviews fetched successfully",
            data: reviews,
        });
    }catch (error) {
        console.error("Error fetching product reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports={getProductReviews, addProductReview};
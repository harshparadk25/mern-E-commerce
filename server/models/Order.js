

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId :String,
    cartId: String,
    cartItems:[
        {
            productId:String,
            title:String,
            image:String,
            price:String,
            salePrice:String,
            quantity:Number,
        },
    ],
    addressInfo :{
        addressId :String,
        address:String,
        city:String,
        pincode:String,
        phone:String,
        notes:String
    },
    orderStatus :String,
    paymentMethod:String,
    paymentStatus:String,
    totalAmount:String,
    orderDate: String,
    orderUpdateDate:String,
    paymentId:String,
    payerId:String,
});

module.exports = mongoose.model("Order",OrderSchema)
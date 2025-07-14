const paypal = require('../../helpers/paypal')
const Order = require('../../models/Order')
const Cart = require('../../models/Cart')
const Product = require('../../models/Product')

const createOrder = async(req,res)=>{
    try {
        
        const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
        intent:"sale",
        payer:{
            payment_method :'paypal'
        },
       redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions:[
        {
            item_list :{
                items:cartItems.map((item)=>({
                    name: item.title,
                    sku: item.productId,
                    price: item.price.toFixed(2),
                    currency:"USD",
                    quantity: item.quantity,
                })),
            },
            amount:{
                currency :"USD",
                total: totalAmount.toFixed(2),
            },
            description :"description",
        },
      ],
    };

    paypal.payment.create(create_payment_json,async(error,paymentInfo)=>{
        if(error){
            console.log(error)

            return res.status(500).json({
                success:false,
                message:"error while creating payment"
            });
        }else{
            const newlyCreateOrder = new Order({
                 userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId:paymentInfo.id,
          payerId,
            });

            await newlyCreateOrder.save();

            const approveURL = paymentInfo.links.find((link)=>link.rel === "approval_url").href;

            res.status(201).json({
                success:true,
                approveURL,
                orderId : newlyCreateOrder._id,
            });
        }
    });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"some error"
        })
    }
}

const capturePayment = async(req,res)=>{
    try {
        const{paymentId,orderId,payerId}=req.body

        const order = await Order.findById(orderId)

        if(!order){
            return res.status(404).json({
                success:false,
                message:"order cannot be found"
            })
        }

        order.paymentStatus = "paid";
        order.orderStatus='confirmed';
        order.paymentId = paymentId;
        order.payerId = payerId

        for(let item of order.cartItems){
            let product = await Product.findById(item.productId);
            if(!product){
                return res.status(404).json({
                    success:false,
                    message:"product not found"
                })
            }
            product.totalStock -= item.quantity;
            if(product.stock < 0){
                return res.status(400).json({
                    success:false,
                    message:`Insufficient stock for product ${product.title}`
                })
            }
            await product.save();
        }

         await Cart.findByIdAndDelete(order.cartId)

        await order.save();

        res.status(200).json({
            success:true,
            message:"order confirmed",
            data:order,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"some error"
        })
    }
}

const getAllOrdersByUser = async(req,res)=>{
    try {
        const {userId}= req.params;

        const orders = await Order.find({userId});

        if(!orders.length){
            return res.status(404).json({
                success:false,
                message:"No orders found"
            })
        }
        res.status(200).json({
            success:true,
            data:orders
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"some error occurred"
        })
    }
}

const getOrderDetails= async(req,res)=>{
    try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"some error occurred"
        })
    }
}

module.exports = {createOrder,capturePayment,getAllOrdersByUser,getOrderDetails}
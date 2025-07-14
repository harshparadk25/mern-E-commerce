

const Product = require('../../models/Product')


const getFilteredProducts = async(req,res)=>{
    try {

        const { category = "", brand = "", sortBy = "price-lowtohigh" } = req.query;

let filters = {};

if (category) {
  filters.category = { $in: category.split(",") };
}

if (brand) {
  filters.brand = { $in: brand.split(",") };
}

let sort = {};

switch (sortBy) {
  case "price-lowtohigh":
    sort.salePrice = 1;
    break;
  case "price-hightolow":
    sort.salePrice = -1;
    break;
  case "title-atoz":
    sort.title = 1;
    break;
  case "title-ztoa":
    sort.title = -1;
    break;
  default:
    sort.salePrice = 1;
    break;
}



        
        const products = await Product.find(filters).sort(sort);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        })
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
};

const getProductDetails = async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);

        if(!product) return res.status(404).json({
            success:false,
            message:"Product not found",
        });

        res.status(200).json({
            success:true,
            data:product
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"some error came"
        });
    }
}

module.exports = {
    getFilteredProducts,
    getProductDetails
};
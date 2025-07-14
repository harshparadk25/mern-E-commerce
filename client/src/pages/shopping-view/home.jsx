import { Button } from '@/components/ui/button'
import bannerOne from '../../assets/banner1.webp'
import bannerTwo from '../../assets/banner2.webp'
import bannerThree from '../../assets/banner3.webp'
import bannerFour from '../../assets/banner4.webp'
import { Airplay, BabyIcon, ChevronsLeftIcon, ChevronsRightIcon, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/product-slice'
import ShoppingProductTile from '@/components/shopping/product-tile'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import ProductsDetailsDialog from '@/components/shopping/product-details'
import { getFeatureImages } from '@/store/common'

const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levi", label: "Levi's", icon: Airplay },
    { id: "zara", label: "Zara", icon: Images },

];



function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [bannerOne, bannerTwo, bannerThree, bannerFour];
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { productsList,productDetails } = useSelector(state => state.shopProducts);
    const {featureImageList} = useSelector((state) => state.commonFeature);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.shopCart);

    function handleNavigateToListing(getCurrentItem, section) {
        const params = new URLSearchParams();
        params.set(section, [getCurrentItem.id].join(",")); // for consistency


        navigate({
            pathname: "/shop/listing",
            search: `?${params.toString()}`
        });
    }

    function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId,getTotalStock) {
     let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
       if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`)

          return;
        }
      }
    }
  if (!user?.userId) {
    alert("Please login to add to cart.");
    return;
  }

  const payload = {
    userId: user.userId,
    productId: getCurrentProductId,
    quantity: 1
  };

 

  dispatch(addToCart(payload)).then((data) => {
    if(data?.payload?.success){
      dispatch(fetchCartItems(user.userId));
     toast.success("Product is added to cart")
    }
  });
}
     useEffect(()=>{
    if(productDetails!==null) setOpenDetailsDialog(true);

  },[productDetails])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }))
    }, [dispatch]);

     useEffect(()=>{
        dispatch(getFeatureImages());
      },[dispatch])




    return <div className="flex flex-col min-h-screen">
        <div className="relative w-full h-[600px] overflow-hidden">
            {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
            <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSlide(
                    (prevSlide) =>
                        (prevSlide - 1 + slides.length) % slides.length
                )}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:!bg-black/30 transition-colors duration-200"
            >
                <ChevronsLeftIcon className="w-4 h-4" />
            </Button>


            <Button variant="outline" size="icon"
                onClick={() => setCurrentSlide(
                    (prevSlide) =>
                        (prevSlide + 1) % slides.length
                )} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80">
                <ChevronsRightIcon className='w-4 h-4' />
            </Button>
        </div>
        <section className='py-12 bg-gray-50'>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Shop by category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {
                        categoriesWithIcon.map(categoryItem => <Card
                            onClick={() => handleNavigateToListing(categoryItem, "category")}
                            className="cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                                <span className="font-bold">{categoryItem.label}</span>
                            </CardContent>

                        </Card>)
                    }
                </div>
            </div>
        </section>

        <section className='py-12 bg-gray-50'>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Shop by Brand
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {
                        brandsWithIcon.map(brandItem => <Card
                            onClick={() => handleNavigateToListing(brandItem, "brand")}
                            className="cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                                <span className="font-bold">{brandItem.label}</span>
                            </CardContent>

                        </Card>)
                    }
                </div>
            </div>
        </section>

        <section className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Feature Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {
                        productsList && productsList.length > 0 ?
                            productsList.map((productItem) => (
                                <ShoppingProductTile
                                    product={productItem}
                                    handleGetProductDetails={handleGetProductDetails}
                                    handleAddToCart={handleAddToCart}
                                />
                            ))
                            : null
                    }
                </div>
            </div>

        </section>
        <ProductsDetailsDialog 
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        />
    </div>
}
export default ShoppingHome;
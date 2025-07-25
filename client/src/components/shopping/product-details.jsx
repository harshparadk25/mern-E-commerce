import { Star, StarHalf, StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/product-slice";
import { Label } from "../ui/label";
import StartRating from "../common/start-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";


function ProductsDetailsDialog({ open, setOpen, productDetails }) {
    const [reviewMsg, setReviewMsg] = useState("");
    const {reviews} = useSelector((state) => state.shopReview);
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const {user} = useSelector(state =>state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);

    function handleRatingChange(getRating) {
        setRating(getRating);
    }

    function handleAddToCart(getCurrentProductId,getTotalStock){
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
         dispatch(
      addToCart({
        userId: user?.userId,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.userId));
        toast.success("item added to cart")
      }
    });
    }
    function handleDialogClose(){
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg("");
    }

    function handleAddReview() {
    dispatch(
        addReview({
            productId: productDetails?._id,
            userId: user?.userId,
            reviewMsg: reviewMsg,
            reviewValue: rating,
            userName: user?.userName,
        })
    ).then((data) => {
        if (data?.payload?.success) {
            setRating(0);
            setReviewMsg("");
            dispatch(getReviews(productDetails?._id));
            toast.success("Review added successfully");
        }
    });
}

     useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0 z-40" />
            <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] bg-white dark:bg-zinc-900 rounded-lg shadow-lg">

                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        width={600}
                        height={600}
                        className="aspect-square w-full object-cover"
                    />
                </div>
                <div className="">
                    <div>
                        <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">
                            {productDetails?.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p
                            className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""
                                }`}
                        >
                            ${productDetails?.price}
                        </p>
                        {productDetails?.salePrice > 0 ? (
                            <p className="text-2xl font-bold text-muted-foreground">
                                ${productDetails?.salePrice}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                         <div className="flex items-center gap-0.5">
                            <StartRating rating={averageReview}/>
                                    
                                    </div>
                                    <span className="text-muted-foreground">
                                        ({averageReview.toFixed(1)} average)
                                    </span>
                    </div>
                    <div className="mt-5 mb-5">
                        {
                            productDetails?.totalStock === 0 ? (<Button className="cursor-not-allowed w-full opacity-60"
                       >Out of Stock</Button>):(<Button className="w-full"
                        onClick = {()=>handleAddToCart(productDetails?._id,productDetails?.totalStock)}>Add to cart</Button>)
                        }
                    </div>
                    <Separator />
                    <div className="max-h-[300px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        <div className="grid gap-6">
                            
                            {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StartRating rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
                        </div>
                        <div className="mt-10  flex-col gap-2">
                            <Label>Write a review</Label>
                            <div className="flex gap-1">
                                 <StartRating
                                 rating={rating}
                                    handleRatingChange={handleRatingChange}
                                 />
                            </div>
                           
                            <Input
                            name ="reviewMsg"
                           value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                             placeholder="write a review.."/>
                            <Button 
                             onClick={handleAddReview}
                            disabled = {reviewMsg.trim()===""}>Submit</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductsDetailsDialog;
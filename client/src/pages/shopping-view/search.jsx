import ProductsDetailsDialog from "@/components/shopping/product-details";
import ShoppingProductTile from "@/components/shopping/product-tile";
import { Input } from "@/components/ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/product-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { ConstructionIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";



function Search() {
    const [keyword, setKeyword] = useState('');
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const {searchResults} = useSelector(state => state.shopSearch);
    const {productDetails} = useSelector(state => state.shopProducts);
    const {user} = useSelector(state => state.auth);
    const {cartItems} = useSelector(state => state.shopCart);
   useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else{
         setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

   function handleAddToCart(getCurrentProductId, getTotalStock ){
    console.log(cartItems);

    let getCartItems = cartItems.items||[];

    if(getCartItems.length){
        const indexOfCurrentItem = getCartItems.findIndex((item)=> item.productId === getCurrentProductId);

        if(indexOfCurrentItem > -1){
             const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error("You cannot add more than available stock");

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
        toast.success("Product added to cart successfully");
      }
    });
   }
    function handleGetProductDetails(getCurrentProductId){
       console.log(getCurrentProductId);
       dispatch(fetchProductDetails(getCurrentProductId)).then(data=>console.log(data));
     }
   useEffect(()=>{
    if(productDetails!==null) setOpenDetailsDialog(true);

  },[productDetails])

  console.log("Search Results:", searchResults);

    return <div className="container mx-auto md:px-6 px-4 py-8">
        <div className="flex justify-center mb-8">
            <div className="w-full flex items-center">
                <Input
                value={keyword}
                name="keyword"
                className="py-6"
                placeholder="Search for products..."
                onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
        </div>
        {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {searchResults.map((item)=>(
                <ShoppingProductTile
                product={item}
                handleAddToCart={handleAddToCart}
                handleGetProductDetails={handleGetProductDetails}
                key={item.productId}
                />
            ))}
        </div>
            <ProductsDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog}productDetails={productDetails} />
    </div>
}

export default Search;
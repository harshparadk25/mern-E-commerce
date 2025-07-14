import ProductFilter from "@/components/shopping/filter"
import ProductsDetailsDialog from "@/components/shopping/product-details"
import ShoppingProductTile from "@/components/shopping/product-tile"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { sortOptions } from "@/config"
import { fetchAllProducts } from "@/store/admin/product-slice"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/product-slice"
import { ArrowUpDownIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createSearchParams, useSearchParams } from "react-router-dom"
import { toast } from "sonner"


function createSearchParamsHelper(filterParams){
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(','); // Fix here: join instead of json
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  console.log(queryParams, "queryParams");
  return queryParams.join("&");
}

function ShopListingPage() {

  const dispatch = useDispatch();
  const {productsList,productDetails} = useSelector((state) => state.shopProducts);
  const {user} = useSelector((state)=>state.auth)
  const {cartItems} = useSelector((state)=>state.shopCart)
  const [filters,setFilters] = useState({});
  const [sort,setSort] = useState(null);
  const [searchParams,setSearchParams] = useSearchParams();
  const [openDetailsDialog,setOpenDetailsDialog] = useState(false)
  function handleSort(value){
    console.log(value);
    setSort(value)
  }

  function handleFilter(getSectionId , getCurrentOption,isChecked){
    console.log(getCurrentOption,getSectionId,isChecked);

    let cpyFilters = {...filters};
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if(indexOfCurrentSection===-1){
      cpyFilters={
        ...cpyFilters,
        [getSectionId]:[getCurrentOption]
      }
    }
    else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
   
    setFilters(cpyFilters);
     sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId){
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId)).then(data=>console.log(data));
  }

function handleAddToCart(getCurrentProductId,getTotalStock) {
  console.log(cartItems)
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




 useEffect(() => {
  const query = Object.fromEntries([...searchParams.entries()]);
  const parsedFilters = {};

  Object.entries(query).forEach(([key, value]) => {
    parsedFilters[key] = value.split(","); // support multiple values
  });

  setFilters(parsedFilters);
  setSort("price-lowtohigh");
}, [searchParams]);



  useEffect(() => {
  if (filters !== null && sort !== null)
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
}, [dispatch, sort, filters]);


  useEffect(()=>{
    if(filters && Object.keys(filters).length>0){
      const createQueryString = createSearchParamsHelper(filters)
      setSearchParams(new URLSearchParams(createQueryString))
    }
  },[filters])

    

  useEffect(()=>{
    if(productDetails!==null) setOpenDetailsDialog(true);

  },[productDetails])


  return <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
    <ProductFilter filters={filters} handleFilter={handleFilter}/>
    <div className="bg-background w-full rounded-lg shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-extrabold ">All Products</h2>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{productsList.length}</span>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowUpDownIcon className="h-4 w-4"/>
            <span>Sort by</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup value={sort} onValueChange={handleSort} className="bg-white font-semibold" >
              {
                sortOptions.map((sortItem) => (<DropdownMenuRadioItem key={sortItem.id} value={sortItem.id} className="cursor-pointer">
                  {sortItem.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>

          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {productsList && productsList.length > 0
            ? productsList.map((productItem) => (
                <ShoppingProductTile
                  product={productItem}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))
            : null}
      </div>
    </div>
    <ProductsDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog}productDetails={productDetails} />

  </div>
}

export default ShopListingPage
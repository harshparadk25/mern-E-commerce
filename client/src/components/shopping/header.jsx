import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { fetchAllProducts } from "@/store/admin/product-slice";

// Updated to accept onItemClick
function MenuItems({ onItemClick = () => {} }) {
  const navigate = useNavigate();
   const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

function handleNavigate(getCurrentMenuItem) {
  sessionStorage.removeItem("filters");

  const currentFilter =
    getCurrentMenuItem.id !== "home" && getCurrentMenuItem.id !== "products"
      ? {
          category: [getCurrentMenuItem.id],
        }
      : null;

  sessionStorage.setItem("filters", JSON.stringify(currentFilter));

  if (getCurrentMenuItem.path === "/shop/listing") {
    // Add category as query param
    const newSearchParams = new URLSearchParams({
      category: getCurrentMenuItem.id,
    });

    navigate(`${getCurrentMenuItem.path}?${newSearchParams.toString()}`);
  } else {
    navigate(getCurrentMenuItem.path);
  }

  onItemClick(); // close menu on mobile
}


  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row pt-4">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer ml-4"
          key={menuItem.id}
          
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

// Updated to accept onItemClick
function HeaderRightContent({ onItemClick = () => {} }) {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet , setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const {cartItems} = useSelector((state)=>state.shopCart)

  function handleLogout() {
    /* dispatch(logoutUser()); */
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
    onItemClick(); 
  }
  
useEffect(() => {
  if (user?.userId) {
    dispatch(fetchCartItems(user.userId));
  }
  dispatch(fetchAllProducts());
}, [dispatch, user]);

  

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={()=>setOpenCartSheet(false)}>
          <Button 
          onClick={()=>setOpenCartSheet(true)} 
          variant={"outline"} 
          size="icon" className="ml-3 relative">
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute top-[-5px] right-[2px] font-bold text-lg">{cartItems?.items?.length||'0'}</span>
        <span className="sr-only">User cart</span>
      </Button>
      <UserCartWrapper
      setOpenCartSheet={setOpenCartSheet}
       cartItems={cartItems &&cartItems.items && cartItems.items.length > 0 ? cartItems.items : [] }/>
      </Sheet>
    
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer ml-3">
            <AvatarFallback className="text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-35 bg-white">
          <DropdownMenuLabel>Log in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate("/shop/account");
              onItemClick(); 
            }}
            className="hover:bg-gray-300"
          >
            <UserCog className="mr-2 h-5 w-5" />
            <span className="font-bold">Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="hover:bg-gray-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="font-bold">LogOut</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 ">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-white">
            <MenuItems onItemClick={() => setIsOpen(false)} />
            <div>
              <HeaderRightContent onItemClick={() => setIsOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;

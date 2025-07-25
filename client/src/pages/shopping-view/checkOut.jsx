import Address from "@/components/shopping/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemContent from "@/components/shopping/cart-containts";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createNewOrder } from "@/store/shop/order-slice";


function ShopCheckOut() {

  const { cartItems } = useSelector(state => state.shopCart)
  const { user } = useSelector(state => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();


  function handleInitiatePaypalPayment() {

    if (cartItems.length === 0) {
      toast("Your cart is empty");
      return;
    }
    if (currentSelectedAddress === null) {
  toast("Please select one address to proceed", {
    variant: "destructive",
  });
  return;
}



    const orderData = {
      userId: user.userId,
      cartId:cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
     orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    dispatch(createNewOrder(orderData)).then((data) => {
  console.log("Order response:", data);

  if (data?.payload?.success && data?.payload?.approveURL) {
    // Redirect immediately
    window.location.href = data.payload.approveURL;
  } else {
    toast("Failed to create order");
    setIsPaymentStart(false);
  }
});

  }



useEffect(() => {
  if (approvalURL && isPaymentStart) {
    window.location.href = approvalURL;
  }
}, [approvalURL, isPaymentStart]);

  

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  return (
    <div>
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item, index) => (
              <UserCartItemContent key={index} cartItem={item} />
            ))
            : null}

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {
                isPaymentStart ? "Processing..." : "Pay with Paypal"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopCheckOut;
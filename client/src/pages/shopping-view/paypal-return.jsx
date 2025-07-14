import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturn() {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const params = new URLSearchParams(location.search); 
  const paymentId = params.get('paymentId');
  const payerId = params.get('PayerID') || params.get('payerId'); // fallback


  useEffect(() => {
  if (paymentId && payerId) {
    const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
    console.log("PaymentId:", paymentId); 
    console.log("PayerId:", payerId);     
    console.log("OrderId:", orderId);     

    if (orderId) {
      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        console.log("Capture Payment Result:", data); 
        if (data?.payload?.success) {
          sessionStorage.removeItem('currentOrderId');
          window.location.href = '/shop/payment-success';
        } else {
          console.log("Payment capture failed or no success flag");
        }
      });
    } else {
      console.log("No orderId found in sessionStorage");
    }
  } else {
    console.log("Missing paymentId or payerId in URL");
  }
}, [paymentId, payerId, dispatch]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Processing Payment... Please wait
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturn;

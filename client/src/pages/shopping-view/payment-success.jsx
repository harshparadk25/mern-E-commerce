import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function PaymentSuccessPage() {
    const navigate = useNavigate();
    return( <Card className="p-10">
      <CardHeader>
        <CardTitle className={"text-center text-2xl font-bold text-green-600"}>
          Payment Successful!
          Thank you for your purchase!
        </CardTitle>
      </CardHeader>
      <Button className="mt-5" onClick={()=> navigate("/shop/account")}>View Order</Button>
    </Card>)
}

export default PaymentSuccessPage;
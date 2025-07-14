import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ShopOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";



function ShoppingOrder() {
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user.userId))
  }, [dispatch]);

  useEffect(()=>{
    if(orderDetails !==null) setOpenDialog(true);
  },[orderDetails])

  console.log(orderDetails, "orderDetails");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                orderList && orderList.length > 0 ?
                  orderList.map(orderItem => <TableRow>
                    <TableCell>orderItem?._id</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 !text-white ${orderItem?.orderStatus === "confirmed"
                            ? "!bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                              ? "!bg-red-600"
                              : "!bg-black"
                          }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>

                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>

                      <Button onClick={()=>handleFetchOrderDetails(orderItem?._id)} >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>) : null
              }

            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={openDialog} onOpenChange={()=>{
        setOpenDialog(false)
        dispatch(resetOrderDetails())
      }}>
        <ShopOrderDetailsView orderDetails={orderDetails}/>
      </Dialog>
    </>
  );
}

export default ShoppingOrder;
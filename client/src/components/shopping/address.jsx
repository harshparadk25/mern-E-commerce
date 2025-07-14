import { use, useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { addressFormControls } from "@/config";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({setCurrentSelectedAddress,selectedId}) {

    const [formdata,setFormdata] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

    function handleManageAddress(event){
        event.preventDefault();

        if (addressList.length >= 3 && currentEditedId === null) {
      setFormdata(initialAddressFormData);
      toast.success("You can add max 3 addresses")

      return;
    }

        currentEditedId !== null ? dispatch(editAddress({
          userId:user.userId,addressId : currentEditedId,formData :formdata
        })).then((data)=>{
          if(data?.payload?.success){
            dispatch(fetchAllAddresses(user.userId));
            setCurrentEditedId(null);
            setFormdata(initialAddressFormData)
            toast.success("address edited")
          }
        }) :

        dispatch(addNewAddress({
            ...formdata,
            userId : user.userId
        })).then(data =>{
            console.log(data)
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.userId))
                setFormdata(initialAddressFormData)
                console.log("Submitting address:", formdata);
                toast.success("Address added successfully")
            }
        })
    }

    function handleDeleteAddress(getCurrentAddress){
        dispatch(deleteAddress({userId : user?.userId , addressId : getCurrentAddress._id})).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user.userId));
                toast.success("Address deleted successfully")
            }
        });
    }

    function handleEditAddress(getCurrentAddress){
  setCurrentEditedId(getCurrentAddress?._id);
  setFormdata({
    ...formdata,
    address: getCurrentAddress?.address || "",
    city: getCurrentAddress?.city || "",
    phone: getCurrentAddress?.phone || "",
    pincode: getCurrentAddress?.pincode || "",
    notes: getCurrentAddress?.notes || ""
  });
}


    function isFromValid() {
  return Object.keys(formdata)
    .map((key) => {
      const value = formdata[key];
      return typeof value === "string" ? value.trim() !== "" : value !== undefined && value !== null;
    })
    .every((item) => item);
}


   useEffect(() => {
  if (user?.userId) {
    dispatch(fetchAllAddresses(user.userId));
  }
}, [dispatch, user?.userId]);


    console.log(addressList,"List")

    return ( 
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-3  gap-2">
                 {addressList && addressList.length > 0
  ? addressList.map((singleAddressItem) => (
      <AddressCard 
      selectedId={selectedId}
        key={singleAddressItem._id}
        addressInfo={singleAddressItem}
        handleDeleteAddress={handleDeleteAddress}
        handleEditAddress={handleEditAddress}
        setCurrentSelectedAddress={setCurrentSelectedAddress}
      />
    ))
  : null}

            </div>
            <CardHeader><CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
            </CardHeader>
             <CardContent className="space-y-3">
                <CommonForm 
                formControls={addressFormControls}
                formData={formdata}
                setFormData={setFormdata}
                 buttonText={currentEditedId !== null ? "Edit" : "Add"}
                onSubmit={handleManageAddress}
                isBtnDisabled={!isFromValid()}
                />
            </CardContent>
        </Card>
     );
}

export default Address;
import { Button } from "@/components/ui/button";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { useDispatch, useSelector } from "react-redux";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin/image-upload";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/product-slice";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin/product-tile";

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    averageReview: 0,
};



function AdminProducts() {
    const [openCreateProductsDialog, setOpenCreateProductsDialog] =
        useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const {productList} = useSelector((state) => state.adminProducts);

    
    const dispatch = useDispatch();

    function onSubmit(event){
        event.preventDefault();

        currentEditedId !==null ? dispatch(editProduct({
            id: currentEditedId,
            formData,
        })).then((data)=>{
            console.log("Product edited successfully", data);
            if(data?.payload){
                dispatch(fetchAllProducts());
                setImageFile(null);
                setFormData(initialFormData);
                 toast.success("Product edited successfully");
                setOpenCreateProductsDialog(false);
            }
        }):
        dispatch(addNewProduct({
            ...formData,
            image: uploadedImageUrl,    
        })).then((data)=>{
            console.log("Product added successfully", data);
            if(data?.payload){
                dispatch(fetchAllProducts());
                setImageFile(null);
                setFormData(initialFormData);
                 toast.success("Product added successfully");
                setOpenCreateProductsDialog(false);
            }
        })
    }

    function isFormDataValid() {
        return Object.keys(formData).map((key) =>
            formData[key] !== "")
        .every((item)=>item);
    }

    function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success("Product deleted successfully");
      }
    });
  }

    useEffect(()=>{
        dispatch(fetchAllProducts())
    },[dispatch])

    console.log(formData, "formData");
    

    return <Fragment>
        <div className="mb-5 w-full flex justify-end">
            <Button onClick={() => setOpenCreateProductsDialog(true)} >
                Add New Product
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {
                productList && productList.length > 0 ? 
                productList.map(productItem=> <AdminProductTile 
                     key={productItem._id}
                    setFormData={setFormData} setCurrentEditedId=
                    {setCurrentEditedId} setOpenCreateProductsDialog={setOpenCreateProductsDialog} 
                    product={productItem}
                    handleDelete={handleDelete}
                    />) : null
            }
        </div>
        <Sheet open={openCreateProductsDialog}
            onOpenChange={() => {
                setOpenCreateProductsDialog(false);
                setCurrentEditedId(null);
                setFormData(initialFormData);
            }}
        >
            <SheetContent side="right" className="overflow-auto bg-white">
                <SheetHeader>
                    <SheetTitle>
                        {currentEditedId !== null ? "Edit Product" : "Add New Product"}

                    </SheetTitle>
                </SheetHeader>
                <ProductImageUpload 
                imageFile={imageFile} 
                setImageFile={setImageFile} 
                uploadedImageUrl={uploadedImageUrl} 
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={currentEditedId !==null}
                />
                <div className="py-6 mx-4 ">
                    <CommonForm
                        formData={formData}
                        setFormData={setFormData}
                        formControls={addProductFormElements}
                        buttonText={currentEditedId !== null ? "Edit" : "Add"}
                        onSubmit={onSubmit}
                        isBtnDisabled={!isFormDataValid()}
                    />
                </div>
            </SheetContent>
        </Sheet>
    </Fragment>
}

export default AdminProducts;
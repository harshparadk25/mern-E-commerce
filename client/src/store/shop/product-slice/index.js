import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productsList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    const query = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        query.push(`${key}=${value.join(",")}`);
      }
    }

    if (sortParams) {
      query.push(`sortBy=${sortParams}`);
    }

    const queryString = query.join("&");

    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get?${queryString}`
    );

    return result?.data;
  }
);



export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);


const shoppingProductsSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails : (state =>{
      state.productDetails = null
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productsList = action.payload.data;
        console.log(action.payload,"action")
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productsList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const {setProductDetails} = shoppingProductsSlice.actions;
// ✅ Export default reducer for store.js
export default shoppingProductsSlice.reducer;

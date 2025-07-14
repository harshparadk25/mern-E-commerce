import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth-slice/index.js';
import adminProductsSlice from './admin/product-slice/index.js';
import shoppingProductsSlice from './shop/product-slice/index.js';
import shoppingCartSlice from "./shop/cart-slice/index.js"
import shopAddressSlice from "./shop//address-slice/index.js"
import shoppingOrderSlice from "./shop/order-slice/index.js"
import adminOrderSlice from './admin/order-slice/index.js'; 
import ShopSearchSlice from './shop/search-slice/index.js';
import  shopReviewSlice from './shop/review-slice/index.js';
import commonFeatureSlice from './common/index.js';
const store = configureStore({
    reducer:{
        auth:authReducer,
        adminProducts: adminProductsSlice,
        shopProducts: shoppingProductsSlice,
        shopCart : shoppingCartSlice,
        shopAddress : shopAddressSlice,
        shopOrder : shoppingOrderSlice,
        adminOrder: adminOrderSlice,
        shopSearch: ShopSearchSlice, 
        shopReview: shopReviewSlice,
        commonFeature: commonFeatureSlice,
    },
});

export default store;
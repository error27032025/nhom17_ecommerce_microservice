import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import toastReducer from "./toastSlice";
import reviewReducer from "./reviewSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    toast: toastReducer,
    review: reviewReducer,
  },
});

export default store;

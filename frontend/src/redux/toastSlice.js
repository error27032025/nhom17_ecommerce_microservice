import { createSlice } from "@reduxjs/toolkit";

const initialState = { show: false, message: "", variant: "success" };

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    successToast: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.variant = "success";
    },
    dangerToast: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.variant = "danger";
    },

    hideToast: (state, action) => {
      state.show = false;
    },
  },
});
export const { successToast, hideToast, dangerToast } = toastSlice.actions;
export default toastSlice.reducer;

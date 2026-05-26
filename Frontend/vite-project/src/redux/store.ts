import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import transactionReducer from "./Slices/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

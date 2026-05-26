import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

interface Transaction {
  _id: string;
  sender: string;
  receiver: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  async () => {
    const response = await api.get("/transactions/history");
    return response.data.data;
  },
);

export const transferMoney = createAsyncThunk(
  "transactions/transferMoney",
  async (data: { receiverEmail: string; amount: number }) => {
    const response = await api.post("/transactions/transfer", data);
    return response.data.data;
  },
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // LOADING
    builder.addCase(getTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // SUCCESS

    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.loading = false;
      // CLEAR OLD ERRORS
      state.error = null;
      state.transactions = action.payload;
    });

    // ERROR

    builder.addCase(getTransactions.rejected, (state) => {
      state.loading = false;
      state.error = "Failed to load transactions";
    });

    // TRANSFER MONEY

    // LOADING
    builder.addCase(transferMoney.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    // ERROR
    builder.addCase(transferMoney.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Transfer failed";
    });
    // SUCCESS
    builder.addCase(transferMoney.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.transaction) {
        state.transactions.unshift(action.payload.transaction);
      }
    });
  },
});

export default transactionSlice.reducer;

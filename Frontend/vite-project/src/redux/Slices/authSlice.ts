import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isLoadingUser: boolean;
}

interface ErrorResponse {
  response?: { data?: { message?: string } };
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    return (error as ErrorResponse).response?.data?.message || fallback;
  }

  return fallback;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isLoadingUser: true,
};

// LOGIN USER
export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async (
    data: {
      email: string;
      password: string;
    },

    thunkAPI,
  ) => {
    try {
      // LOGIN
      await api.post("/auth/login", data);

      // FETCH PROFILE
      const response = await api.get("/auth/profile");

      return response.data.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

// REGISTER USER
export const registerUser = createAsyncThunk(
  "auth/registerUser",

  async (
    data: {
      name: string;
      email: string;
      password: string;
    },

    thunkAPI,
  ) => {
    try {
      const response = await api.post("/auth/register", data);

      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Registration failed"),
      );
    }
  },
);

// LOAD USER
export const loadUser = createAsyncThunk(
  "auth/loadUser",

  async (_, thunkAPI) => {
    try {
      const response = await api.get("/auth/profile");

      return response.data.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load user"),
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;

      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(loginUser.rejected, (state, action: PayloadAction<unknown>) => {
      state.loading = false;
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.error = payload
          .map((err: { message?: string }) => err.message || "")
          .filter(Boolean)
          .join(", ");
      } else if (typeof payload === "string") {
        state.error = payload;
      } else {
        state.error = getErrorMessage(payload, "Login failed");
      }
    });

    // REGISTER
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(registerUser.rejected, (state, action: PayloadAction<unknown>) => {
      state.loading = false;
      // HANDLE ARRAY ERRORS
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.error = payload
          .map((err: { message?: string }) => err.message || "")
          .filter(Boolean)
          .join(", ");
      } else if (typeof payload === "string") {
        state.error = payload;
      } else {
        state.error = getErrorMessage(payload, "Registration failed");
      }
    });

    // LOAD USER
    builder.addCase(loadUser.pending, (state) => {
      state.isLoadingUser = true;
    });

    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoadingUser = false;
    });

    builder.addCase(loadUser.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoadingUser = false;
    });
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

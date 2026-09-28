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

interface FieldErrors {
  [field: string]: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors | null;
  isLoadingUser: boolean;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: FieldErrors;
    };
  };
}

interface RejectPayload {
  message: string;
  fieldErrors: FieldErrors | null;
}

const buildRejectPayload = (
  error: unknown,
  fallback: string,
): RejectPayload => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const data = (error as ErrorResponse).response?.data;

    return {
      message: data?.message || fallback,
      fieldErrors: data?.errors || null,
    };
  }

  return { message: fallback, fieldErrors: null };
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  fieldErrors: null,
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
      await api.post("/auth/login", data);

      const response = await api.get("/auth/profile");

      return response.data.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        buildRejectPayload(error, "Login failed"),
      );
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
        buildRejectPayload(error, "Registration failed"),
      );
    }
  },
);

// LOAD USER
export const loadUser = createAsyncThunk(
  "auth/loadUser",

  async (_, thunkAPI) => {
    const MAX_ATTEMPTS = 5;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response = await api.get("/auth/profile");

        return response.data.data;
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;

        // The server answered (e.g. 401 = not logged in): stop, don't retry.
        const serverAnswered =
          status !== undefined && ![502, 503, 504].includes(status);

        if (serverAnswered || attempt === MAX_ATTEMPTS) {
          return thunkAPI.rejectWithValue(
            buildRejectPayload(error, "Failed to load user"),
          );
        }

        // No response, timeout, or 502/503/504: Render is still waking up.
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    return thunkAPI.rejectWithValue({
      message: "Failed to load user",
      fieldErrors: null,
    });
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

    clearAuthErrors: (state) => {
      state.error = null;
      state.fieldErrors = null;
    },
  },

  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.fieldErrors = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(
      loginUser.rejected,
      (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        const payload = action.payload as RejectPayload | undefined;
        state.error = payload?.message || "Login failed";
        state.fieldErrors = payload?.fieldErrors || null;
      },
    );

    // REGISTER
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.fieldErrors = null;
    });

    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(
      registerUser.rejected,
      (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        const payload = action.payload as RejectPayload | undefined;
        state.error = payload?.message || "Registration failed";
        state.fieldErrors = payload?.fieldErrors || null;
      },
    );

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

export const { setUser, logout, clearAuthErrors } = authSlice.actions;

export default authSlice.reducer;

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ReactNode } from "react";

interface User {
  score: ReactNode;
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  profilePhoto?: string;
}

interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

const initialState: AuthState = {};

// Async thunk to update profile on the backend
export const updateUserProfileAsync = createAsyncThunk<
  User, // return type
  FormData, // argument type
  { state: { auth: AuthState } }
>(
  'auth/updateUserProfileAsync',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;

      const res = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken || ''}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || 'Update failed');
      }

      const data = await res.json();
      return data.user as User; // assuming backend returns { user: {...} }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    logout(state) {
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.user = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserProfileAsync.fulfilled, (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    });
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

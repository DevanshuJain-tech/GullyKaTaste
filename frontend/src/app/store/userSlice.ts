import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMe, patchMe, type MePayload } from "../lib/api";

interface UserState {
  me: MePayload | null;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
}

const initialState: UserState = {
  me: null,
  status: "idle",
  error: null,
};

export const loadMe = createAsyncThunk("user/loadMe", async () => {
  return getMe();
});

export const saveMeProfile = createAsyncThunk(
  "user/saveMeProfile",
  async (payload: { full_name?: string; phone?: string }) => {
    const user = await patchMe(payload);
    return user;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState(state) {
      state.me = null;
      state.status = "idle";
      state.error = null;
    },
    setVendorSnapshot(
      state,
      action: {
        payload: MePayload["vendor"];
      },
    ) {
      if (!state.me) {
        return;
      }

      state.me.vendor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadMe.fulfilled, (state, action) => {
        state.status = "ready";
        state.me = action.payload;
        state.error = null;
      })
      .addCase(loadMe.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "Failed to load user";
      })
      .addCase(saveMeProfile.fulfilled, (state, action) => {
        if (!state.me) {
          return;
        }

        state.me.user = action.payload;
      });
  },
});

export const { clearUserState, setVendorSnapshot } = userSlice.actions;

export default userSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  phone: '',
  fullName: '',
  email: '',
  gender: 'MALE',
  FCM_token: '',
  _id: ''
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      return action.payload;
    },

    resetAuth: () => {
      return initialState;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;

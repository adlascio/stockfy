import { createSlice } from '@reduxjs/toolkit'


const initialState = {}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
      setActiveUser:(state, action) => {
          state = action.payload    
      }
  }
});

export const {setActiveUser} = userSlice.actions

export const selectUserEmail = state => state.user.email
export const selectUser = state => state.user

export default userSlice.reducer
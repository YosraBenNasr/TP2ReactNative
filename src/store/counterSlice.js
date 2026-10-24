import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { 
      state.value += 1; 
    },
    decrement: (state) => { 
      state.value = Math.max(0, state.value - 1); // Sécurisation pour ne pas descendre sous 0
    },
    reset: (state) => { 
      state.value = 0; 
    },
    addFive: (state) => { 
      state.value += 5; 
    },
    multiplyTwo: (state) => { 
      state.value *= 2; 
    },
  },
});

// Exportation des actions pour pouvoir les utiliser dans les composants
export const { increment, decrement, reset, addFive, multiplyTwo } = counterSlice.actions;

// Exportation du reducer pour le store central
export default counterSlice.reducer;
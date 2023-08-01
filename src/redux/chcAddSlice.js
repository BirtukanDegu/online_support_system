import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    chcData:[],
    filteredChc:[],
}

const chcAddSlice = createSlice({
  name: "chc",
  initialState,
  reducers: {
    STORE_CHC(state, action) {
        
            state.chcData = action.payload.chcData;
            
          },
          
          SORT_CHC(state, action) {
            const { data, sort } = action.payload;
            let tempChc = [];
            if (sort === "all") {
              tempChc =data;
            } else {
              
              tempChc =data.filter(
                (chcData) => chcData.priority === sort);
            }
            state.filteredChc = tempChc;
             
          },

          FILTER_BY_SEARCH(state, action) {
           
            const {data, search} = action.payload;
             const tempProducts = data.filter(
              (chc) =>
                chc.customername.toLowerCase().includes(search.toLowerCase()) ||
                chc.phonenumber.toLowerCase().includes(search.toLowerCase())
            );
      
            state.filteredChc = tempProducts;
            
          },
        },
});

export const {STORE_CHC, SORT_CHC, FILTER_BY_SEARCH} = chcAddSlice.actions
export const selectChcData = (state) => state.chc.chcData;
export const selectFiltertedChc = (state) => state.chc.filteredChc;

export default chcAddSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    ticketData:[],
    filteredTicket:[],
}

const ticketAddSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    STORE_TICKET(state, action) {
        
            state.ticketData = action.payload.ticketData;
            
          },
          
          SORT_TICKET(state, action) {
            const { data, sort } = action.payload;
            let tempTicket = [];
            if (sort === "all") {
              tempTicket =data;
            } else {
              
              tempTicket =data.filter(
                (ticketData) => ticketData.priority === sort);
            }
            state.filteredTicket = tempTicket;
             
          },

          FILTER_BY_SEARCH(state, action) {
           
            const {data, search} = action.payload;
             const tempProducts = data.filter(
              (ticket) =>
                ticket.customername.toLowerCase().includes(search.toLowerCase()) ||
                ticket.Phonenumber.toLowerCase().includes(search.toLowerCase())
            );
      
            state.filteredTicket = tempProducts;
            
          },
        },
});

export const {STORE_TICKET, SORT_TICKET, FILTER_BY_SEARCH} = ticketAddSlice.actions
export const selectTicketData = (state) => state.ticket.ticketData;
export const selectFiltertedTicket = (state) => state.ticket.filteredTicket;

export default ticketAddSlice.reducer
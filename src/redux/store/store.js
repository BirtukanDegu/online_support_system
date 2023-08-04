import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../authSlice";
import ticketReducer from "../ticketAddSlice";


const rootReducer = combineReducers({
  ticket:ticketReducer,
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 

export default store;
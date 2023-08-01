import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../authSlice";
import chcReducer from "../chcAddSlice";


const rootReducer = combineReducers({
  chc:chcReducer,
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
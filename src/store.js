import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./redux/LoaderSlice";
import authReducer from "./redux/AuthSlice";
import alertReducer from "./redux/AlertSlice";

export default configureStore({
  reducer: {
    loader: loaderReducer,
    user: authReducer,
    alert: alertReducer,
  },
});

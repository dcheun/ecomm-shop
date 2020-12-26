import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { loadingBarReducer } from "react-redux-loading";

const rootReducer = combineReducers({
  user: userReducer,
  loadingBar: loadingBarReducer,
});

export default rootReducer;

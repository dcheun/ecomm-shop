import { combineReducers } from "redux";
import { loadingBarReducer } from "react-redux-loading";

import { userReducer } from "./userReducer";
import { searchReducer } from "./searchReducer";

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  loadingBar: loadingBarReducer,
});

export default rootReducer;

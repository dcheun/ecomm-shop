import { combineReducers } from "redux";
import { loadingBarReducer } from "react-redux-loading";

import { userReducer } from "./userReducer";
import { searchReducer } from "./searchReducer";
import { cartReducer } from "./cartReducer";
import { drawerReducer } from "./drawerReducer";

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  drawer: drawerReducer,
  loadingBar: loadingBarReducer,
});

export default rootReducer;

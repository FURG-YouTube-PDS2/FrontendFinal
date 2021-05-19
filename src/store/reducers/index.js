import { combineReducers } from "redux";
import setUser from "./setUser";

const allReducers = combineReducers({
  // token: setToken,
  user: setUser,
});

export default allReducers;

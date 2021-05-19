import { createStore } from "redux";
import AllReducer from "./store/reducers";
import ls from "local-storage";

const creds = {
  user: ls.get("user"),
};

export let initialState = creds;

const siderBar = {
  sidebarShow: "responsive",
};

const changeState = (state = siderBar, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest };
    default:
      return state;
  }
};

const store = createStore(AllReducer, initialState);

store.subscribe(() => {
  const { user } = store.getState();

  ls.set("user", user);
});

export default store;

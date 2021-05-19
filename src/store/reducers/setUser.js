const setToken = (state = {}, action) => {
  switch (action.type) {
    case "SETUSER":
      return action.user;
    case "SETTOKEN":
      return action.token;
    case "RESET":
      return "";
    default:
      return state;
  }
};

export default setToken;

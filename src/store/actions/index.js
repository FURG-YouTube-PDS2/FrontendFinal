export const setToken = (token) => {
  return {
    type: "SETTOKEN",
    token: token,
  };
};

export const reset = () => {
  return {
    type: "RESET",
  };
};

export const setUser = (user) => {
  return {
    type: "SETUSER",
    user: user,
  };
};

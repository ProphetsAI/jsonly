const { useStore } = await import("./Global");

export default (function () {
  let authStore = null;

  function init() {
    return {
      _obs: [],
      loggedIn: {
        _obs: [],
        _value: false,
      }
    };
  }

  function getInstance() {
    if (!authStore) {
      authStore = useStore("Auth", init());
    }
    return authStore;
  }

  function login() {
    getInstance().update("loggedIn", true);
  }
  function logout() {
    delete getInstance().update("loggedIn", false);
  }
  function isLoggedIn() {
    const login = getInstance().get("loggedIn");
    return login;
  }
  return {
    login,
    logout,
    isLoggedIn,
  };
})();

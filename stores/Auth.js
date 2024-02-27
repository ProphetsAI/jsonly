const { useStore } = await import("./Global");

const init = {
  auth: {
    _obs: [],
    admin: {
      _value: "Admin",
      _obs: [],
    },
    login: {
      _value: false,
      _obs: [],
    },
  },
}

export function login() {
  const authStore = useStore("auth", init);
  authStore.update("login", true);
}

export function logout() {
  const authStore = useStore("auth", init);
  delete authStore.update("login", false);
}

export function isLoggedIn() {
  const authStore = useStore("auth", init);
  const login = authStore.get("login");
  return login ? login : false;
}

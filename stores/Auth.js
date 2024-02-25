const { State } = await import("../modules/State");

export function login() {
  console.log("login");
  State.login = true;
}

export function logout() {
  console.log("logout");
  delete State.login;
}

export function isLoggedIn() {
  console.log("isLoggedIn");
  const login = State.login;
  return login ? login : false;
}

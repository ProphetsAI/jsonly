const Store = (function(){
  let store = {};
  function get(key) { return key ? store[key] : store; }
  function set(key, value) { store[key] = value; }
  return { get, set }
})();

export { Store };
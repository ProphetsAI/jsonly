const State = (function () {
  let state = {};
  return new Proxy(state, {
    get: function (target, property) {
      return target[property];
    },
    set: function (target, property, value) {
      target[property] = value;
    },
  });
})();

export { State };

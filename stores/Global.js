let store = {};

export function useStore(name = "default", init = {_obs: []}) {
  if (!store[name]) {
    store[name] = init;
  }
  function subscribe(target, context) {
    if (!store[name][target]) {
      store[name][target] = { _value: undefined };
      store[name][target]["_obs"] = [];
    }
    store[name][target]["_obs"].push(context);
  }
  function update(target, value) {
    store[name][target]["_value"] = value;
    var subscribers = [...store[name][target]["_obs"]];
    store[name][target]["_obs"] = [];
    for (var i = 0; i < subscribers.length; i++) {
      function getHost(hostDataIDs) {
        let shadowDOM = document;
        for (let hostDataID of hostDataIDs) {
          const host = shadowDOM.querySelector(
            '[data-id="' + hostDataID + '"]'
          );
          if (host) {
            shadowDOM = host.shadowRoot;
          } else {
            return null;
          }
        }
        return shadowDOM;
      }
      var shadowDOM = getHost(subscribers[i]);
      if (shadowDOM) {
        var host = shadowDOM.getRootNode().host;
        host.refresh();
      }
    }
    for (var i = 0; i < subscribers.length; i++) {
      delete subscribers[i];
    }
  }
  function get(target) {
    if (target) {
      return store[name][target]["_value"];
    }
    return store[name];
  }
  return {
    subscribe,
    update,
    get
  };
}

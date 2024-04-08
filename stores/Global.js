const { log } = await import("../modules/Logger.js");

let store = {};

export async function registerObserver(hostElement) {
  const context = hostElement.dataset.obs;
  const path = context.split(".");
  const StorePath = "../stores/".concat(path[0], ".js");
  const storeModule = await import(/* @vite-ignore */ StorePath);
  const subStore = storeModule["default"].getInstance();
  subStore.subscribe(path[1], hostElement.hostDataIDs);
  log("registerObs for", JSON.stringify(hostElement.hostDataIDs));
}

export function unregisterObserver(hostElement) {
  const context = hostElement.dataset.obs;
  const path = context.split(".");
  const storeName = path[0];
  const field = path[1];
  const store = useStore(storeName);
  store.unsubscribe(field, hostElement.hostDataIDs);
}

export function useStore(name = "Default", _init = {_obs: []}) {
  log("initializing", name);
  if (!store[name]) {
    store[name] = _init;
  } else {
    log("already initialized", name);
  }
  function getHost(hostDataIDs) {
    let shadowDOM = document;
    if (hostDataIDs) {
      for (let hostDataID of hostDataIDs) {
        const host = shadowDOM.querySelector('[data-id="' + hostDataID + '"]');
        if (host) {
          shadowDOM = host.shadowRoot;
        } else {
          return null;
        }
      }
    }
    return shadowDOM;
  }
  function subscribe(target, context) {
    if (target) {
      if (!store[name][target]) {
        store[name][target] = { _value: undefined };
        store[name][target]["_obs"] = [];
      }
      if (store[name][target]["_obs"]) {
        log(`Check if ${JSON.stringify(store[name][target]["_obs"])} contains ${JSON.stringify(context)}`);
        if (store[name][target]["_obs"].includes(context)) {
          log("already present");
        } else {
          store[name][target]["_obs"].push(context);
        }
      }
    } else {
      if (store[name]["_obs"].includes(context)) {
        log("already present");
      } else {
        store[name]["_obs"].push(context);
      }
    }
    log(`${name}.${target} subscribed for ${JSON.stringify(context)}`, store);
  }
  function unsubscribe(target, context) {
    log("unsubscribing observers", JSON.stringify(context));
    let observers;
    if (target) {
      observers = store[name][target]["_obs"];
      log(`${name}.${target} unsubscribing for ${context}`, store);
    } else {
      observers = store[name]["_obs"];
      log(`${name} unsubscribing for ${context}`, store);
    }
    for (var i = 0; i < observers.length; i++) {
      if (observers[i] == context) {
        delete observers[i];
      }
    }
  }
  function update(target, value) {
    log("updating", store);
    store[name][target]["_value"] = value;
    var subscribers = [...store[name][target]["_obs"],...store[name]["_obs"]];
    store[name][target]["_obs"] = [];
    log("notifying", JSON.stringify(subscribers));
    for (var i = 0; i < subscribers.length; i++) {
      var shadowDOM = getHost(subscribers[i]);
      if (shadowDOM) {
        var host = shadowDOM.getRootNode().host;
        if (host) {
          host.refresh();
        }
      }
    }
    // overwrite _obs with []
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
    unsubscribe,
    update,
    get
  };
}

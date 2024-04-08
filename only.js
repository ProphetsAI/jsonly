import { webcomponents } from './webcomponents';
import { registerObserver, unregisterObserver } from './stores/Global.js'
HTMLElement.prototype.on = function (a, b, c) { return this.addEventListener(a, b, c); }
HTMLElement.prototype.off = function (a, b) { return this.removeEventListener(a, b); }
HTMLElement.prototype.$ = function (s) { return this.querySelector(s); }
HTMLElement.prototype.$$ = function (s) { return this.querySelectorAll(s); }
HTMLElement.prototype.refresh = function () { this.dataset.date = Date.now(); }
HTMLElement.prototype.getDOM = function (hostDataIDs = this.hostDataIDs) {
  if (hostDataIDs) {
    let shadowDOM = document;
    for (let hostDataID of hostDataIDs) {
      const host = shadowDOM.querySelector('[data-id="' + hostDataID + '"]')
      if (host) { shadowDOM = host.shadowRoot; } else { return null; }
    }
    return shadowDOM;
  }
  return this.getRootNode();
}
Object.defineProperty(HTMLElement.prototype, "state", {
  get: function () { return this.dataset.state ? JSON.parse(this.dataset.state.replace(/'/g,"\"")) : null; },
  set: function (newState) { this.dataset.state = JSON.stringify(newState); }
});
Object.defineProperty(HTMLElement.prototype, 'script', {
  get: function() { return this.getDOM().publicAPI; }
});
Object.keys(webcomponents).forEach(function (prefix) {
  webcomponents[prefix].forEach(function ({ componentName, filePath }) {
    fetch(`${filePath}?raw"`).then(file => file.text()).then(component => {
      const fragment = document.createRange().createContextualFragment(component);
      const scriptFragment = fragment.querySelectorAll("script")[1];
      const styleFragment = fragment.querySelector("style");
      const templateFragment = fragment.querySelector("template");
      customElements.define(`${prefix}-${componentName}`, class extends HTMLElement {
        static observedAttributes = ["data-date", "data-state"];
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this.isAttached = false; // using isAttached because isConnected is not working as it should
        }
        attributeChangedCallback() {
          if (this.isAttached) {
            this.disconnectedCallback();
            this.connectedCallback();
          }
        }
        async connectedCallback() {
          this.hostDataIDs = []; // the hostDataIDs are used to find the shadowRoot for the WebComponent in the IIFE
          this.dataset.id = Math.random().toString(16).substring(2, 8);
          let hostElement = this;
          while (hostElement && hostElement.dataset.id) {
            this.hostDataIDs.push(hostElement.dataset.id);
            hostElement = hostElement.getRootNode().host;
          };
          if (this.dataset.obs) { await registerObserver(this); } // if (this.dataset.if) { const shouldRender = await registerConditional(this); }
          this.#render();
        }
        disconnectedCallback() {
          if (this.dataset.obs) { unregisterObserver(this); } // if (this.dataset.if) { unregisterObserver(this); }
          while(this.shadowRoot.firstChild) { this.shadowRoot.removeChild(this.shadowRoot.firstChild); }
        }
        async #render() {
          if (templateFragment) { this.shadowRoot.appendChild(document.createRange().createContextualFragment(templateFragment.innerHTML)); 
            // const compiledTemplate = await compile(templateFragment, this);
          }
          if (styleFragment) {
            const clonedStyle = styleFragment.cloneNode(true)
            this.shadowRoot.appendChild(clonedStyle);
          }
          const scriptElement = document.createElement("script");
          scriptElement.setAttribute("type", "module");
          // The IIFE creates a private scope for variables and functions in WebComponents
          scriptElement.textContent = `
(async function(context = '${this.hostDataIDs.reverse().toString()}'.split(',')) {
function getDOM(hostDataIDs) {
  let shadowDOM = document;
  for (let hostDataID of hostDataIDs) {
    const host = shadowDOM.querySelector('[data-id="' + hostDataID + '"]');
    if (host) { shadowDOM = host.shadowRoot; } else { return null; }
  }
  return shadowDOM;
}
const datasetID = context.at(-1);
let shadowDocument = getDOM(context);
const $ = (query) => shadowDocument.querySelector(query);
const $$ = (query) => shadowDocument.querySelectorAll(query);
function getState() { return shadowDocument.host.state; }
function setState(newState) { shadowDocument.host.state = JSON.stringify(newState); }
function refresh() { getDOM([context[0]]).host.refresh(); }
${scriptFragment ? scriptFragment.textContent : ''}
return {};
})();`;
          const scriptsReturnValue = eval (scriptElement.textContent);
          scriptsReturnValue.then(publicAPI => this.shadowRoot.publicAPI = publicAPI);
          this.isAttached = true;
        }
      });
    });
  });
});

import { webcomponents } from './webcomponents';

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
        connectedCallback() {
          this.hostDataIDs = []; // the hostDataIDs are used to find the shadowRoot for the WebComponent in the IIFE
          this.dataset.id = Math.random().toString(16).substring(2, 8);
          let hostElement = this;
          while (hostElement && hostElement.dataset.id) {
            this.hostDataIDs.push(hostElement.dataset.id);
            hostElement = hostElement.getRootNode().host;
          };
          this.#render();
        }
        disconnectedCallback() { while (this.shadowRoot.firstChild) this.shadowRoot.removeChild(this.shadowRoot.firstChild); }
        #render() {
          if (templateFragment) this.shadowRoot.appendChild(templateFragment.content.cloneNode(true));
          if (styleFragment) this.shadowRoot.appendChild(styleFragment.cloneNode(true));
          const scriptElement = document.createElement("script");
          scriptElement.setAttribute("type", "module");
          // The IIFE creates a private scope for variables and functions in WebComponents
          scriptElement.textContent = `
(async function(context = '${this.hostDataIDs.reverse().toString()}'.split(',')) {
  function getDOM(hostDataIDs) {
    console.log("getting", hostDataIDs)
    let shadowDOM = document;
    for (let hostDataID of hostDataIDs) {
      if (hostDataID != '') {
        console.log("getting hostDataID",hostDataID)
        const host = shadowDOM.querySelector('[data-id="' + hostDataID + '"]')
        console.log("host",host);
        shadowDOM = host.shadowRoot;
      }
    }
    return shadowDOM;
  }
  const datasetID = context.at(-1);
  let shadowDocument = getDOM(context);
  const querySelector = (query) => shadowDocument.querySelector(query);
  function refresh() { getDOM([context[0]]).host.dataset.date = Date.now(); }
  function setState(newState) {
    shadowDocument.host.dataset.state = JSON.stringify(newState);
    refresh();
  };
  function getState() {
    if (shadowDocument.host.dataset.state) {
      try {
        return JSON.parse(JSON.parse(shadowDocument.host.dataset.state));
      } catch(e) {
        console.error(e);
      }
      return undefined;
    }
  }
  ${scriptFragment ? scriptFragment.textContent : ''}
})()`;
          this.shadowRoot.appendChild(scriptElement);
          this.isAttached = true;
        }
        #refresh() { if (this.hostDataIDs) document.querySelector('[data-id="' + this.hostDataIDs[0] + '"]').dataset.date = new Date(); }
        set state(newState) { this.dataset.state = JSON.stringify(newState); }
        get state() { return JSON.parse(this.dataset.state); }
      });
    });
  });
});

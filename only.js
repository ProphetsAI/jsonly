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
        disconnectedCallback() {
          while (this.shadowRoot.firstChild) this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        #render() {
          if (templateFragment) this.shadowRoot.appendChild(templateFragment.content.cloneNode(true));
          if (styleFragment) this.shadowRoot.appendChild(styleFragment.cloneNode(true));
          const scriptElement = document.createElement("script");
          scriptElement.setAttribute("type", "module");
          // The IIFE creates a private scope for variables and functions in WebComponents
          scriptElement.textContent = `
(async function(context = '${this.hostDataIDs.reverse().toString()}'.split(',')) {
  const datasetID = context.at(-1);
  let shadowDocument = document;
  for (let hostDataID of context) if (hostDataID != '') shadowDocument = shadowDocument.querySelector('[data-id="' + hostDataID + '"]').shadowRoot;
  const querySelector = (query) => shadowDocument.querySelector(query);
  const $ = shadowDocument.host.dataset.state ? JSON.parse(shadowDocument.host.dataset.state) : undefined;
  const $$ = (newState) => shadowDocument.host.dataset.state = JSON.stringify(newState);
  function refresh() { shadowDocument.host.dataset.date = Date.now(); }
  ${scriptFragment ? scriptFragment.textContent : ''}
})()`;
          this.shadowRoot.appendChild(scriptElement);
          this.isAttached = true;
        }
        set $$(newState) { this.dataset.state = JSON.stringify(newState); }
        get $() { return JSON.parse(this.dataset.state); }
      });
    });
  })
})




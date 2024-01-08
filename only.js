import { webcomponents } from './webcomponents';
import './modules/SQLite.js'

Object.keys(webcomponents).forEach(function (prefix) {
  webcomponents[prefix].forEach(function ({ componentName, filePath }) {
    fetch(`${filePath}?raw"`)
      .then(file => file.text())
      .then(component => {
        const fragment = document.createRange().createContextualFragment(component);
        const scriptFragment = fragment.querySelectorAll("script")[1];
        const styleFragment = fragment.querySelector("style");
        const templateFragment = fragment.querySelector("template");

        customElements.define(`${prefix}-${componentName}`, class extends HTMLElement {
          static observedAttributes = ["data-state"];
          constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.isAttached = false;
          }
          attributeChangedCallback() {
            if (this.isAttached) {
              this.disconnectedCallback();
              this.connectedCallback();
            }
          }
          connectedCallback() {
            this.hostDataIDs = [];
            this.dataset.id = Math.random().toString(16).substring(2, 8);
            let hostElement = this;
            while (hostElement && hostElement.dataset.id) {
              this.hostDataIDs.push(hostElement.dataset.id);
              hostElement = hostElement.getRootNode().host;
            };
            this.#render();
          }
          disconnectedCallback() {
            while (this.shadowRoot.firstChild) {
              this.shadowRoot.removeChild(this.shadowRoot.firstChild);
            }
          }
          #render() {
            if (templateFragment) {
              this.shadowRoot.appendChild(templateFragment.content.cloneNode(true));
            }
            if (styleFragment) {
              this.shadowRoot.appendChild(styleFragment.cloneNode(true));
            }
            const scriptElement = document.createElement("script");
            scriptElement.setAttribute("type", "module");
            scriptElement.textContent = `
(async function () {
  let shadowDocument = document;
  for (let hostDataID of '${this.hostDataIDs.reverse().toString()}'.split(',')) {
    if (hostDataID != '') {
      shadowDocument = shadowDocument.querySelector('[data-id="' + hostDataID + '"]').shadowRoot;
    }
  }
  let state = undefined;
  if (shadowDocument.host.dataset.state) {
    state = JSON.parse(shadowDocument.host.dataset.state);
  }
  function setState(newState) {
    shadowDocument.host.dataset.state = JSON.stringify(newState);
  }
  ${scriptFragment ? scriptFragment.textContent : ''}
})()`;
            this.shadowRoot.appendChild(scriptElement);
            this.isAttached = true;
          }
        });
      });
  })
})



# ProphezAI/JSonly

There is nothing so complicated that it can't be made simple. JSonly is an advanced, yet minimalistic WebComponents framework featuring most of the functionality of popular JavaScript frameworks, but in a fraction of their complexity. It is built on <a title="Vite" href="https://vitejs.dev"><img height="20" alt="Vitejs-logo" src="https://vitejs.dev/logo.svg"></a> and <a title="SQLite" href="https://sqlite.org/wasm"><img height="20" alt="SQLite-logo" src="https://sqlite.org/images/sqlite370_banner.gif"></a>.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Installation

### Prerequisites

Besides <a title="git" href="https://git-scm.com"><img height="20" alt="GIT-logo" src="https://git-scm.com/images/logo@2x.png"></a> You need to have <a title="NodeJS" href="https://nodejs.org"><img height="20" alt="NodeJS-logo" src="https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg"></a> installed. I recommend using <a title="VSCodium" href="https://vscodium.com"><img height="20" alt="VSCodium-logo" src="https://vscodium.com/img/codium_cnl.svg"></a> for development and <a title="chromium" href="https://www.chromium.org/getting-involved/dev-channel/"><img height="20" alt="Chromium-logo" src="https://www.chromium.org/_assets/icon-chromium-96.png"></a> for testing. However, You can use any editor and browser of choice.

### Running 

Running JSONly is as easy as cloning a repository.

```bash
  git clone https://github.com/ProphezAI/jsonly
  cd jsonly
  npm install
```
and then

```bash
  npm run dev
```

You can then access the app via https://localhost:5173 in your browser.

## Features

- vanilla JavaScript
- built for SinglePageApplications (SPA)
- following W3C standards as recommended by MDN
- support for SingleFileComponents (SFC) in dedicated .html files
- support for nesting WebComponents
- ShadowDOM with support for template, script and style tags
- support for reactive state changes
- support for dynamic imports
- pluggable navigation module using history-driven Component Router
- support for inter-component event handling using BroadcastChannels
- SQLite WebAssembly (WASM) for state management
- support for OriginPrivateFileSystem (OPFS)
- Vite with basicSsl plugin

## Feedback

Please let me know what you think of it and share your improvements with me. If you have any feedback, please reach out to me at robert.meissner@outlook.com

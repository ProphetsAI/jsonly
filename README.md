
# JSonly

There is nothing so complicated that it can't be made simple. JSonly is an advanced, yet minimalistic WebComponents framework featuring most of the functionality of popular JavaScript frameworks, but in a fraction of their complexity and therefore minimizing the effort of refactoring your code.

JSonly is built on <a title="Vite" href="https://vitejs.dev"><img height="20" alt="Vitejs-logo" src="https://vitejs.dev/logo.svg"></a> and <a title="SQLite" href="https://sqlite.org/wasm"><img height="20" alt="SQLite-logo" src="https://sqlite.org/images/sqlite370_banner.gif"></a>.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

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

## Creating

Have you ever thought about creating standard SingleFile-WebComponents in dedicated HTML-files like this? Now it's possible.

![Preview](https://raw.githubusercontent.com/ProphezAI/jsonly/main/docs/SFC.png)

Here are some further guidelines: Use the pre-defined constants
- ```shadowDocument``` to access inner-component elements
- ```state``` to access and ```setState()``` function to modify component-state
- use dynamic ```await import``` to include your own modules

That's basically everything. **Happy coding!**

[Examples](https://github.com/ProphezAI/jsonly/tree/main/webcomponents) can be found in the webcomponents folder. It is recommended to stick to that pattern to keep your code clean, but of course you are free to customize at your own will!

## Component Lifecycle

In case you want some deeper insights: This lifecycle-graph should help you understand how the component in JSonly are working:

![Preview](https://raw.githubusercontent.com/ProphezAI/jsonly/main/docs/components-lifecycle.png)

1. prefetch html components in [index.html](https://github.com/ProphezAI/jsonly/blob/main/index.html)
2. declare your components in the [./webcomponents/index.js](https://github.com/ProphezAI/jsonly/blob/main/webcomponents/index.js) (this will happen automatically in the future)
3. After having created your components you can instantiate them programmatically or by tag-name like in the [animals-view.html](https://github.com/ProphezAI/jsonly/blob/main/webcomponents/animals/animals-view.html) Check out the other webcomponents to see variations.
4. changing the state of a component is possible via the ```state``` constant from inside or by changing the attribute ```data-state``` of the host element.

## Adding a navigation 

Adding a navigation is very easy. You can have an [entire navigation in one single html file](https://github.com/ProphezAI/jsonly/blob/main/webcomponents/home/home-navigation.html) defined as just another component. After having it integrated into your app

![nav integration](https://raw.githubusercontent.com/ProphezAI/jsonly/main/docs/nav-component.png)

it could look like this:

![Navigation example](https://raw.githubusercontent.com/ProphezAI/jsonly/main/docs/nav.png)

Of course you are completely free to customize the themes and make them awesome!

## Feedback

If you still have questions please let me know. Also what you think and share your improvements with me is higly appreciated. If you have any feedback, please reach out to me at robert.meissner@outlook.com

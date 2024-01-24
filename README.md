
# JSonly

There is nothing so complicated that it can't be made simple. JSonly is an advanced, yet minimalistic WebComponents framework featuring most of the functionality of popular JavaScript frameworks, but in a fraction of their complexity and therefore minimizing the effort of refactoring your code.

JSonly is built on <a title="Vite" href="https://vitejs.dev"><img height="20" alt="Vitejs-logo" src="https://vitejs.dev/logo.svg"></a> and <a title="SQLite" href="https://sqlite.org/wasm"><img height="20" alt="SQLite-logo" src="https://sqlite.org/images/sqlite370_banner.gif"></a>.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Features

- vanilla JavaScript
- built for SinglePageApplications (SPAs)
- following W3C standards and MDN-recommended best practices with just a few hacks to accomplish things where people claim: *"This is impossible with WebComponents"*
- support for SingleFileComponents (SFCs) in dedicated .html files
- support for use of script-returned functions in the templates (script-API)
- support for nesting WebComponents
- ShadowDOM with support for template, script and style tags
- support for reactive state changes
- support for dynamic imports
- offline capabilities
- pluggable navigation module using history-driven Component Router
- support for inter-component event handling using BroadcastChannels
- SQLite WebAssembly (WASM) for global state management
- support for OriginPrivateFileSystem (OPFS), your data stays private
- support for realtime P2P connections via WebRTC
- Vite with basicSsl plugin
- basic functionality in under <100LOC

## Installation

### Prerequisites

Besides <a title="git" href="https://git-scm.com"><img height="20" alt="GIT-logo" src="https://git-scm.com/images/logo@2x.png"></a> You need to have <a title="NodeJS" href="https://nodejs.org"><img height="20" alt="NodeJS-logo" src="https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg"></a> installed. I recommend using <a title="VSCodium" href="https://vscodium.com"><img height="20" alt="VSCodium-logo" src="https://vscodium.com/img/codium_cnl.svg"></a> for development and <a title="chromium" href="https://www.chromium.org/getting-involved/dev-channel/"><img height="20" alt="Chromium-logo" src="https://www.chromium.org/_assets/icon-chromium-96.png"></a> for testing. However, You can use any editor and browser of choice.

### Running 

Running JSonly is as easy as cloning a repository.

```bash
  git clone https://github.com/ProphetsAI/jsonly
  cd jsonly
  npm install
```
and then

```bash
  npm run dev
```

You can then access the app via https://localhost:5173 in your browser.

## Creating

Have you ever thought about creating standard SingleFile-WebComponents in dedicated HTML-files? Now it's possible to use ```script```, ```style``` and ```template``` fragments and load them dynamically.

![Preview](https://raw.githubusercontent.com/ProphetsAI/jsonly/main/docs/SFC.png)

That's basically everything. **Happy coding!**

[Examples](https://github.com/ProphetsAI/jsonly/tree/main/webcomponents) can be found in the webcomponents folder. It is recommended to stick to that pattern to keep your code clean, but of course you are free to customize at your own will!

## API description and restrictions

Here are some further guidelines. You can use the following pre-defined constants in a SFC. You have access to the following functions:

- use dynamic ```await import``` to include your own modules
- ```shadowDocument``` is the private scope DOM of the SFC to access inner-component elements. You can use it just like the default DOM ```document```, for instance ```shadowDocument.getElementById(...)```.
- ```$``` is a shorthand for ```querySelector``` on the shadowDocument. You can use it to get a HTMLElement like ```const animalform = $('#animalform');``` and then access underlying HTMLElements via ```animalform.$('#animal').value```
- ```$$``` is a shorthand for ```querySelectorAll``` and you can use it accordingly to ```$```, standalone (on shadowDocument) or on a HTMLElement.
- ```refresh``` is refreshing the element when called on the HTMLElement and refreshing the uppermost HTMLElement when called standalone.
- Use ```getState``` to get the component state as a JSON object
- ```setState(string)``` takes a string and modifies the component-state
- You have access to ````this.script``` in the template. You have access to all functions that are returned by the script-API with ```return {functionA, functionB}```
- You will have to check ```if (getDOM(context)) {``` on WebComponents that are going to be deleted to prevent script execution of detached elements.

## Component Lifecycle

In case you want some deeper insights: This lifecycle-graph should help you understand how the component in JSonly are working:

![Preview](https://raw.githubusercontent.com/ProphetsAI/jsonly/main/docs/components-lifecycle.png)

1. prefetch html components in [index.html](https://github.com/ProphetsAI/jsonly/blob/main/index.html)
2. declare your webcomponents in the [./webcomponents/index.js](https://github.com/ProphetsAI/jsonly/blob/main/webcomponents/index.js) (this happens automatically when you run ```npm run dev```)
3. After having created your components you can instantiate them programmatically or by tag-name like in the [animals-view.html](https://github.com/ProphetsAI/jsonly/blob/main/webcomponents/animals/animals-view.html) Check out the other webcomponents to see variations.
4. changing the state of a component is possible via the ```state``` constant from inside or by changing the attribute ```data-state``` of the host element.

## Adding a navigation 

Adding a navigation is very easy. You can have an [entire navigation in one single html file](https://github.com/ProphetsAI/jsonly/blob/main/webcomponents/home/home-navigation.html) defined as just another component. After having it integrated into your app

![nav integration](https://raw.githubusercontent.com/ProphetsAI/jsonly/main/docs/nav-component.png)

it could look like this:

![Navigation example](https://raw.githubusercontent.com/ProphetsAI/jsonly/main/docs/nav.png)

Of course you are completely free to customize the themes and make them awesome!

## Feedback

If you still have questions please let me know. Also what you think and share your improvements with me is higly appreciated. If you have any feedback, please reach out to me at @prophets_ai

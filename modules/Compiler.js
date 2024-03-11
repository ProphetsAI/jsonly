const { useStore } = await import("../stores/Global");

function startsWithUpperCase(word) {
  return word[0] === word[0].toUpperCase();
}

async function replaceWithStore(storePath, hostElement) {
  if (startsWithUpperCase(storePath)) {
    const path = storePath.split(".");
    if (path.length > 1) {
      const StoreName = "../stores/".concat(path[0], ".js");
      const storeModule = await import(/* @vite-ignore */ StoreName);
      const store = useStore(path[0].toLowerCase(), storeModule['init']());

      const methodCall = path[1].split("(");
      if (methodCall.length > 1) {
        const method = methodCall[0];
        if (method.startsWith("is")) {
          const target = method.slice(2).toLowerCase();
          store.subscribe(target, hostElement.hostDataIDs);
        } else if (method.startsWith("has")) {
          const target = method.slice(3).toLowerCase();
          store.subscribe(target, hostElement.hostDataIDs);
        } else {
          console.log("unknown error");
        }
        const lastPart = methodCall[1].split(")");
        if (lastPart.length == 2) {
          if (lastPart[1] == '') {
            const argument = lastPart[0];
            const arg = argument.slice(1, -1);
            return storeModule[method](arg);
          } else {
            throw new Error(`Syntax error at ${storePath}`);
          }
        } else {
          throw new Error(`Syntax error at ${storePath}`);
        }
      } else {
        throw new Error(`Syntax error at ${storePath}`);
      }
    } else {
      // TODO: "${Tabs?}"
      throw new Error(`Syntax error at ${storePath}`);
    }
  } else {
    if (storePath.includes('(') || storePath.includes(')')) {
      throw new Error(`Syntax error at ${storePath}. Use capital letter for store when accessing the Module.`);
    }
    const path = storePath.split(".");
    const store = useStore(path[0]);
    // TODO Make sure the target exists.
    if (path[1]) store.subscribe(path[1], hostElement.hostDataIDs);
    return store.get(path[1]) ?? undefined;
  }
}

async function replacer(dollarString, hostElement) {
  const key = dollarString.slice(2, -1);
  const sides = key.split("?"); // TODO: Test with multiple questionmarks
  if (sides.length > 1) {
    const replacedCondition = await replaceWithStore(sides[0], hostElement);
    const returnValues = sides[1].split(":");
    if (replacedCondition) {
      return returnValues[0];
    } else {
      if (returnValues.length > 1) {
        return returnValues[1];
      } else {
        return '';
      }
    }
  } else {
    return await replaceWithStore(sides[0], hostElement);
  }
}

export async function compile(templateFragment, hostElement) {
  let htmlString = templateFragment.innerHTML;
  const dollars = htmlString.match(/\$\{(.*?)\}/g);
  if (dollars) {
    for (let dollarString of dollars) {
      const replacement = await replacer(dollarString, hostElement);
      htmlString = htmlString.replace(dollarString, replacement);
    }
  }
  return document.createRange().createContextualFragment(htmlString);
}

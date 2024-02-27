const { useStore } = await import("../stores/Global");

export function compile(templateFragment, hostElement) {
  const serializer = new XMLSerializer();
  const templateClone = templateFragment.content.cloneNode(true);
  const htmlString = serializer.serializeToString(templateClone);
  let templateLiteral = htmlString.replace(/\$\{(.*?)\}/g, (match, key) => {
    if (key.includes("?")) {
      const sides = key.split("?");
      const leftSide = sides[0].split(".");
      const rightSide = sides[1].split(":");
      const store = useStore(leftSide[0]);
      if (leftSide[1]) store.subscribe(leftSide[1], hostElement.hostDataIDs);
      if (store.get(leftSide[1])) { return rightSide[0] ? rightSide[0] : ''; } else { return rightSide[1] ? rightSide[1] : ''; }
    } else {
      const path = key.split(".");
      const store = useStore(path[0]);
      if (path[1]) {
        store.subscribe(path[1], hostElement.hostDataIDs);
      }
      return store.get([path[1]]) ?? undefined;
    }
  });
  return document.createRange().createContextualFragment(templateLiteral);
}

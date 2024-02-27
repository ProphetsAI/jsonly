const { useStore } = await import("../stores/Global");

export function compile(templateFragment, hostElement) {
  const serializer = new XMLSerializer();
  const templateClone = templateFragment.content.cloneNode(true);
  const htmlString = serializer.serializeToString(templateClone);
  let dollarsReplaced = htmlString.replace(/\$\{(.*?)\}/g, (match, key) => {
    const path = key.split(".");
    const store = useStore(path[0]);
    if (path[1]) {
      store.subscribe(path[1], hostElement.hostDataIDs);
    }
    return store.get([path[1]]) ?? undefined;
  });
  const questionmarksReplaced = dollarsReplaced.replace(/\?\{(.*?)\}/g, (match, key) => {
    const sides = key.split("?:");
    const leftSide = sides[0].split(".");
    const rightSide = sides[1];
    const store = useStore(leftSide[0]);
    if (leftSide[1]) {
      store.subscribe(leftSide[1], hostElement.hostDataIDs);
    }
    const value = store.get(leftSide[1]);
    if (value) { return rightSide; }
    return "";
  });
  const exclamationmarksReplaced = questionmarksReplaced.replace(/\!\{(.*?)\}/g, (match, key) => {
    const sides = key.split(":");
    const leftSide = sides[0].split(".");
    const rightSide = sides[1];
    const store = useStore(leftSide[0]);
    if (leftSide[1]) {
      store.subscribe(leftSide[1], hostElement.hostDataIDs);
    }
    const value = store.get(leftSide[1]);
    if (!value) { return rightSide; }
    return "";
  })
  return document.createRange().createContextualFragment(exclamationmarksReplaced);
}

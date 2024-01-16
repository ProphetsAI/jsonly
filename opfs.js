var root = await navigator.storage.getDirectory();
let onlyjs = await root.getFileHandle("jsonly.sqlite3");
await onlyjs.remove();
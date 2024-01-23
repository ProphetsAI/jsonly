import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { log, error } from '../../modules/Logger.js'

let dbInstance = null;
let sqlite3 = null;

function getDB() {
  return new Promise((resolve) => {
    const checkAgain = function () {
      if (dbInstance) resolve(dbInstance); else setTimeout(checkAgain, 0);
    }
    checkAgain();
  });
}

sqlite3InitModule({
  print: log,
  printErr: error,
}).then((sqlite) => {
  sqlite3 = sqlite;
  try {
    log('Running SQLite3 version', sqlite3.version.libVersion);
    if ('opfs' in sqlite3) dbInstance = new sqlite3.oo1.OpfsDb('/jsonly.sqlite3', 'c'); else throw new Error("OPFS is not available.");
    log('OPFS is available, created persisted database at', dbInstance.filename);
  } catch (err) {
    error(err.name, err.message);
  }
});

onmessage = async function dispatch({ data }) {
  const db = await getDB();
  switch (data.type) {
    case "upload":
      try {
        sqlite3.oo1.OpfsDb.importDb('jsonly.sqlite3', data.buffer);
        postMessage("New DB imported as jsonly.sqlite3. (" + data.buffer.byteLength + ") Bytes");
      } catch (e) {
        error(e);
      }
      break;
    case "download":
      try {
        const byteArray = sqlite3.capi.sqlite3_js_db_export(db);
        const blob = new Blob([byteArray.buffer], { type: "application/x-sqlite3" });
        postMessage(blob); // send the database Blob to the API
      } catch (e) {
        if (e.message.indexOf("SQLITE_NOMEM") != -1)
          postMessage({ type: "application/x-sqlite3", error: "SQLITE_NOMEM" });
        else
          error(e);
      }
      break;
    case "exec":
      log(data.sql);
      const result = db.exec({ sql: data.sql, returnValue: data.returnValue });
      postMessage({ result, type: "application/json", datasetID: data.datasetID });
      break;
    default:
      log(data)
  }
}
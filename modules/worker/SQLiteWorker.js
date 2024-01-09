import { log, error } from '../Logger.js'
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let dbInstance = null;
let sqlite3 = null;

sqlite3InitModule({
  print: log,
  printErr: error,
}).then((sqlite) => {
  sqlite3 = sqlite;
  try {
    log('Running SQLite3 version', sqlite3.version.libVersion);
    if ('opfs' in sqlite3) {
      dbInstance = new sqlite3.oo1.OpfsDb('/jsonly.sqlite3');
      log('OPFS is available, created persisted database at', dbInstance.filename);
    } else {
      throw new Error("OPFS is not available.");
    }
  } catch (err) {
    error(err.name, err.message);
  }
});

onmessage = function dispatch({ data }) {
  switch (data.type) {
    case "upload":
      try {
        sqlite3.oo1.OpfsDb.importDb('jsonly.sqlite3', data.buffer);
      } catch (e) {
        error(e);
      }
      break;
    case "download":
      const byteArray = sqlite3.capi.sqlite3_js_db_export(dbInstance);
      const blob = new Blob([byteArray.buffer], { type: "application/x-sqlite3" });
      postMessage(blob);
      break;
    case "get":
      getAnimals();
      break;
    case "post":
      insertAnimal(data.animal);
      break;
    case "exec":
      console.log("From SQLiteWorker: dbInstance is ", dbInstance)
      const resultRows = dbInstance.exec({ sql: data.sql, returnValue: data.returnValue });
      console.log("resultRows", resultRows);
      return resultRows;
    default:
      log(data)
  }
}
import { log, error } from '../Logger.js';
import { use } from '../Helper.js';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let db = null;
let sqlite3 = null;

sqlite3InitModule({
  print: log,
  printErr: error,
}).then((sqlite) => {
  sqlite3 = sqlite;
  try {
    log('Running SQLite3 version', sqlite3.version.libVersion);
    if ('opfs' in sqlite3) {
      db = new sqlite3.oo1.OpfsDb('/jsonly.sqlite3');
      log('OPFS is available, created persisted database at', db.filename);
    } else {
      db = new sqlite3.oo1.DB('/jsonly.sqlite3', 'ct');
      log('OPFS is not available, created transient database', db.filename);
    }
    // createTables();
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
      const byteArray = sqlite3.capi.sqlite3_js_db_export(db);
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
      console.log("executing", data.sql);

      use(db)
        .then(db => {
          console.log("db", db);
          return db.exec({ sql: data.sql, returnValue: data.returnValue });
        })
        .then(result => {
          console.log("result", result);
          return result;
        });
    // const resultRows = db.exec(["SELECT * FROM animals;"])
    // console.log("resultRows", resultRows)
    // return result;
    // break;
    default:
      log(data)
  }
}
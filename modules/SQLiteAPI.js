import { log, error } from './Logger';

let worker = null;
let returnValues = {};
if (window.Worker && !worker) {
  worker = new Worker("./modules/worker/SQLiteWorker.js", { type: 'module' });
  // FROM worker thread
  if (worker) worker.onmessage = function (event) {
    const data = event.data;
    switch (data.type) {
      case "application/x-sqlite3": // db download ready
        const downloadChannel = new BroadcastChannel("download_channel");
        downloadChannel.postMessage(data);
        downloadChannel.close();
        break;
      case "application/json":
        if (data.datasetID) {
          returnValues[data.datasetID] = data.result;
        }
        break;
      default:
        log("response from worker:", data);
    }
  }
} else {
  error('Your browser doesn\'t support web workers.');
}

// TO worker thread

export async function executeQuery({ datasetID, text, values }) {
  if (datasetID) {
    var queryString = text;
    if (values && queryString.indexOf("$") != -1) values.forEach(function replacePlaceholder(item, index) { queryString = queryString.replace("$" + (index + 1), `'${item}'`); });
    worker.postMessage({ datasetID, type: "exec", sql: queryString, returnValue: "resultRows" });
    return new Promise((resolve) => {
      const checkAgain = function () {
        if (returnValues[datasetID]) {
          const returnValue = structuredClone(returnValues[datasetID]);
          delete returnValues[datasetID];
          resolve(returnValue);
        } else
          setTimeout(checkAgain, 0);
      }
      checkAgain();
    });
  }
}
export function executeQuerySync({ text, values }) {
  var queryString = text;
  if (values && queryString.indexOf("$") === -1) values.forEach(function replacePlaceholder(item, index) { queryString = queryString.replace("$" + (index + 1), `'${item}'`); });
  worker.postMessage({ type: "exec", sql: queryString, returnValue: "resultRows" });
}
export function uploadSync(arrayBuffer) {
  worker.postMessage({ "type": "upload", "buffer": arrayBuffer });
}
export function downloadSync() {
  worker.postMessage({ "type": "download" });
}


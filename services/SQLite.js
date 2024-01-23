import { log, error } from '../modules/Logger';

var SQLite = (function () {
  var worker = null;
  let returnValues = {};

  function init() {
    var initWorker = new Worker("./services/worker/SQLiteWorker.js", { type: 'module' });
    if (initWorker) {
      initWorker.onmessage = function (event) {
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
      return initWorker;
    }
    return null;
  }

  function getInstance() {
    if (window.Worker) {
      if (!worker) {
        worker = init();
      }
      return worker;
    } else {
      error('Your browser doesn\'t support web workers.');
    }
  }
  async function executeQuery({ datasetID, text, values }) {
    if (datasetID) {
      var queryString = text;
      if (values && queryString.indexOf("$") != -1) values.forEach(function replacePlaceholder(item, index) { queryString = queryString.replace("$" + (index + 1), `'${item}'`); });
      getInstance().postMessage({ datasetID, type: "exec", sql: queryString, returnValue: "resultRows" });
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
  function executeQuerySync({ text, values }) {
    var queryString = text;
    if (values && queryString.indexOf("$") === -1) values.forEach(function replacePlaceholder(item, index) { queryString = queryString.replace("$" + (index + 1), `'${item}'`); });
    getInstance().postMessage({ type: "exec", sql: queryString, returnValue: "resultRows" });
  }
  function uploadSync(arrayBuffer) {
    getInstance().postMessage({ "type": "upload", "buffer": arrayBuffer });
  }
  function downloadSync() {
    getInstance().postMessage({ "type": "download" });
  }

  return {
    executeQuery,
    executeQuerySync,
    uploadSync,
    downloadSync
  };
})();

export { SQLite };

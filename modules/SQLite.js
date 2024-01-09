import { error } from './Logger';

let worker = null;
if (window.Worker) {
  worker = new Worker("./modules/worker/SQLiteWorker.js", { type: 'module' });
  if (worker) {
    worker.onmessage = function (event) {
      event = event.data;
      switch (event.type) {
        case "application/x-sqlite3": // db download ready
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = window.URL.createObjectURL(e.data);
          a.download = ("jsonly.sqlite3");
          a.addEventListener('click', function () {
            setTimeout(function () {
              window.URL.revokeObjectURL(a.href);
              a.remove();
            }, 500);
          });
          a.click();
          break;
        default:
          console.log("SQLite onmessage")
          // result rows
          const bc = new BroadcastChannel("result_channel");
          bc.postMessage(e.data);
          bc.close();
      }
    }
  }
} else {
  error('Your browser doesn\'t support web workers.');
}

export function validateAndPost(json) {
  worker.postMessage(json);
}

export async function executeQuery({ text, values }) {
  var queryString = text;
  if (values) {
    values.forEach(function replacePlaceholder(item, index) {
      queryString = queryString.replace("$" + (index + 1), `'${item}'`);
    });
  }
  worker.postMessage({ type: "exec", sql: queryString, returnValue: "resultRows" })
}

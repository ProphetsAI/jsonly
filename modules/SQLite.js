import { error } from './Logger.js';
import { use } from './Helper.js'

let worker = null;
if (window.Worker) {
  worker = new Worker("./modules/worker/SQLiteWorker.js", { type: 'module' });
  if (worker) {
    worker.onmessage = function (e) {
      if (e.data.type == "application/x-sqlite3") {
        // db download ready
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
      } else {
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
  use(worker).then(worker => worker.postMessage(json));
}

export async function executeQuery({ text, values }) {
  var queryString = text;
  if (values) {
    values.forEach(function replacePlaceholder(item, index) {
      queryString = queryString.replace("$" + (index + 1), `'${item}'`);
    });
  }
  use(worker).then(worker => worker.postMessage({ type: "exec", sql: queryString, returnValue: "resultRows" }));
}

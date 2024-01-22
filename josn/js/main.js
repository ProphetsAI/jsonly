// SQLite

const sqliteWorker = new Worker('./js/jswasm/worker.js')

// Eventbus
// const eventbus = new BroadcastChannel("eventbus");
// eventbus.onmessage = (event) => {
//   console.log(event);
//   sqliteWorker.postMessage(event.data)
// };

function sendToBroadcast(e) {
  console.log(e);
  // eventbus.postMessage("This is a test message.");
}










// // workflow




// // Attach



// shadowDocument.onbeforeunload = function beforeUnloaded() {
//   console.log("closing data channel")
//   rtcConnection.dataChannel.close();
// }
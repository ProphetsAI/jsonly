import { log, error } from '../modules/Logger';
const { insertAnimal } = await import('../apis/Animals.js');

var WebRTC = (function () {
  var rtcConnection = null;

  function init() {
    log('initializing RTCPeerConnection...');
    var rtcConnection = new RTCPeerConnection({ iceServers: [] });
    rtcConnection.onicecandidate = function rtcIceCandidate(event) {
      log(JSON.stringify(rtcConnection.localDescription));
    }
    return rtcConnection;
  }

  function getInstance() {
    if (!rtcConnection) {
      rtcConnection = init();
    }
    return rtcConnection;
  }

  function messageReceived(event) {
    insertAnimal(event.data);
  };

  function dataChannelClosed(event) {
    log("Closing rtcConnection...")
    rtcConnection.close();
  }

  function initializeWithOffer() {
    const instance = getInstance();
    const dataChannel = instance.createDataChannel("rtcChannel");
    dataChannel.onopen = function dataChannelOpened(event) {
      log("Data channel opened.");
    }
    dataChannel.onmessage = messageReceived;
    dataChannel.onclose = dataChannelClosed;
    instance.dataChannel = dataChannel;
    instance.createOffer()
      .then((offer) => instance.setLocalDescription(offer))
      .then((e) => log("Offer created."));
  }

  function initializeWithAnswer(sdp) {
    const instance = getInstance();
    instance.ondatachannel = function dataChannelOffered(event) {
      instance.dataChannel = event.channel;
      instance.dataChannel.onopen = function dataChannelOpened(event) {
        log("Remote connection opened.");
      }
      instance.dataChannel.onmessage = messageReceived;
      instance.dataChannel.onclose = dataChannelClosed;
    }
    console.log("initializin answer...", sdp)
    setSDP(sdp);
  }

  function setSDP(sdp) {
    const instance = getInstance();
    // const sdp = JSON.parse($("#app").value);
    switch (sdp.type) {
      case "offer":
        instance.setRemoteDescription(sdp)
          .then((a) => log("Offer set."));
        instance.createAnswer()
          .then((answer) => instance.setLocalDescription(answer))
          .then((answer) => log("Answer created."));
        break;
      case "answer":
        instance.setRemoteDescription(sdp)
          .then((answer) => log("Anwer set."));
        break;
      default:
        log("Unhandeled message: ", sdp);
    }
  }

  function sendToRemote(json) {
    const instance = getInstance();
    log("sending to remote")
    try {
      // const json = JSON.parse($("#app").value);
      // TODO: further verification
      instance.dataChannel.send(JSON.stringify(json));
    } catch (e) {
      error(e)
    }
  }

  function close() {
    const instance = getInstance();
    instance.dataChannel.close();
  }

  return {
    initializeWithOffer,
    initializeWithAnswer,
    setSDP,
    sendToRemote,
    close
  };
})();

export { WebRTC };

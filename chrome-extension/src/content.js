// contents script

var port = chrome.runtime.connect();

window.addEventListener("message",function(event){
    console.log(event);
    if (event.source != window) return;
    if (event.data.type == 'getStreamId') {
        port.postMessage('getStreamId', function(response){
            console.log(response);
        });
    }
},false);

port.onMessage.addListener(function(request, sender, sendResponse){
    window.postMessage({type: 'gotStreamId', streamid: request.streamid},'*');
});

var elt = document.createElement("script");
elt.innerHTML = "window.ScreenShareExtentionExists = true;";
document.body.appendChild(elt);
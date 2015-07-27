// background script

chrome.runtime.onConnect.addListener(function(port){
    port.onMessage.addListener(function(message){
        if(message == 'getStreamId'){
            chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'],port.sender.tab, function(streamId){
                console.log(streamId);
                port.postMessage({streamid:streamId});
            });
        }
    });
});
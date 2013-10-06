chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create('index.html', {bounds: {width: 1040, height: 600}}, function(win) {
    win.contentWindow.launchData = launchData;
  });
});
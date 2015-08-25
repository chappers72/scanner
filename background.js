/**
 * Created by StevenChapman on 19/05/15.
 */
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('window.html', {
        'bounds': {
            'width': 1980,
            'height': 1024
        }
    });
});

chrome.commands.onCommand.addListener(function(command) {
    console.log(command)
    if (command == "Ctrl+M") {

        var value = chrome.accessibilityFeatures.virtualKeyboard.get({'incognito': false}, function (callback) {
            console.log(callback);
        });
    }
});
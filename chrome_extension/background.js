(function () {

    var storage = chrome.storage;

    function loadWebsites(callback) {
        var websites;

        storage.local.get(["defaultWebsites", "customWebsites"], function (items) {
            if (items.defaultWebsites === undefined) {
                websites =
                    [
                        {"url": "facebook.com", "on": true},
                        {"url": "twitter.com", "on": true},
                        {"url": "linkedin.com", "on": true},
                        {"url": "instagram.com", "on": true},
                        {"url": "youtube.com", "on": true},
                    ];

                storage.local.set({"defaultWebsites": websites});
            } else {
                websites = items.defaultWebsites;
            }

            if (items.customWebsites === undefined) {
                storage.local.set({"customWebsites": []});
            } else {
                websites = websites.concat(items.customWebsites);
            }

            if (typeof callback === "function") {
                callback(websites);
            }
        });
    }

    function urlContains(url, keywords) {
        var result = false;

        for (var index in keywords) {
            if (keywords[index].on && url.indexOf(keywords[index].url) != -1) {
                result = true;
                break;
            }
        }

        return result;
    }

    function analyzeUrl(details) {
        storage.local.get("on", function (item) {
            if (item.on === true) {

                loadWebsites(function (websites) {
                    if (details.frameId === 0 && urlContains(details.url, websites)) {
                        var id = details.tabId;

                        chrome.tabs.update(id, {"url": "https://camino.instructure.com/"});

                        storage.local.get("blocked", function (item) {
                            storage.local.set({"blocked": item.blocked + 1});
                            console.log(item);
                        });
                    }
                });
            }
        });
    }

    chrome.webNavigation.onCommitted.addListener(analyzeUrl);

    storage.local.get("on", function (item) {
        if (item.on === undefined) {
            storage.local.set({"on": false, "blocked": 0});
        }
    });

    loadWebsites();
})();
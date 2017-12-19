chrome.browserAction.onClicked.addListener(() => {
    fetch("http://vilik.in:8888/nextEpisode")
        .then(res => res.json())
        .then(res => {
            const episode = res.episode;

            chrome.tabs.create({
                url: "https://ww4.gogoanime.io/naruto-shippuden-episode-" + episode
            });
        })
        .catch(err => {
            alert("Error occurred: " + err)
        });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const url = tab.url;

        if (url.match(/^https:\/\/ww4\.gogoanime\.io\/naruto-shippuden-episode-[0-9]+$/)) {
            const episode = parseInt(url.split("naruto-shippuden-episode-")[1]);

            let headers = new Headers();
            headers.append("Content-Type", "application/json");

            fetch("http://vilik.in:8888/setWatched", {
                method: "POST",
                headers,
                body: JSON.stringify({episode})
            }).then(res => res.json()).then(res => {
                console.log("Successfully updated latest episode");
            }).catch(err => {
                alert("Error occurred updating latest episode: " + err);
            });
        }
    }
});


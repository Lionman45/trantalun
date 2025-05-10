const proxyURL = "https://prostudyhabits.co/uv.html?site=";
let currentUrl = "";
let historyStack = [];

function goToPage(url = null) {
    const input = document.getElementById("site");
    const site = url || input.value.trim();

    if (site !== "") {
        currentUrl = site;
        historyStack.push(site);
        document.getElementById("iF").src = proxyURL + site;
        updateInputToCurrentUrl();
        }
}

function goBack() {
    if (historyStack.length > 1) {
        historyStack.pop(); // Remove current
        const previousUrl = historyStack[historyStack.length - 1];
        goToPage(previousUrl);
    }
}

function refreshIframe() {
    goToPage(currentUrl);
}

function updateInputToCurrentUrl() {
    const iframe = document.getElementById("iF");
    if (iframe) {
        document.getElementById("site").value = currentUrl;
    }
}

document.getElementById("site").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        goToPage();
    }
});

function openFullscreen() {
    const elem = document.getElementById("sitePage");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

const proxyURL = "https://prostudyhabits.co/uv.html?site=";

let tabs = [];
let currentTabIndex = -1;

function cloak() {
    var win = window.open();
    var url = "https://trantalun.nwpa.com.au";
    var iframe = win.document.createElement('iframe');
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.src = url;
    win.document.body.appendChild(iframe);
}

function createTab(url = "") {
    const tab = {
        url,
        iframe: document.createElement("iframe")
    };

    tab.iframe.className = "siteFrame";
    tab.iframe.src = url ? proxyURL + url : "";
    tab.iframe.style.display = "none";
    tab.iframe.style.width = "100%";
    tab.iframe.style.height = "100%";
    tab.iframe.style.border = "none";
    tab.iframe.style.position = "absolute";
    tab.iframe.style.top = "0";
    tab.iframe.style.left = "0";

    document.getElementById("sitePage").appendChild(tab.iframe);
    tabs.push(tab);
    const index = tabs.length - 1;

    const tabEl = document.createElement("div");
    tabEl.className = "tab";
    tabEl.innerHTML = `
        <span>${url ? url.replace(/^https?:\/\//, "") : "New Tab"}</span>
        <span class="close" onclick="closeTab(${index}, event)">×</span>
    `;
    tabEl.onclick = () => selectTab(index);
    document.getElementById("tabBar").insertBefore(tabEl, document.getElementById("addTabBtn"));
}

function selectTab(index) {
    if (currentTabIndex !== -1) {
        tabs[currentTabIndex].iframe.style.display = "none";
        document.querySelectorAll(".tab")[currentTabIndex].classList.remove("active");
    }

    currentTabIndex = index;
    const tab = tabs[index];
    tab.iframe.style.display = "block";
    document.querySelectorAll(".tab")[index].classList.add("active");
    document.getElementById("site").value = tab.url;
}

function closeTab(index, event) {
    event.stopPropagation();
    const wasActive = index === currentTabIndex;

    tabs[index].iframe.remove();
    tabs.splice(index, 1);
    document.querySelectorAll(".tab")[index].remove();

    if (wasActive) {
        if (tabs.length > 0) {
            selectTab(Math.max(0, index - 1));
        } else {
            currentTabIndex = -1;
            document.getElementById("site").value = "";
        }
    } else if (index < currentTabIndex) {
        currentTabIndex--;
    }
}

function goToPage(url) {
    const site = url.trim();
    if (site !== "" && currentTabIndex !== -1) {
        const fullUrl = proxyURL + site;
        const tab = tabs[currentTabIndex];
        tab.url = site;
        tab.iframe.src = fullUrl;

        const tabEl = document.querySelectorAll(".tab")[currentTabIndex];
        tabEl.querySelector("span").innerText = site.replace(/^https?:\/\//, "");
    }
}

function goBack() {
    if (currentTabIndex !== -1) {
        tabs[currentTabIndex].iframe.contentWindow.history.back();
    }
}

function refreshIframe() {
    if (currentTabIndex !== -1) {
        tabs[currentTabIndex].iframe.src = proxyURL + tabs[currentTabIndex].url;
    }
}

function updateInputToCurrentUrl() {
    if (currentTabIndex !== -1) {
        document.getElementById("site").value = tabs[currentTabIndex].url;
    }
}

document.getElementById("site").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        goToPage(document.getElementById("site").value);
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

function init() {
    // Remove any hardcoded iframe (like <iframe id="iF">)
    const existing = document.querySelector("iframe#iF");
    if (existing) existing.remove();

    createTab(); // Create first tab
    selectTab(0);
}

document.addEventListener("DOMContentLoaded", init);

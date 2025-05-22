const proxyURL = "https://prostudyhabits.co/uv.html?site=";

let tabs = [];
let currentTabIndex = -1;

function createTab(url = "") {
    const tab = {
        url,
        iframe: document.createElement("iframe")
    };
    tab.iframe.src = url ? proxyURL + url : "";
    tab.iframe.className = "siteFrame";
    tab.iframe.style.display = "none";
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

    // Remove iframe
    tabs[index].iframe.remove();
    tabs.splice(index, 1);

    // Remove tab element
    document.querySelectorAll(".tab")[index].remove();

    // Recalculate active tab
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

function goToPage(url = null) {
    const input = document.getElementById("site");
    const site = url || input.value.trim();

    if (site !== "" && currentTabIndex !== -1) {
        const fullUrl = proxyURL + site;
        const tab = tabs[currentTabIndex];
        tab.url = site;
        tab.iframe.src = fullUrl; // force iframe to load new page

        // Update the tab label
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

function init() {
    createTab(); // Create initial tab
    selectTab(0); // Select it immediately
}

document.addEventListener("DOMContentLoaded", init);

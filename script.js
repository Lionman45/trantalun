const proxyURL = "https://gt.nwpa.com.au/uv.html?site=";

let tabs = [];
let currentTabIndex = -1;

const themes = {
  midnight: {
    "--bg-gradient": "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
    "--tab-bg": "#1a1a2e",
    "--tab-hover": "#16213e",
    "--tab-active": "#0f3460",
    "--tabbar-bg": "linear-gradient(to right, #1a1a2e, #16213e)",
    "--input-bg": "#1a1a2e",
    "--btn-bg": "#1a1a2e",
    "--text-color": "#ffffff"
  },
  classic: {
    "--bg-gradient": "linear-gradient(to right, #4CAF50, #008CBA)",
    "--tab-bg": "#2e4d2f",
    "--tab-hover": "#3a5c3b",
    "--tab-active": "#4CAF50",
    "--tabbar-bg": "linear-gradient(to right, #1A3C1B, #002734)",
    "--input-bg": "linear-gradient(to right, #347836, #004e68)",
    "--btn-bg": "linear-gradient(to right, #347836, #004e68)",
    "--text-color": "#ffffff"
  },
  dark: {
    "--bg-gradient": "#121212",
    "--tab-bg": "#1f1f1f",
    "--tab-hover": "#2a2a2a",
    "--tab-active": "#333333",
    "--tabbar-bg": "#1a1a1a",
    "--input-bg": "#222222",
    "--btn-bg": "#222222",
    "--text-color": "#e0e0e0"
  },
  light: {
    "--bg-gradient": "#f5f5f5",
    "--tab-bg": "#e0e0e0",
    "--tab-hover": "#d5d5d5",
    "--tab-active": "#cccccc",
    "--tabbar-bg": "#eeeeee",
    "--input-bg": "#ffffff",
    "--btn-bg": "#ffffff",
    "--text-color": "#000000"
  },
  rainbow: {
    "--bg-gradient": "linear-gradient(270deg, red, orange, yellow, green, blue, indigo, violet)",
    "--tab-bg": "#444",
    "--tab-hover": "#555",
    "--tab-active": "#666",
    "--tabbar-bg": "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
    "--input-bg": "#333",
    "--btn-bg": "#333",
    "--text-color": "#ffffff"
  },
  forest: {
    "--bg-gradient": "linear-gradient(to right, #0b6623, #228b22, #006400)",
    "--tab-bg": "#145214",
    "--tab-hover": "#1b6e1b",
    "--tab-active": "#228b22",
    "--tabbar-bg": "linear-gradient(to right, #0b6623, #145214)",
    "--input-bg": "#145214",
    "--btn-bg": "#145214",
    "--text-color": "#ffffff"
  }
};

function setTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  for (const key in theme) {
    document.documentElement.style.setProperty(key, theme[key]);
  }
}

function openSettings() {
  document.getElementById("settingsOverlay").style.display = "flex";
}
function closeSettings() {
  document.getElementById("settingsOverlay").style.display = "none";
}

document.getElementById("settingsBtn").addEventListener("click", openSettings);

function cloak() {
    var win = window.open();
    var url = "https://classroom.nwpa.com.au";
    var iframe = win.document.createElement('iframe');
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.src = url;
    win.document.body.style.margin = "0";
    win.document.body.style.padding = "0";
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
    tab.iframe.style.height = "calc(100vh - 60px - 42px)";
    tab.iframe.style.border = "none";
    tab.iframe.style.position = "absolute";
    tab.iframe.style.top = "102px";
    tab.iframe.style.left = "0";

    tab.iframe.onload = () => {
        try {
            const doc = tab.iframe.contentDocument || tab.iframe.contentWindow.document;
            if (doc) {
                doc.body.style.margin = "0";
                doc.body.style.padding = "0";
                doc.documentElement.style.margin = "0";
                doc.documentElement.style.padding = "0";
            }
        } catch (e) {}
    };

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

async function getPageTitle(url) {
    try {
        const response = await fetch("https://" + url);
        const text = await response.text();
        const match = text.match(/<title>(.*?)<\/title>/i);
        return match ? match[1] : url.replace(/^https?:\/\//, "");
    } catch (e) {
        return url.replace(/^https?:\/\//, "");
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
        getPageTitle(site).then(title => {
            tabEl.querySelector("span").innerText = title;
        });
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
    const existing = document.querySelector("iframe#iF");
    if (existing) existing.remove();
    createTab();
    selectTab(0);
}

document.addEventListener("DOMContentLoaded", init);

// --- Settings Menu Logic ---
const settingsBtn = document.getElementById("settingsBtn");
const settingsMenu = document.getElementById("settingsMenu");
const settingsOverlay = document.getElementById("settingsOverlay");

settingsBtn.addEventListener("click", () => {
    settingsMenu.classList.toggle("active");
    settingsOverlay.classList.toggle("active");
});

settingsOverlay.addEventListener("click", () => {
    settingsMenu.classList.remove("active");
    settingsOverlay.classList.remove("active");
});

// --- Theme Switching ---
function setTheme(theme) {
    const body = document.body;
    body.className = ""; // reset classes
    switch (theme) {
        case "midnight":
            body.style.background = "linear-gradient(270deg, #0f0f2e, #1a0033, #000000)";
            body.style.backgroundSize = "600% 600%";
            animateBackground();
            break;
        case "classic":
            body.style.background = "linear-gradient(to right, #4CAF50, #008CBA)";
            break;
        case "dark":
            body.style.background = "#222";
            break;
        case "light":
            body.style.background = "#fff";
            break;
        case "rainbow":
            body.style.background = "linear-gradient(270deg, red, orange, yellow, green, blue, indigo, violet)";
            body.style.backgroundSize = "1400% 1400%";
            animateBackground();
            break;
        case "forest": // my choice 🌲
            body.style.background = "linear-gradient(135deg, #003300, #006600, #009933)";
            body.style.backgroundSize = "600% 600%";
            animateBackground();
            break;
    }
}

// animate gradient
function animateBackground() {
    document.body.animate(
        [{ backgroundPosition: "0% 50%" }, { backgroundPosition: "100% 50%" }],
        { duration: 15000, iterations: Infinity, direction: "alternate", easing: "linear" }
    );
}

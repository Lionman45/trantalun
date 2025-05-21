const proxyURL = "https://prostudyhabits.co/uv.html?site=";
const tabBar = document.getElementById("tabBar");
const siteInput = document.getElementById("site");
const iframe = document.getElementById("iF");

// Stores tab-specific data
let tabs = [];
let activeTabId = null;

function createTab(url = "") {
  const id = Date.now().toString();
  const tab = document.createElement("div");
  tab.className = "tab";
  tab.dataset.tabId = id;
  tab.innerHTML = `New Tab <span class="close-btn">&times;</span>`;
  tabBar.insertBefore(tab, document.getElementById("addTab"));

  const tabData = {
    id,
    title: "New Tab",
    url,
    history: url ? [url] : [],
    historyIndex: url ? 0 : -1
  };

  tabs.push(tabData);
  attachTabEvents(tab);
  setActiveTab(id);
}

function attachTabEvents(tabElement) {
  const id = tabElement.dataset.tabId;

  tabElement.addEventListener("click", () => {
    setActiveTab(id);
  });

  const closeBtn = tabElement.querySelector(".close-btn");
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeTab(id);
  });
}

function closeTab(id) {
  const tabIndex = tabs.findIndex(tab => tab.id === id);
  if (tabIndex !== -1) {
    tabs.splice(tabIndex, 1);
    const tabElement = document.querySelector(`.tab[data-tab-id="${id}"]`);
    if (tabElement) tabElement.remove();

    // Switch to another tab if the closed one was active
    if (activeTabId === id) {
      if (tabs.length > 0) {
        const nextTab = tabs[Math.max(0, tabIndex - 1)];
        setActiveTab(nextTab.id);
      } else {
        iframe.src = "";
        siteInput.value = "";
        activeTabId = null;
      }
    }
  }
}

function setActiveTab(id) {
  activeTabId = id;

  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  const activeTabElement = document.querySelector(`.tab[data-tab-id="${id}"]`);
  if (activeTabElement) activeTabElement.classList.add("active");

  const tabData = tabs.find(t => t.id === id);
  if (tabData) {
    iframe.src = tabData.url ? proxyURL + tabData.url : "";
    siteInput.value = tabData.url || "";
  }
}

function goToPage(url = null) {
  const tabData = tabs.find(t => t.id === activeTabId);
  if (!tabData) return;

  const site = url || siteInput.value.trim();
  if (site === "") return;

  // Add to history
  tabData.history = tabData.history.slice(0, tabData.historyIndex + 1); // truncate forward history
  tabData.history.push(site);
  tabData.historyIndex++;
  tabData.url = site;

  iframe.src = proxyURL + site;
  siteInput.value = site;
}

function goBack() {
  const tabData = tabs.find(t => t.id === activeTabId);
  if (!tabData || tabData.historyIndex <= 0) return;

  tabData.historyIndex--;
  const previousUrl = tabData.history[tabData.historyIndex];
  tabData.url = previousUrl;
  iframe.src = proxyURL + previousUrl;
  siteInput.value = previousUrl;
}

function refreshIframe() {
  const tabData = tabs.find(t => t.id === activeTabId);
  if (tabData && tabData.url) {
    iframe.src = proxyURL + tabData.url;
  }
}

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

siteInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    goToPage();
  }
});

// Plus tab click
document.getElementById("addTab").addEventListener("click", () => createTab());

// Create initial tab on load
createTab();

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

// --- Tab Handling ---

document.getElementById("addTab").addEventListener("click", () => {
  const tabBar = document.getElementById("tabBar");
  const newTab = document.createElement("div");
  newTab.className = "tab";
  newTab.innerHTML = `New Tab <span class="close-btn">&times;</span>`;
  tabBar.insertBefore(newTab, document.getElementById("addTab"));
  setActiveTab(newTab);
  attachTabEvents(newTab);
});

function attachTabEvents(tab) {
  tab.addEventListener("click", () => setActiveTab(tab));
  const closeBtn = tab.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = tab.classList.contains("active");
      tab.remove();
      if (isActive) {
        const remainingTabs = document.querySelectorAll(".tab");
        if (remainingTabs.length > 0) {
          setActiveTab(remainingTabs[0]);
        }
      }
    });
  }
}

function setActiveTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
}

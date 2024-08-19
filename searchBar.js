const searchBar = document.createElement("div");
searchBar.className = "search-bar";
const inputBar = document.createElement("input");
inputBar.type = "text";
inputBar.className = "input-bar";
const logoImg = document.createElement("span");

chrome.storage.local.get(["SearchEngine"], (result) => {
  if (result.SearchEngine === undefined) {
    chrome.storage.local.set({ SearchEngine: "DuckDuckGo" });
  }
});

document.body.append(searchBar);
searchBar.appendChild(logoImg);
searchBar.appendChild(inputBar);

window.addEventListener("click", (e) => {
  if (!inputBar.contains(e.target)) {
    searchBar.style.display = "none";
  }
});

window.addEventListener("keydown", (e) => {
  if (e.shiftKey && (e.key == "q" || e.key == "Q")) {
    // Shift + Q (81: Q)
    chrome.storage.local.get(["SearchEngine"], (result) => {
      console.log("Value currently is " + result.SearchEngine);
      inputBar.placeholder = `Search with ${result.SearchEngine}`;
      switch (result.SearchEngine) {
        case "Google":
          logoImg.className = "";
          logoImg.classList.add("logos--google-icon");
          break;
        case "DuckDuckGo":
          logoImg.className = "";
          logoImg.classList.add("logos--duckduckgo");
          break;
        case "Bing":
          logoImg.className = "";
          logoImg.classList.add("logos--bing");
          break;
        case "Yandex":
          logoImg.className = "";
          logoImg.classList.add("vscode-icons--file-type-yandex");
          break;
        case "Brave Search":
          logoImg.className = "";
          logoImg.classList.add("logos--brave");
          break;
        case "Searx":
          logoImg.className = "";
          logoImg.classList.add("simple-icons--searxng");
          break;
        default:
          console.error("Unknown search engine");
          return; // Geçersiz arama motoru olduğunda işlemi sonlandır
      }
    });

    if (searchBar.style.display == "none") {
      searchBar.style.display = "flex";
      inputBar.focus();
      e.preventDefault();
      inputBar.value = "";
    } else {
      searchBar.style.display = "none";
    }
  }

  if (e.key === "Enter" && searchBar.style.display === "flex") {
    // Enter tuşuna basıldığında arama yap
    e.preventDefault(); // Varsayılan davranışı engeller (örneğin form gönderimi)
    const query = inputBar.value.trim(); // Boşlukları temizle
    if (query) {
      if (isValidDomain(query)) {
        // Eğer sorgu bir domain ise, doğrudan o domaini aç
        setTimeout(() => {
          const domainUrl = `http://${query}`;
          window.open(domainUrl, "_blank", "noopener,noreferrer"); // Yeni sekmede aç
          searchBar.style.display = "none";
        }, 100);
      } else {
        let searchUrl = "";
        chrome.storage.local.get(["SearchEngine"], (result) => {
          switch (result.SearchEngine) {
            case "Google":
              searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
              break;
            case "DuckDuckGo":
              searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
              break;
            case "Bing":
              searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
              break;
            case "Yandex":
              searchUrl = `https://yandex.com/search/?text=${encodeURIComponent(query)}`;
              break;
            case "Brave Search":
              searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
              break;
            case "Searx":
              searchUrl = `https://searx.garudalinux.org/search?q=${encodeURIComponent(query)}`;
              break;
            default:
              console.error("Unknown search engine");
              return; // Geçersiz arama motoru olduğunda işlemi sonlandır
          }
          setTimeout(() => {
            window.open(searchUrl, "_blank", "noopener,noreferrer"); // Yeni sekmede aç
            searchBar.style.display = "none";
          }, 100);
        });
      }
    }
  }
});

function isValidDomain(str) {
  // Basit bir domain kontrolü için regex
  const domainRegex =
    /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/;
  return domainRegex.test(str);
}

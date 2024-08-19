document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("dropdown");

  chrome.storage.local.get(["SearchEngine"], (result) => {
    if (result.SearchEngine) {
      // Saklanan değeri dropdown'da seçili olarak ayarla
      dropdown.value = result.SearchEngine;
    }
  });

  dropdown.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    // Seçilen değeri işleyin veya saklayın
    console.log(`Seçilen seçenek: ${selectedValue}`);

    chrome.storage.local.set({ SearchEngine: selectedValue });
    window.close();
    // Örneğin, bu değeri tarayıcı depolama alanında saklayabilirsiniz
    // browser.storage.local.set({ selectedOption: selectedValue });
  });
});

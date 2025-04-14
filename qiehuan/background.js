browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if ("toggleTheme" in request) {
        toggleTheme(sendResponse);
    }
    else if ("getTheme" in request) {
        getTheme(sendResponse);
    }
    return true;
  });
  
const toggleTheme = (sendResponse) => {
browser.storage.sync.get("isDarkTheme", (result) => {
    const darkThemeToggeled = !result.isDarkTheme;

    browser.storage.sync.set({ isDarkTheme: darkThemeToggeled }, () => {
        sendResponse({ isDarkTheme: darkThemeToggeled });
    });
});
}
const getTheme = (sendResponse) => {
browser.storage.sync.get("isDarkTheme", (result) => {
    sendResponse({ isDarkTheme: result.isDarkTheme });
});
}
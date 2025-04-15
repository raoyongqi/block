browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if ("toggleTheme" in request) {
        toggleTheme(sendResponse);
    }
    else if ("getTheme" in request) {
        getTheme(sendResponse);
    }else if (request === "LIST") {
        sendResponse(sets)
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


let sets = {}

browser.webRequest.onBeforeRequest.addListener((requestDetails) => {

    browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
        if (tabs[0]?.url) {
            const tabUrl = tabs[0].url;
            const domain = new URL(requestDetails.url).host;
            if (domain.includes('127.0.0.1') || domain.includes('localhost')) {
                return;
            }
    
            sets[tabUrl] = sets[tabUrl] || new Set();
            sets[tabUrl].add(domain);
    
            async function isDomainInStoredList(tabUrl, domain) {
                const result = await browser.storage.local.get();
                const keys = Object.keys(result).filter(key => !key.startsWith("about:"));
    
                for (const key of keys) {
                    try {
                        const keyHost = new URL(key).host;
                        if (keyHost === new URL(tabUrl).host && result[key]?.includes(domain)) {
                            return true;
                        }
                    } catch (e) {

                    }
                }
    
                return false;
            }
    
            isDomainInStoredList(tabUrl, domain).then(isInList => {
                if (!isInList) {
                    browser.storage.local.get([tabUrl]).then(result => {
                        const storedSet = new Set(result[tabUrl] || []);
                        storedSet.add(domain);
                        browser.storage.local.set({ [tabUrl]: Array.from(storedSet) });
                    });
                }
            });
        }
    });
    
    
}, { urls: ["*://*/*"] });

browser.runtime.onUninstall.addListener(() => {
    console.log('扩展已卸载，正在清理数据...');
    browser.storage.local.clear()
      .then(() => console.log('数据已清空'))
      .catch((error) => console.error('清空数据时出错:', error));
  });
  
  
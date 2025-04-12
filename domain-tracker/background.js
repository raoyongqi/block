const whitelist = ['googleapis', 'fonts', 'googleusercontent']

let sets = {}

browser.webRequest.onBeforeRequest.addListener((requestDetails) => {
    // 获取当前活动的标签页
    browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
        if (tabs[0] && tabs[0].url) {
            const tabUrl = tabs[0].url;
            const domain = requestDetails.url.split('/')[2];
    
            // 更新内存中的 sets 对象
            if (!sets[tabUrl]) {
                sets[tabUrl] = new Set();
            }
            sets[tabUrl].add(domain);
    
            // 从 storage 获取并更新
            browser.storage.local.get([tabUrl]).then((result) => {
                let storedList = result[tabUrl] || [];
                let storedSet = new Set(storedList);
    
                storedSet.add(domain);
    
                // 存储前要转回数组
                browser.storage.local.set({ [tabUrl]: Array.from(storedSet) });
            });
        }
    });
    
}, { urls: ["*://*/*"] });

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "LIST") {
        sendResponse(sets)
    }
})
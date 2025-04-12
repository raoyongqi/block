const beginWithStar = [
  "*.icbc.com.cn",
  "*.qt.io",
];

const beginWithoutStar = [
  "t.me",
  "t.co",
  "github.com",
  "chatgpt.com",
];

const allowedUrls = beginWithStar.concat(beginWithoutStar);  // concat 方法将允许的 URL 合并

const blockedUrls = [
  "*://www.google.com/search*",
  ".*firefox.*",
  "*://camo.githubusercontent.com/*"
];

// 请求拦截处理函数
const onBeforeRequest = (details) => {

  // 记录每次访问的 URL（无论是否被阻止）
  browser.storage.local.get("visitedUrls").then(result => {
    let visitedUrls = result.visitedUrls || []; // 获取已访问的 URL 列表，如果没有则初始化为空数组
    visitedUrls.push(details.url); // 将当前 URL 添加到访问列表
    browser.storage.local.set({ visitedUrls }); // 更新存储中的 URL 列表
  });
  const url = new URL(details.url);
  const host = url.hostname;


  const isBlocked = blockedUrls.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(details.url);
  });

  if (isBlocked) {
    console.log(`Blocked URL: ${details.url}`);

    // 将被阻止的 URL 添加到 blockedUrls 列表
    browser.storage.local.get("blockedUrls").then(result => {
      let blockedList = result.blockedUrls || [];
      blockedList.push(details.url);
      browser.storage.local.set({ blockedUrls: blockedList });
    });

    return { cancel: true };
  }

  const isAllowed = allowedUrls.some(pattern => {
    if (pattern.startsWith("*.") && host.endsWith(pattern.slice(2))) {
      return true;
    }
    return host === pattern || host === 'www.' + pattern;
  });

  if (!isAllowed) {
    console.log(`Blocked URL: ${details.url}`);

    browser.storage.local.get("blockedUrls").then(result => {
      let blockedList = result.blockedUrls || [];
      blockedList.push(details.url);
      browser.storage.local.set({ blockedUrls: blockedList });
    });

    return { cancel: true };
  }

  return { cancel: false };
};

browser.webRequest.onBeforeRequest.addListener(
  onBeforeRequest,
  { urls: ["<all_urls>"] },
  ["blocking"]
);

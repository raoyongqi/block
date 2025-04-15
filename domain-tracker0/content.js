browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "COOKIES") {
        sendResponse(document.cookie)
    }
})

// 创建 draggable widget 元素
const widget = document.createElement('div');
widget.id = 'draggable-widget';
document.body.appendChild(widget);

const rectangle = document.createElement('div');
rectangle.id = 'rectangle';
widget.appendChild(rectangle);

const halfCircle = document.createElement('div');
halfCircle.id = 'half-circle';
widget.appendChild(halfCircle);

const bingoIcon = document.createElement('div');
bingoIcon.id = 'bingo-icon';
bingoIcon.textContent = '🔍';
widget.appendChild(bingoIcon);

// 添加 CSS 样式
const style = document.createElement('style');
style.textContent = `
  #draggable-widget {
    position: fixed;
    left: 0;
    top: 80%;
    transform: translateY(-50%);
    z-index: 9999;
    cursor: pointer;
    display: flex;
    transition: all 0.3s ease;
  }
  #rectangle {
    width: 0;
    height: 45px;
    background-color: #A1D6FF;
    transition: width 0.3s ease, background-color 0.3s ease;
  }
  #half-circle {
    width: 45px;
    height: 45px;
    background-color: #A1D6FF;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    transition: background-color 0.3s ease;
  }
  #bingo-icon {
    display: none;
    font-size: 24px;
    color: #3384D4;
    transition: opacity 0.3s ease;
  }
`;
document.head.appendChild(style);

let isClicked = false;
let isDragging = false;
let offsetY = 0;
let initialClick = null;

window.addEventListener('DOMContentLoaded', () => {
  const savedTop = localStorage.getItem('widgetTop');
  if (savedTop) {
    widget.style.top = savedTop;
    widget.style.transform = '';
  }

  const savedClickedState = sessionStorage.getItem('isClicked');
  if (savedClickedState === 'true') {
    isClicked = true;
    rectangle.style.width = '30px';
    rectangle.style.backgroundColor = '#3384D4';
    halfCircle.style.backgroundColor = '#3384D4';
    bingoIcon.style.display = 'block';
  } else {
    isClicked = false;
    rectangle.style.width = '0';
    rectangle.style.backgroundColor = '#A1D6FF';
    halfCircle.style.backgroundColor = '#A1D6FF';
    bingoIcon.style.display = 'none';
  }
});

widget.addEventListener('mouseenter', () => {
  if (!isDragging) {
    rectangle.style.width = '30px';
    rectangle.style.background = '#66BFFF';
    halfCircle.style.background = '#66BFFF';
  }
});

widget.addEventListener('mouseleave', () => {
  if (!isDragging) {
    rectangle.style.width = '0';
    rectangle.style.backgroundColor = '#A1D6FF';
    halfCircle.style.backgroundColor = '#A1D6FF';
  }
});

widget.addEventListener('mousedown', (e) => {
  initialClick = { x: e.clientX, y: e.clientY };
  isDragging = true;
  offsetY = e.clientY - widget.offsetTop;
  widget.style.transition = 'none';
  rectangle.style.width = '30px';
});

// 鼠标移动时拖动小部件
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    let newTop = e.clientY - offsetY;
    if (newTop < 0) newTop = 0;
    if (newTop > window.innerHeight - widget.offsetHeight) {
      newTop = window.innerHeight - widget.offsetHeight;
    }
    widget.style.top = `${newTop}px`;
    widget.style.transform = ''; // 移动后清除原来的 translateY(-50%)
  }
});

// 鼠标松开停止拖动
document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    widget.style.transition = 'top 0.3s ease';

    // 保存当前位置
    localStorage.setItem('widgetTop', widget.style.top);
  }

  if (!isDragging) {
    rectangle.style.width = '0';
    rectangle.style.backgroundColor = '#A1D6FF';
    halfCircle.style.backgroundColor = '#A1D6FF';
  }
});

// 点击事件切换状态
widget.addEventListener('click', () => {
  if (isClicked) {
    isClicked = false;
    rectangle.style.width = '0';
    rectangle.style.backgroundColor = '#A1D6FF';
    halfCircle.style.backgroundColor = '#A1D6FF';
    bingoIcon.style.display = 'none';

    sessionStorage.setItem('isClicked', 'false');
    
  } else {
    isClicked = true;
    rectangle.style.width = '30px';
    rectangle.style.backgroundColor = '#3384D4';
    halfCircle.style.backgroundColor = '#3384D4';
    bingoIcon.style.display = 'block';
    browser.storage.local.get().then((result) => {

      const hosts = new Set();
      function extractHost(url) {
        try {
          const parsedUrl = new URL(url);
          return parsedUrl.hostname || url;  // If it's a full URL, extract host using URL object
        } catch (error) {
          return url;  // If it's not a valid URL, return the URL as is
        }
      }
      
      for (const key in result) {
        // Skip keys that start with "about:"
        if (key.startsWith("about:")) {
          continue;
        }
      
        hosts.add(extractHost(key));
      
        const urls = result[key];
        if (Array.isArray(urls)) {
          urls.forEach(url => {
            hosts.add(extractHost(url));
          });
        }
      }
      
      chrome.runtime.sendMessage({ action: 'getUrls' }, (response) => {
        const beginWithStar = response.beginWithStar;
        const beginWithoutStar = response.beginWithoutStar;
        const combinedUniqueUrls = Array.from(new Set([...beginWithoutStar, ...hosts]));
      
        const blockedUrls = response.blockedUrls;

        const jsContent = `
        const beginWithStar = ${JSON.stringify(beginWithStar, null, 4)};
        const beginWithoutStar = ${JSON.stringify(combinedUniqueUrls, null, 4)};
        const allowedUrls = beginWithStar.concat(beginWithoutStar);
        const blockedUrls = ${JSON.stringify(blockedUrls, null, 4)};
        
        browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        
          if (request === "LIST") {
              sendResponse(sets)
          }
          else if (request.action === 'getUrls') {
              sendResponse({
                  beginWithStar: beginWithStar,
                  beginWithoutStar: beginWithoutStar,
                  blockedUrls: blockedUrls

              });
          }
          else if ("toggleTheme" in request) {
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

    
        let sets = {};

        browser.webRequest.onBeforeRequest.addListener((details) => {
            browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
                if (tabs[0]?.url) {
                    const tabUrl = tabs[0].url;
                    const domain = new URL(details.url).host;
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
                            } catch (e) {}
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

            const url = new URL(details.url);
            const host = url.hostname;

            const isBlocked = blockedUrls.some(pattern => {
                const regex = new RegExp(pattern.replace(/\\*/g, '.*'));
                return regex.test(details.url);
            });

            if (isBlocked) {
                console.log(\`Blocked URL: \${details.url}\`);
                return { cancel: true };
            }

            const isAllowed = allowedUrls.some(pattern => {
                if (pattern.startsWith("*.") && host.endsWith(pattern.slice(2))) {
                    return true;
                }
                return host === pattern || host === 'www.' + pattern;
            });

            if (!isAllowed) {
                console.log(\`Blocked URL: \${details.url}\`);
                return { cancel: true };
            }

            return { cancel: false };
        }, { urls: ["*://*/*"] }, ["blocking"]);



        browser.runtime.onUninstall.addListener(() => {
            console.log('Extension has been uninstalled, cleaning up data...');
            browser.storage.local.clear()
              .then(() => console.log('Data has been cleared'))
              .catch((error) => console.error('Error clearing data:', error));
        });

        `;
        
  
          const blob = new Blob([jsContent], { type: "application/javascript" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `generated-background.js`;
          a.click();
          URL.revokeObjectURL(url);
        
    });

      
    });
    sessionStorage.setItem('isClicked', 'true');
  }
});

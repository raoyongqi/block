// 获取元素
const urlInput = document.getElementById('urlInput');
const saveButton = document.getElementById('saveButton');
const urlList = document.getElementById('urlList');

// 加载已保存的访问过的 URL
function loadUrls() {
  // 使用 browser.storage.local.get 获取保存的 visitedUrls
  browser.storage.local.get('visitedUrls').then(result => {
    const visitedUrls = result.visitedUrls || [];  // 获取存储的 "visitedUrls"，如果没有数据则使用空数组
    urlList.innerHTML = visitedUrls.map(url => `<li>${url}</li>`).join('');  // 显示所有访问过的 URL
  }).catch(error => {
    console.error('Error loading visitedUrls:', error);
  });
}

// 点击保存按钮时，保存 URL
saveButton.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (url) {
    // 获取当前存储的 visitedUrls
    browser.storage.local.get('visitedUrls').then(result => {
      const visitedUrls = result.visitedUrls || [];  // 获取存储的 "visitedUrls"，如果没有数据则使用空数组
      visitedUrls.push(url);  // 添加新的 URL

      // 使用 browser.storage.local.set 保存更新后的 visitedUrls
      browser.storage.local.set({ visitedUrls }).then(() => {
        urlInput.value = '';  // 清空输入框
        loadUrls();  // 重新加载已保存的访问 URL
      }).catch(error => {
        console.error('Error saving visitedUrls:', error);
      });
    }).catch(error => {
      console.error('Error retrieving visitedUrls:', error);
    });
  }
});

// 初始化加载已保存的访问过的 URL
loadUrls();

// 创建浮动按钮
const widget = document.createElement('div');
widget.id = 'my-floating-widget';
widget.innerHTML = `<button id="my-btn">🔍 点我</button>`;

// 设置浮动按钮的位置样式，使其在页面左侧垂直居中
widget.style.position = 'fixed';
widget.style.left = '10px';  // 设置距离左侧的距离
widget.style.top = '50%';  // 设置距离顶部的距离，50% 使其垂直居中
widget.style.transform = 'translateY(-50%)';  // 将元素垂直居中
widget.style.zIndex = '9999';  // 确保按钮在页面上层
widget.style.pointerEvents = 'auto';  // 确保按钮可以点击

// 设置按钮的初始样式（淡出效果）
widget.style.transition = 'opacity 0.3s ease';  // 设置透明度过渡效果
widget.style.opacity = '1';  // 初始时按钮完全可见

// 将按钮添加到页面
document.body.appendChild(widget);

// 鼠标进入时，按钮变得完全可见
widget.addEventListener('mouseover', () => {
  widget.style.opacity = '1';  // 鼠标悬停时完全显示
});

// 鼠标离开时，按钮变得半透明并淡出
widget.addEventListener('mouseout', () => {
  widget.style.opacity = '0.5';  // 鼠标离开时淡出
});

// 添加按钮的点击事件
document.getElementById('my-btn').addEventListener('click', () => {
  // 使用 browser.storage.local.get 获取存储的数据
  browser.storage.local.get('blockedUrls').then(result => {
      const blockedUrls = result.blockedUrls || [];  // 获取存储的 blockedUrls 数据，默认是空数组

      // 将 blockedUrls 转换成 JavaScript 数组形式
      const formattedUrls = blockedUrls.map(url => `"${url}"`).join(',\n');
      const jsContent = `const blockedUrls = [\n${formattedUrls}\n];\nexport default blockedUrls;`;

      // 创建 Blob 来生成下载链接
      const blob = new Blob([jsContent], { type: 'application/javascript' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'blocked_urls.js';  // 下载为 .js 文件
      link.click();
  }).catch(error => {
      console.error('Error retrieving blockedUrls from storage:', error);
  });
});


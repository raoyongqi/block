// 创建浮动按钮容器
const widget = document.createElement('div');
widget.id = 'my-floating-widget';
widget.style.position = 'fixed';
widget.style.left = '0';  // 设置距离左侧的距离，保证紧贴左侧边界
widget.style.top = '80%';  // 设置初始位置的顶部距离
widget.style.transform = 'translateY(-50%)';  // 将元素垂直居中
widget.style.zIndex = '9999';  // 确保按钮在页面上层
widget.style.cursor = 'pointer';  // 设置鼠标样式为可点击
widget.style.display = 'flex';  // 使用flex布局来摆放长方形和半圆

// 创建长方形部分
const rectangle = document.createElement('div');
rectangle.style.width = '0';  // 初始宽度为 0
rectangle.style.height = '40px';  // 长方形的高度
rectangle.style.backgroundColor = '#007BFF';  // 长方形的颜色
rectangle.style.transition = 'width 0.3s ease';  // 添加过渡效果

// 创建半圆形按钮
const halfCircle = document.createElement('div');
halfCircle.style.width = '40px';  // 半圆的宽度
halfCircle.style.height = '40px';  // 半圆的高度
halfCircle.style.backgroundColor = '#007BFF';  // 半圆的颜色
halfCircle.style.borderTopLeftRadius = '20px';  // 半圆形状
halfCircle.style.borderBottomLeftRadius = '20px';  // 半圆形状
halfCircle.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';  // 添加阴影效果

// 将半圆和长方形添加到浮动按钮容器中
widget.appendChild(rectangle);
widget.appendChild(halfCircle);
document.body.appendChild(widget);

// 鼠标进入时显示完整按钮（包括长方形部分）
widget.addEventListener('mouseenter', () => {
  rectangle.style.width = '100px';  // 鼠标靠近时显示完整按钮（长方形部分展开）
  widget.style.transform = 'translateY(-50%) translateX(40px)';  // 将整个按钮向右滑动
});

// 鼠标离开时恢复初始状态（只显示半圆形按钮）
widget.addEventListener('mouseleave', () => {
  rectangle.style.width = '0';  // 恢复只显示半圆形按钮（长方形部分缩回）
  widget.style.transform = 'translateY(-50%)';  // 恢复原位，只有半圆显示
});

// 变量来记录拖动状态
let isDragging = false;
let offsetY = 0;
let initialClick = null;

// 监听鼠标按下事件，开始拖动
widget.addEventListener('mousedown', (e) => {
  // 记录初次点击位置，区分点击和拖动
  initialClick = { x: e.clientX, y: e.clientY };

  // 开始拖动
  isDragging = true;
  offsetY = e.clientY - widget.offsetTop;  // 记录点击时鼠标到按钮顶部的距离
  widget.style.transition = 'none';  // 在拖动时取消过渡效果
});

// 监听鼠标移动事件，改变浮动按钮的位置
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const newTop = e.clientY - offsetY;  // 计算新的顶部位置
    widget.style.top = `${newTop}px`;  // 更新按钮的顶部位置
  }
});

// 监听鼠标松开事件，结束拖动
document.addEventListener('mouseup', (e) => {
  if (isDragging) {
    isDragging = false;
    widget.style.transition = 'top 0.3s ease';  // 恢复过渡效果
  }

  // 判断是否是点击事件而非拖动，如果是点击则触发点击动作
  if (initialClick && (Math.abs(e.clientX - initialClick.x) < 5) && (Math.abs(e.clientY - initialClick.y) < 5)) {
    // 如果鼠标移动的距离小于阈值，视为点击事件
    console.log("按钮点击了！");  // 你可以在这里添加点击后的动作
    // 比如弹出提示框等
  }
});

// 可选：鼠标松开后限制按钮的上下范围，防止按钮移动到页面外
document.addEventListener('mousemove', () => {
  const top = parseInt(widget.style.top, 10);
  if (top < 0) {
    widget.style.top = '0px';  // 限制按钮不超过页面顶部
  }
  if (top > window.innerHeight - widget.offsetHeight) {
    widget.style.top = `${window.innerHeight - widget.offsetHeight}px`;  // 限制按钮不超过页面底部
  }
});

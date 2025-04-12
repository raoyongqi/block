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

// 页面加载时读取保存的位置和状态
window.addEventListener('DOMContentLoaded', () => {
  const savedTop = localStorage.getItem('widgetTop');
  if (savedTop) {
    widget.style.top = savedTop;
    widget.style.transform = ''; // 清除居中的 transform
  }

  // 如果 sessionStorage 中有 isClicked 状态，初始化
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
    rectangle.style.backgroundColor = '#66BFFF';
    halfCircle.style.backgroundColor = '#66BFFF';
    bingoIcon.style.display = 'none';
  }
});

// 鼠标进入小部件
widget.addEventListener('mouseenter', () => {
  if (!isDragging) {
    rectangle.style.width = '30px';
    rectangle.style.background = '#66BFFF';
    halfCircle.style.background = '#66BFFF';
  }
});

// 鼠标离开小部件
widget.addEventListener('mouseleave', () => {
  if (!isDragging) {
    rectangle.style.width = '0';
    rectangle.style.backgroundColor = '#66BFFF';
    halfCircle.style.backgroundColor = '#66BFFF';
  }
});

// 按下鼠标开始拖动
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
    rectangle.style.backgroundColor = '#66BFFF';
    halfCircle.style.backgroundColor = '#66BFFF';
  }
});

// 点击事件切换状态
widget.addEventListener('click', () => {
  if (isClicked) {
    isClicked = false;
    rectangle.style.width = '0';
    rectangle.style.backgroundColor = '#66BFFF';
    halfCircle.style.backgroundColor = '#66BFFF';
    bingoIcon.style.display = 'none';

    // 将状态保存在 sessionStorage 中
    sessionStorage.setItem('isClicked', 'false');
  } else {
    isClicked = true;
    rectangle.style.width = '30px';
    rectangle.style.backgroundColor = '#3384D4';
    halfCircle.style.backgroundColor = '#3384D4';
    bingoIcon.style.display = 'block';

    // 将状态保存在 sessionStorage 中
    sessionStorage.setItem('isClicked', 'true');
  }
});

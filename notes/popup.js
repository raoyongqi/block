// 获取元素
const noteInput = document.getElementById('noteInput');
const saveButton = document.getElementById('saveButton');
const noteList = document.getElementById('noteList');

function loadNotes() {
  const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
  noteList.innerHTML = savedNotes.map(note => `<li>${note}</li>`).join('');
}

saveButton.addEventListener('click', () => {
  const note = noteInput.value.trim();
  if (note) {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    
    savedNotes.push(note);
    
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    
    noteInput.value = '';
    
    loadNotes();
  }
});

// 初始化加载笔记
loadNotes();

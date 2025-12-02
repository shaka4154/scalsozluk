const itemsContainer = document.querySelector('.items');
const buttons = document.querySelectorAll('.option-btn');
const resultDiv = document.getElementById('result');
let correctCount = 0;
const totalCount = 4;

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const allItems = [...data.atasozleri, ...data.deyimler];
    const leftItems = getRandom(allItems, totalCount);

    leftItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.textContent = item.name;
      div.dataset.type = data.atasozleri.includes(item) ? 'atasozu' : 'deyim';
      div.draggable = true;
      itemsContainer.appendChild(div);

      div.addEventListener('dragstart', e => {
        if(div.classList.contains('matched') || div.classList.contains('wrong')) {
          e.preventDefault(); // sabit kartlar sürüklenemez
          return;
        }
        e.dataTransfer.setData('text/plain', div.dataset.type);
        div.classList.add('selected');
      });

      div.addEventListener('dragend', e => div.classList.remove('selected'));
    });

    updateResult();

    buttons.forEach(btn => {
      btn.addEventListener('dragover', e => e.preventDefault());
      btn.addEventListener('drop', e => {
        e.preventDefault();
        const draggedDiv = document.querySelector('.item.selected');
        if (!draggedDiv) return;

        const draggedType = draggedDiv.dataset.type;

        if(draggedType === btn.dataset.type){
          draggedDiv.classList.add('matched'); // yeşil sabit
          draggedDiv.draggable = false;
          correctCount++;
          updateResult();
        } else {
          draggedDiv.classList.add('wrong'); // kırmızı sabit
          draggedDiv.draggable = false;
        }
      });
    });
  });

function updateResult(){
  resultDiv.textContent = `${correctCount}/${4}`;
}

function getRandom(arr, n){
  return arr.sort(()=> 0.5 - Math.random()).slice(0,n);
}

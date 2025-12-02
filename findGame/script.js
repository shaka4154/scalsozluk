const itemsContainer = document.querySelector('.items');
const buttons = document.querySelectorAll('.option-btn');
const resultDiv = document.getElementById('result');
const restartBtn = document.getElementById('restartBtn');
const mainMenuBtn = document.getElementById('mainMenuBtn');

let correctCount = 0;
const totalCount = 4;

function startGame() {
  itemsContainer.innerHTML = '';
  correctCount = 0;
  updateResult();

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

        // Desktop drag
        div.addEventListener('dragstart', e => {
          if(div.classList.contains('matched') || div.classList.contains('wrong')) return e.preventDefault();
          e.dataTransfer.setData('text/plain', div.dataset.type);
          div.classList.add('selected');
        });
        div.addEventListener('dragend', e => div.classList.remove('selected'));

        // Mobile touch
        div.addEventListener('touchstart', e => {
          if(div.classList.contains('matched') || div.classList.contains('wrong')) return;
          div.classList.add('selected');
        });

        div.addEventListener('touchmove', e => {
          e.preventDefault();
          const touch = e.touches[0];
          div.style.position = 'absolute';
          div.style.left = touch.pageX - div.offsetWidth/2 + 'px';
          div.style.top = touch.pageY - div.offsetHeight/2 + 'px';
          div.style.zIndex = 1000;
        });

        div.addEventListener('touchend', e => {
          div.style.position = '';
          div.style.left = '';
          div.style.top = '';
          div.style.zIndex = '';

          const selected = document.querySelector('.item.selected');
          if(!selected) return;

          let dropped = false;
          buttons.forEach(btn => {
            const btnRect = btn.getBoundingClientRect();
            const divRect = selected.getBoundingClientRect();

            if(divRect.left + divRect.width/2 > btnRect.left &&
               divRect.left + divRect.width/2 < btnRect.right &&
               divRect.top + divRect.height/2 > btnRect.top &&
               divRect.top + divRect.height/2 < btnRect.bottom) {

              if(selected.dataset.type === btn.dataset.type){
                selected.classList.add('matched');
                correctCount++;
              } else {
                selected.classList.add('wrong');
              }
              selected.draggable = false;
              dropped = true;
            }
          });

          selected.classList.remove('selected');
          updateResult();
        });
      });
    });
}

function getRandom(arr, n){
  return arr.sort(() => 0.5 - Math.random()).slice(0, n);
}

// Desktop drop
buttons.forEach(btn => {
  btn.addEventListener('dragover', e => e.preventDefault());
  btn.addEventListener('drop', e => {
    e.preventDefault();
    const draggedDiv = document.querySelector('.item.selected');
    if(!draggedDiv) return;

    if(draggedDiv.dataset.type === btn.dataset.type){
      draggedDiv.classList.add('matched');
      draggedDiv.draggable = false;
      correctCount++;
    } else {
      draggedDiv.classList.add('wrong');
      draggedDiv.draggable = false;
    }
    draggedDiv.classList.remove('selected');
    updateResult();
  });
});

function updateResult(){
  resultDiv.textContent = `${correctCount}/${totalCount}`;
}

restartBtn.addEventListener('click', startGame);
mainMenuBtn.addEventListener('click', () => { window.location.href = 'index.html'; });

startGame();

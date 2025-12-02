const itemsContainer = document.querySelector('.items');
const buttons = document.querySelectorAll('.option-btn');
const resultDiv = document.getElementById('result');
const restartBtn = document.getElementById('restartBtn');
const mainMenuBtn = document.getElementById('mainMenuBtn');

let correctCount = 0;
const totalCount = 4;
let selectedItem = null;

// Oyun başlat
function startGame() {
  itemsContainer.innerHTML = '';
  correctCount = 0;
  selectedItem = null;
  updateResult();

  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      const allItems = [...data.atasozleri, ...data.deyimler];
      const leftItems = allItems.sort(() => 0.5 - Math.random()).slice(0, totalCount);

      leftItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = item.name;
        div.dataset.type = data.atasozleri.includes(item) ? 'atasozu' : 'deyim';
        itemsContainer.appendChild(div);

        // Kart seçme
        div.addEventListener('click', () => {
          if (div.classList.contains('matched') || div.classList.contains('wrong')) return;

          if (selectedItem) {
            selectedItem.classList.remove('selected');
            selectedItem.style.background = '';
          }

          selectedItem = div;
          div.classList.add('selected');
          div.style.background = '#FFD700'; // seçilince sarı
        });
      });
    });
}

// Sağdaki butonlar
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!selectedItem) return;

    if (selectedItem.dataset.type === btn.dataset.type) {
      selectedItem.classList.add('matched'); // yeşil
      correctCount++;
    } else {
      selectedItem.classList.add('wrong'); // kırmızı
    }

    selectedItem.classList.remove('selected');
    selectedItem.style.background = '';
    selectedItem = null;
    updateResult();
  });
});

function updateResult() {
  resultDiv.textContent = `${correctCount}/${totalCount}`;
}

// Yeniden başlat
restartBtn.addEventListener('click', startGame);

// Ana Menü butonu
mainMenuBtn.addEventListener('click', () => {
  // Örnek: başka bir sayfaya yönlendirme
  window.location.href = "../index.html"; // kendi ana menü sayfanın yolu
});

startGame();

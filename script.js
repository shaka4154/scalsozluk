let items = [];
let displayedItems = [];
let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

fetch("data.json")
  .then(r => r.json())
  .then(d => {
    items = d.items;
    startGame();
  });

function startGame() {
  const area = document.querySelector(".area");
  const dropzonesDiv = document.querySelector(".dropzones");
  area.innerHTML = "";
  dropzonesDiv.innerHTML = "";
  document.getElementById("result").textContent = "";

  // 4 rastgele atasözü seç
  displayedItems = [];
  let tempItems = [...items];
  for (let i=0; i<4; i++) {
    let idx = Math.floor(Math.random()*tempItems.length);
    displayedItems.push(tempItems.splice(idx,1)[0]);
  }

  // Drop alanları için anlamları rastgele sırala
  let meanings = displayedItems.map(i => i.meaning);
  meanings = shuffleArray(meanings);

  // Drop alanlarını oluştur
  meanings.forEach(m => {
    const div = document.createElement("div");
    div.className = "dropzone";
    div.dataset.meaning = m;
    div.textContent = m;
    dropzonesDiv.appendChild(div);
  });

  // Atasözü kutularını rastgele konumlandır
  displayedItems.forEach((obj, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = obj.name;
    div.style.left = Math.random()*(area.clientWidth - 120) + "px";
    div.style.top = Math.random()*(area.clientHeight - 50) + "px";
    enableDrag(div);
    area.appendChild(div);
  });
}

// Shuffle helper
function shuffleArray(array) {
  for (let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

function enableDrag(el) {
  el.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);

  el.addEventListener("touchstart", startDragTouch,{passive:false});
  document.addEventListener("touchmove", onDragTouch,{passive:false});
  document.addEventListener("touchend", stopDragTouch);
}

function startDrag(e){
  draggedItem = e.target;
  draggedItem.classList.add("dragging");
  offsetX = e.clientX - draggedItem.offsetLeft;
  offsetY = e.clientY - draggedItem.offsetTop;
}

function onDrag(e){
  if(!draggedItem) return;
  draggedItem.style.left = (e.clientX - offsetX)+"px";
  draggedItem.style.top = (e.clientY - offsetY)+"px";
}

function stopDrag(){
  if(!draggedItem) return;
  draggedItem.classList.remove("dragging");
  draggedItem = null;
}

function startDragTouch(e){
  e.preventDefault();
  draggedItem = e.target;
  draggedItem.classList.add("dragging");
  const t = e.touches[0];
  offsetX = t.clientX - draggedItem.offsetLeft;
  offsetY = t.clientY - draggedItem.offsetTop;
}

function onDragTouch(e){
  if(!draggedItem) return;
  e.preventDefault();
  const t = e.touches[0];
  draggedItem.style.left = (t.clientX - offsetX)+"px";
  draggedItem.style.top = (t.clientY - offsetY)+"px";
}

function stopDragTouch(){
  if(!draggedItem) return;
  draggedItem.classList.remove("dragging");
  draggedItem = null;
}

// Kontrol butonu
document.getElementById("checkBtn").addEventListener("click",()=>{
  const dropzones = document.querySelectorAll(".dropzone");
  let correct = 0;

  dropzones.forEach(zone=>{
    const item = Array.from(document.querySelectorAll(".item")).find(i=>{
      const rectItem=i.getBoundingClientRect();
      const rectZone=zone.getBoundingClientRect();
      return !(rectItem.right<rectZone.left||rectItem.left>rectZone.right||rectItem.bottom<rectZone.top||rectItem.top>rectZone.bottom);
    });
    if(item){
      const match = displayedItems.find(d=>d.name===item.textContent);
      if(match.meaning===zone.dataset.meaning){
        zone.classList.add("correct");
        correct++;
      } else {
        zone.classList.add("wrong");
        setTimeout(()=>zone.classList.remove("wrong"),800);
      }
    }
  });

  document.getElementById("result").textContent = `Doğru: ${correct} / 4`;
});


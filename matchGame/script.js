let items = [];
let displayedItems = [];
let selectedItem = null;
let matches = new Map();

fetch("data.json")
  .then(r => r.json())
  .then(d => {
    items = d.items;
    startGame();
  });

function startGame() {
  const itemsDiv = document.querySelector(".items");
  const meaningsDiv = document.querySelector(".meanings");
  itemsDiv.innerHTML = "";
  meaningsDiv.innerHTML = "";
  matches.clear();
  selectedItem = null;
  document.getElementById("result").textContent = "";

  displayedItems = shuffleArray([...items]).slice(0,4);
  let meanings = displayedItems.map(i=>i.meaning);
  meanings = shuffleArray(meanings);

  displayedItems.forEach(obj=>{
    const div = document.createElement("div");
    div.className="item";
    div.textContent = obj.name;
    div.dataset.meaning=obj.meaning;
    div.addEventListener("click",()=> selectItem(div));
    itemsDiv.appendChild(div);
  });

  meanings.forEach(m=>{
    const div = document.createElement("div");
    div.className="meaning";
    div.textContent = m;
    div.addEventListener("click",()=> selectMeaning(div));
    meaningsDiv.appendChild(div);
  });
}

function selectItem(div){
  document.querySelectorAll(".item").forEach(i=>i.classList.remove("selected"));
  div.classList.add("selected");
  selectedItem = div;
}

function selectMeaning(div){
  if(!selectedItem) return;
  matches.set(selectedItem.dataset.meaning, div);
  selectedItem.classList.add("matched");
  div.classList.add("matched");
  selectedItem.classList.remove("selected");
  selectedItem = null;
}
document.getElementById("resetSelectionsBtn").addEventListener("click", ()=>{
  // Tüm item ve meaning kutularındaki seçimleri ve renkleri temizle
  document.querySelectorAll(".item, .meaning").forEach(el => {
    el.classList.remove("selected", "matched", "correct", "wrong");
  });
  matches.clear();
  selectedItem = null;
  document.getElementById("result").textContent = "";
});


document.getElementById("checkBtn").addEventListener("click", ()=>{
  let correct=0;
  matches.forEach((meaningDiv, meaning)=>{
    if(meaningDiv.textContent===meaning){
      meaningDiv.classList.add("correct");
      correct++;
    } else {
      meaningDiv.classList.add("wrong");
    }
  });
  document.getElementById("result").textContent=`Doğru: ${correct} / 4`;
});

document.getElementById("restartBtn").addEventListener("click", ()=>{
  startGame();
});

function shuffleArray(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

let deck = [...words];
let index = 0;

const card = document.getElementById("card");
const $ = id => document.getElementById(id);

function render() {
  const w = deck[index];
  card.classList.remove("flipped");
  $("english").textContent = w.en;
  $("hanzi").textContent = w.zh;
  $("pinyin").textContent = w.pinyin;
  $("exZh").textContent = w.exZh;
  $("exEn").textContent = w.exEn;
  $("counter").textContent = `Card ${index + 1} / ${deck.length}`;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Your browser doesn't support speech.");
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = 0.8;
  const voice = speechSynthesis.getVoices().find(v => v.lang.startsWith("zh"));
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

card.addEventListener("click", () => card.classList.toggle("flipped"));
$("speak").addEventListener("click", e => {
  e.stopPropagation();           // don't flip the card
  speak(deck[index].zh);
});
$("next").addEventListener("click", () => { index = (index + 1) % deck.length; render(); });
$("prev").addEventListener("click", () => { index = (index - 1 + deck.length) % deck.length; render(); });
$("shuffle").addEventListener("click", () => {
  deck.sort(() => Math.random() - 0.5);
  index = 0;
  render();
});

speechSynthesis.onvoiceschanged = () => {};  // voices load asynchronously
render();
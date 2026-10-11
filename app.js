const words = Object.entries(data).flatMap(([cat, list]) =>
  list.map(([en, zh, pinyin, exZh, exEn]) => ({ cat, en, zh, pinyin, exZh, exEn })));

const $ = id => document.getElementById(id);
const card = $("card");
let current = "all";
let deck = [...words];
let index = 0;

function buildChips() {
  const box = $("cats");
  const make = (key, label, n) => {
    const b = document.createElement("button");
    b.className = "chip" + (key === current ? " active" : "");
    b.textContent = `${label} (${n})`;
    b.onclick = () => { current = key; setDeck(); buildChips(); };
    box.appendChild(b);
  };
  box.innerHTML = "";
  make("all", "📚 All words", words.length);
  Object.keys(LABELS).forEach(k => make(k, LABELS[k], words.filter(w => w.cat === k).length));
}

function setDeck() {
  deck = current === "all" ? [...words] : words.filter(w => w.cat === current);
  index = 0;
  render();
}

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
  if (!("speechSynthesis" in window)) { alert("Your browser doesn't support speech."); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = 0.8;
  const voice = (speechSynthesis.getVoices() || []).find(v => v.lang.startsWith("zh"));
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

card.addEventListener("click", () => card.classList.toggle("flipped"));
$("speak").onclick = e => { e.stopPropagation(); speak(deck[index].zh.replace(/ \/ .*/, "")); };
$("speakEx").onclick = e => { e.stopPropagation(); speak(deck[index].exZh.replace(/^[AB]: /, "")); };
$("next").onclick = () => { index = (index + 1) % deck.length; render(); };
$("prev").onclick = () => { index = (index - 1 + deck.length) % deck.length; render(); };
$("shuffle").onclick = () => { deck.sort(() => Math.random() - 0.5); index = 0; render(); };

buildChips();
render();
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {};

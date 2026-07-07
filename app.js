const STORAGE_KEY = "supplement-stock-v1";

const defaultItems = [
  {
    id: crypto.randomUUID(), name: "NOW Psyllium Husk Caps", totalUnits: 180, remainingUnits: 178,
    unitLabel: "カプセル", dailyUnits: 4, price: 0, startDate: "2026-07-07", store: "iHerb",
    memo: "7/7夜に2カプセル使用済み。次回は360カプセル版候補。"
  },
  {
    id: crypto.randomUUID(), name: "Life Extension Two-Per-Day", totalUnits: 120, remainingUnits: 119,
    unitLabel: "錠", dailyUnits: 2, price: 0, startDate: "2026-07-07", store: "iHerb",
    memo: "7/7夜に1錠使用済み。"
  },
  {
    id: crypto.randomUUID(), name: "アリナミン ビタミンC2000", totalUnits: 300, remainingUnits: 300,
    unitLabel: "錠", dailyUnits: 4, price: 0, startDate: "2026-07-07", store: "Amazon等",
    memo: "1日4錠。朝2・夜2。"
  }
];

let items = loadItems();

function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : defaultItems;
}
function saveItems() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function daysLeft(item) { return item.dailyUnits > 0 ? item.remainingUnits / item.dailyUnits : 0; }
function endDate(item) {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + Math.max(0, Math.ceil(daysLeft(item)) - 1));
  return d.toLocaleDateString("ja-JP", { year:"numeric", month:"long", day:"numeric", weekday:"short" });
}
function yen(n) { return n ? `${Math.round(n).toLocaleString()}円` : "未入力"; }
function monthlyCost(item) { return item.price && item.totalUnits ? (item.price / item.totalUnits) * item.dailyUnits * 30 : 0; }

function renderSummary() {
  const next = [...items].sort((a,b) => daysLeft(a) - daysLeft(b))[0];
  const monthly = items.reduce((sum, item) => sum + monthlyCost(item), 0);
  document.getElementById("summary").innerHTML = `
    <div class="summary-card">最短で無くなる<b>${next ? next.name : "なし"}</b><p>${next ? endDate(next) : ""}</p></div>
    <div class="summary-card">月額目安<b>${yen(monthly)}</b><p>価格入力済みのみ計算</p></div>
    <div class="summary-card">登録数<b>${items.length}件</b><p>端末内保存</p></div>
  `;
}

function renderList() {
  document.getElementById("list").innerHTML = items.map(item => `
    <article class="item">
      <div class="item-head">
        <div><h3>${escapeHtml(item.name)}</h3><span class="badge">${escapeHtml(item.store || "購入先未入力")}</span></div>
        <span class="badge">残り ${Number(item.remainingUnits).toLocaleString()} ${escapeHtml(item.unitLabel)}</span>
      </div>
      <div class="metrics">
        <div class="metric"><span>終了予定</span><b>${endDate(item)}</b></div>
        <div class="metric"><span>残り日数</span><b>${daysLeft(item).toFixed(1)}日</b></div>
        <div class="metric"><span>1日量</span><b>${item.dailyUnits} ${escapeHtml(item.unitLabel)}</b></div>
        <div class="metric"><span>月額目安</span><b>${yen(monthlyCost(item))}</b></div>
      </div>
      <p>${escapeHtml(item.memo || "")}</p>
      <div class="actions">
        <button onclick="useOne('${item.id}')">1回分飲んだ</button>
        <button class="ghost" onclick="editItem('${item.id}')">編集</button>
        <button class="ghost danger" onclick="deleteItem('${item.id}')">削除</button>
      </div>
    </article>
  `).join("") || `<p>登録がありません。</p>`;
}
function render() { renderSummary(); renderList(); }
function escapeHtml(s) { return String(s).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }

window.useOne = (id) => {
  const item = items.find(x => x.id === id);
  if (!item) return;
  const perDose = item.dailyUnits / 2;
  item.remainingUnits = Math.max(0, Number((item.remainingUnits - perDose).toFixed(2)));
  saveItems(); render();
};
window.editItem = (id) => {
  const item = items.find(x => x.id === id);
  if (!item) return;
  for (const key of ["name","totalUnits","unitLabel","dailyUnits","remainingUnits","price","startDate","store","memo"]) {
    document.getElementById(key).value = item[key] ?? "";
  }
  document.getElementById("editId").value = id;
  scrollTo({ top: 0, behavior: "smooth" });
};
window.deleteItem = (id) => {
  if (!confirm("削除しますか？")) return;
  items = items.filter(x => x.id !== id);
  saveItems(); render();
};

document.getElementById("supplementForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("editId").value || crypto.randomUUID();
  const item = {
    id,
    name: name.value.trim(), totalUnits: Number(totalUnits.value), unitLabel: unitLabel.value.trim(),
    dailyUnits: Number(dailyUnits.value), remainingUnits: Number(remainingUnits.value), price: Number(price.value || 0),
    startDate: startDate.value, store: store.value.trim(), memo: memo.value.trim()
  };
  const idx = items.findIndex(x => x.id === id);
  if (idx >= 0) items[idx] = item; else items.push(item);
  saveItems(); e.target.reset(); editId.value = ""; render();
});
document.getElementById("resetForm").onclick = () => { supplementForm.reset(); editId.value = ""; };
document.getElementById("restoreDefault").onclick = () => {
  if (!confirm("初期データに戻しますか？現在の登録内容は消えます。")) return;
  items = structuredClone(defaultItems); saveItems(); render();
};
document.getElementById("exportJson").onclick = async () => {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "supplement-stock-backup.json"; a.click();
  URL.revokeObjectURL(url);
};

if ("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js");
render();

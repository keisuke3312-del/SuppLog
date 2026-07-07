const STORAGE_KEY = "supplog-v2";
const OLD_STORAGE_KEY = "supplement-stock-v1";

const defaultItems = [
  {
    id: crypto.randomUUID(),
    name: "NOW Psyllium Husk Caps",
    category: "食物繊維",
    totalUnits: 180,
    remainingUnits: 178,
    unitLabel: "カプセル",
    dailyUnits: 4,
    price: 0,
    startDate: "2026-07-07",
    store: "iHerb",
    memo: "7/7夜に2カプセル使用済み。次回は360カプセル版候補。"
  },
  {
    id: crypto.randomUUID(),
    name: "Life Extension Two-Per-Day",
    category: "ビタミン・ミネラル",
    totalUnits: 120,
    remainingUnits: 119,
    unitLabel: "錠",
    dailyUnits: 2,
    price: 0,
    startDate: "2026-07-07",
    store: "iHerb",
    memo: "7/7夜に1錠使用済み。"
  },
  {
    id: crypto.randomUUID(),
    name: "アリナミン ビタミンC2000",
    category: "医薬品・その他",
    totalUnits: 300,
    remainingUnits: 300,
    unitLabel: "錠",
    dailyUnits: 4,
    price: 0,
    startDate: "2026-07-07",
    store: "Amazon等",
    memo: "1日4錠。朝2・夜2。"
  }
];

let items = loadItems();
let selectedId = null;

function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  const oldSaved = localStorage.getItem(OLD_STORAGE_KEY);
  if (oldSaved) {
    const migrated = JSON.parse(oldSaved).map(item => ({
      ...item,
      category: item.category || inferCategory(item.name)
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  }

  return structuredClone(defaultItems);
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function inferCategory(name = "") {
  if (name.includes("Psyllium") || name.includes("サイリウム")) return "食物繊維";
  if (name.includes("Two") || name.includes("ビタミン") || name.includes("Vitamin")) return "ビタミン・ミネラル";
  return "医薬品・その他";
}

function daysLeft(item) {
  return item.dailyUnits > 0 ? item.remainingUnits / item.dailyUnits : 0;
}

function endDate(item) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + Math.max(0, Math.ceil(daysLeft(item)) - 1));
  return d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", weekday: "short" });
}

function longEndDate(item) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + Math.max(0, Math.ceil(daysLeft(item)) - 1));
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

function yen(n) {
  return Number(n) > 0 ? `${Math.round(n).toLocaleString()}円` : "未入力";
}

function costPerDay(item) {
  return item.price && item.totalUnits ? (Number(item.price) / Number(item.totalUnits)) * Number(item.dailyUnits) : 0;
}

function monthlyCost(item) {
  return costPerDay(item) * 30;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
}

function statusClass(item) {
  const d = daysLeft(item);
  if (d <= 14) return "danger-status";
  if (d <= 30) return "warn-status";
  return "ok-status";
}

function renderSummary() {
  const next = [...items].sort((a, b) => daysLeft(a) - daysLeft(b))[0];
  const monthly = items.reduce((sum, item) => sum + monthlyCost(item), 0);
  const yearly = monthly * 12;
  document.getElementById("summary").innerHTML = `
    <div class="summary-card"><span>最短終了</span><b>${next ? escapeHtml(shortName(next.name)) : "なし"}</b><p>${next ? longEndDate(next) : ""}</p></div>
    <div class="summary-card"><span>月額目安</span><b>${yen(monthly)}</b><p>価格入力済みのみ</p></div>
    <div class="summary-card"><span>年間目安</span><b>${yen(yearly)}</b><p>概算</p></div>
  `;
}

function shortName(name) {
  if (name === "Life Extension Two-Per-Day") return "Two-Per-Day";
  if (name === "NOW Psyllium Husk Caps") return "サイリウム";
  if (name.includes("アリナミン")) return "ビタミンC2000";
  return name;
}

function renderCategoryList() {
  const categories = ["ビタミン・ミネラル", "食物繊維", "医薬品・その他"];
  const html = categories.map(categoryName => {
    const categoryItems = items.filter(item => (item.category || inferCategory(item.name)) === categoryName);
    if (!categoryItems.length) return "";
    return `
      <section class="category-block">
        <h3>${escapeHtml(categoryName)}</h3>
        <div class="compact-list">
          ${categoryItems.map(item => renderCompactItem(item)).join("")}
        </div>
      </section>
    `;
  }).join("");
  document.getElementById("categoryList").innerHTML = html || `<p>登録がありません。</p>`;
}

function renderCompactItem(item) {
  return `
    <button class="compact-item ${statusClass(item)}" type="button" onclick="openDetail('${item.id}')">
      <span class="item-main">
        <strong>${escapeHtml(shortName(item.name))}</strong>
        <small>${escapeHtml(item.store || "購入先未入力")}</small>
      </span>
      <span class="item-stock">
        <b>${Number(item.remainingUnits).toLocaleString()}${escapeHtml(item.unitLabel)}</b>
        <small>残り${daysLeft(item).toFixed(1)}日・${endDate(item)}</small>
      </span>
    </button>
  `;
}

function renderDetail() {
  const card = document.getElementById("detailCard");
  const item = items.find(x => x.id === selectedId);
  if (!item) {
    card.hidden = true;
    return;
  }

  card.hidden = false;
  document.getElementById("detailTitle").textContent = shortName(item.name);
  document.getElementById("detailView").innerHTML = `
    <div class="detail-header">
      <div>
        <p class="full-name">${escapeHtml(item.name)}</p>
        <span class="badge">${escapeHtml(item.category || inferCategory(item.name))}</span>
      </div>
      <button onclick="useDose('${item.id}')">1回分飲んだ</button>
    </div>
    <div class="metrics">
      <div class="metric"><span>残量</span><b>${Number(item.remainingUnits).toLocaleString()} ${escapeHtml(item.unitLabel)}</b></div>
      <div class="metric"><span>終了予定</span><b>${longEndDate(item)}</b></div>
      <div class="metric"><span>残り日数</span><b>${daysLeft(item).toFixed(1)}日</b></div>
      <div class="metric"><span>1日量</span><b>${item.dailyUnits} ${escapeHtml(item.unitLabel)}</b></div>
      <div class="metric"><span>購入価格</span><b>${yen(item.price)}</b></div>
      <div class="metric"><span>1日コスト</span><b>${yen(costPerDay(item))}</b></div>
      <div class="metric"><span>月額目安</span><b>${yen(monthlyCost(item))}</b></div>
      <div class="metric"><span>購入先</span><b>${escapeHtml(item.store || "未入力")}</b></div>
    </div>
    ${item.memo ? `<p class="memo">${escapeHtml(item.memo)}</p>` : ""}
    <div class="actions">
      <button class="ghost" onclick="openEdit('${item.id}')">編集</button>
      <button class="ghost danger" onclick="deleteItem('${item.id}')">削除</button>
    </div>
  `;
}

function render() {
  renderSummary();
  renderCategoryList();
  renderDetail();
}

window.openDetail = (id) => {
  selectedId = id;
  hideForm();
  renderDetail();
  document.getElementById("detailCard").scrollIntoView({ behavior: "smooth", block: "start" });
};

window.useDose = (id) => {
  const item = items.find(x => x.id === id);
  if (!item) return;
  const perDose = item.dailyUnits / 2;
  item.remainingUnits = Math.max(0, Number((Number(item.remainingUnits) - perDose).toFixed(2)));
  saveItems();
  render();
};

window.openEdit = (id) => {
  const item = items.find(x => x.id === id);
  if (!item) return;
  showForm("edit", item);
};

window.deleteItem = (id) => {
  const item = items.find(x => x.id === id);
  if (!item || !confirm(`${shortName(item.name)}を削除しますか？`)) return;
  items = items.filter(x => x.id !== id);
  if (selectedId === id) selectedId = null;
  saveItems();
  hideForm();
  render();
};

function showForm(mode, item = null) {
  const formCard = document.getElementById("formCard");
  const form = document.getElementById("supplementForm");
  form.reset();
  document.getElementById("formTitle").textContent = mode === "edit" ? "編集" : "新規登録";
  document.getElementById("deleteFromForm").hidden = mode !== "edit";

  if (item) {
    for (const key of ["name", "category", "totalUnits", "unitLabel", "dailyUnits", "remainingUnits", "price", "startDate", "store", "memo"]) {
      document.getElementById(key).value = item[key] ?? "";
    }
    document.getElementById("editId").value = item.id;
  } else {
    document.getElementById("editId").value = "";
    document.getElementById("category").value = "ビタミン・ミネラル";
    document.getElementById("startDate").value = new Date().toISOString().slice(0, 10);
  }

  formCard.hidden = false;
  formCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideForm() {
  document.getElementById("formCard").hidden = true;
  document.getElementById("supplementForm").reset();
  document.getElementById("editId").value = "";
}

document.getElementById("newItem").onclick = () => showForm("new");
document.getElementById("closeDetail").onclick = () => { selectedId = null; renderDetail(); };
document.getElementById("cancelEdit").onclick = hideForm;

document.getElementById("supplementForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("editId").value || crypto.randomUUID();
  const item = {
    id,
    name: document.getElementById("name").value.trim(),
    category: document.getElementById("category").value,
    totalUnits: Number(document.getElementById("totalUnits").value),
    unitLabel: document.getElementById("unitLabel").value.trim(),
    dailyUnits: Number(document.getElementById("dailyUnits").value),
    remainingUnits: Number(document.getElementById("remainingUnits").value),
    price: Number(document.getElementById("price").value || 0),
    startDate: document.getElementById("startDate").value,
    store: document.getElementById("store").value.trim(),
    memo: document.getElementById("memo").value.trim()
  };

  const idx = items.findIndex(x => x.id === id);
  if (idx >= 0) items[idx] = item;
  else items.push(item);

  selectedId = id;
  saveItems();
  hideForm();
  render();
});

document.getElementById("deleteFromForm").onclick = () => {
  const id = document.getElementById("editId").value;
  if (id) window.deleteItem(id);
};

document.getElementById("restoreDefault").onclick = () => {
  if (!confirm("初期データに戻しますか？現在の登録内容は消えます。")) return;
  items = structuredClone(defaultItems);
  selectedId = null;
  saveItems();
  hideForm();
  render();
};

document.getElementById("exportJson").onclick = () => {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "supplog-backup.json";
  a.click();
  URL.revokeObjectURL(url);
};

if ("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js");
render();

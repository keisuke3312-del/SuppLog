const APP_VERSION = "v6.1.0";
const STORAGE_KEY = "supplog-v3";
const MIGRATION_KEYS = ["supplog-v2", "supplement-stock-v1"];

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
    alertDays: 14,
    lastAutoDate: "2026-07-07",
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
    alertDays: 14,
    lastAutoDate: "2026-07-07",
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
    alertDays: 14,
    lastAutoDate: "2026-07-07",
    memo: "1日4錠。朝2・夜2。"
  }
];

const nutrientTargets = {
  "ビタミンA": { amount: 850, unit: "μg" },
  "ビタミンC": { amount: 100, unit: "mg" },
  "ビタミンD": { amount: 9, unit: "μg" },
  "ビタミンE": { amount: 6, unit: "mg" },
  "ビタミンB1": { amount: 1.4, unit: "mg" },
  "ビタミンB2": { amount: 1.6, unit: "mg" },
  "ナイアシン": { amount: 15, unit: "mg" },
  "ビタミンB6": { amount: 1.4, unit: "mg" },
  "葉酸": { amount: 240, unit: "μg" },
  "ビタミンB12": { amount: 2.4, unit: "μg" },
  "ビオチン": { amount: 50, unit: "μg" },
  "パントテン酸": { amount: 5, unit: "mg" },
  "ヨウ素": { amount: 130, unit: "μg" },
  "マグネシウム": { amount: 340, unit: "mg" },
  "亜鉛": { amount: 11, unit: "mg" },
  "セレン": { amount: 30, unit: "μg" },
  "マンガン": { amount: 4, unit: "mg" },
  "クロム": { amount: 10, unit: "μg" },
  "モリブデン": { amount: 30, unit: "μg" },
  "カルシウム": { amount: 800, unit: "mg" },
  "食物繊維": { amount: 22, unit: "g" },
  "水溶性食物繊維": { amount: null, unit: "g" },
  "サイリウム原料": { amount: null, unit: "g" },
  "アップルペクチン": { amount: null, unit: "mg" }
};

const nutritionProfiles = {
  psyllium: [
    { name: "食物繊維", amount: 1, unit: "g", servingUnits: 2, source: "NOW Psyllium" },
    { name: "水溶性食物繊維", amount: 0.9, unit: "g", servingUnits: 2, source: "NOW Psyllium" },
    { name: "サイリウム原料", amount: 1.4, unit: "g", servingUnits: 2, source: "NOW Psyllium" },
    { name: "アップルペクチン", amount: 100, unit: "mg", servingUnits: 2, source: "NOW Psyllium" }
  ],
  twoPerDay: [
    { name: "ビタミンA", amount: 1500, unit: "μg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ビタミンC", amount: 470, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ビタミンD", amount: 50, unit: "μg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ビタミンE", amount: 67, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ビタミンB1", amount: 75, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ビタミンB2", amount: 50, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ナイアシン", amount: 50, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ビタミンB6", amount: 75, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "葉酸", amount: 680, unit: "μg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ビタミンB12", amount: 300, unit: "μg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ビオチン", amount: 300, unit: "μg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "パントテン酸", amount: 50, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "ヨウ素", amount: 150, unit: "μg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "マグネシウム", amount: 100, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "亜鉛", amount: 25, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "セレン", amount: 200, unit: "μg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "マンガン", amount: 2, unit: "mg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "クロム", amount: 200, unit: "μg", servingUnits: 2, source: "Two-Per-Day" },
    { name: "モリブデン", amount: 100, unit: "μg", servingUnits: 2, source: "Two-Per-Day" }
  ],
  alinaminC: [
    { name: "ビタミンC", amount: 2000, unit: "mg", servingUnits: 6, source: "ビタミンC2000" },
    { name: "カルシウム", amount: 68, unit: "mg", servingUnits: 6, source: "ビタミンC2000" },
    { name: "ビタミンB2", amount: 6, unit: "mg", servingUnits: 6, source: "ビタミンC2000" }
  ]
};

let items = loadItems();
let selectedId = null;
let screen = "list";
let detailMode = "view";
let autoAdjustNotice = "";

function todayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function dateDiffDays(fromIso, toIso = todayIso()) {
  const from = new Date(`${fromIso}T00:00:00`);
  const to = new Date(`${toIso}T00:00:00`);
  const diff = Math.floor((to - from) / 86400000);
  return Number.isFinite(diff) ? Math.max(0, diff) : 0;
}

function defaultAlertDays(item = {}) {
  // 通知は早すぎるとノイズになるため、基本は残り14日以下。
  // iHerb商品も1週間前注文で概ね間に合う前提だが、余裕を見て2週間前から表示する。
  return 14;
}

function loadItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeItems(JSON.parse(saved));
    for (const key of MIGRATION_KEYS) {
      const oldSaved = localStorage.getItem(key);
      if (oldSaved) {
        const migrated = normalizeItems(JSON.parse(oldSaved));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch (e) {
    console.warn("SuppLog load failed", e);
  }
  return structuredClone(defaultItems);
}

function normalizeItems(raw) {
  return raw.map(item => ({
    id: item.id || crypto.randomUUID(),
    name: item.name || "未名称",
    category: item.category || inferCategory(item.name),
    totalUnits: Number(item.totalUnits || 0),
    remainingUnits: Number(item.remainingUnits ?? item.totalUnits ?? 0),
    unitLabel: item.unitLabel || "個",
    dailyUnits: Number(item.dailyUnits || 1),
    price: Number(item.price || 0),
    startDate: item.startDate || todayIso(),
    store: item.store || "",
    alertDays: Number(item.alertDays ?? defaultAlertDays(item)),
    lastAutoDate: item.lastAutoDate || item.startDate || todayIso(),
    memo: item.memo || ""
  }));
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function inferCategory(name = "") {
  if (name.includes("Psyllium") || name.includes("サイリウム")) return "食物繊維";
  if (name.includes("Two") || name.includes("ビタミン") || name.includes("Vitamin")) return "ビタミン・ミネラル";
  return "医薬品・その他";
}

function profileKey(item) {
  const name = item.name || "";
  if (name.includes("Psyllium") || name.includes("サイリウム")) return "psyllium";
  if (name.includes("Two-Per-Day") || name.includes("Two")) return "twoPerDay";
  if (name.includes("アリナミン") || name.includes("ビタミンC2000")) return "alinaminC";
  return null;
}

function daysLeft(item) {
  return item.dailyUnits > 0 ? Number(item.remainingUnits) / Number(item.dailyUnits) : 0;
}

function daysText(item) {
  const d = daysLeft(item);
  if (!Number.isFinite(d)) return "-";
  return d >= 10 ? Math.floor(d).toString() : d.toFixed(1);
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

function monthlyCost(item) { return costPerDay(item) * 30; }
function yearlyCost(item) { return costPerDay(item) * 365; }

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
}

function statusClass(item) {
  const d = daysLeft(item);
  if (d <= 0) return "critical-status";
  if (d <= 7) return "danger-status";
  if (d <= 14) return "warn-status";
  if (d <= 30) return "caution-status";
  return "ok-status";
}

function statusIcon(item) {
  const d = daysLeft(item);
  if (d <= 0) return "×";
  if (d <= 7) return "!";
  if (d <= 14) return "△";
  if (d <= 30) return "○";
  return "✓";
}

function statusLabel(item) {
  const d = daysLeft(item);
  if (d <= 0) return "在庫切れ";
  if (d <= 7) return "補充推奨";
  if (d <= 14) return "そろそろ";
  if (d <= 30) return "1か月未満";
  return "余裕あり";
}

function shortName(name) {
  if (name === "Life Extension Two-Per-Day") return "Two-Per-Day";
  if (name === "NOW Psyllium Husk Caps") return "サイリウム";
  if (name.includes("アリナミン")) return "ビタミンC2000";
  return name;
}

function formatAmount(n) {
  const value = Math.round(Number(n) * 10) / 10;
  return Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function nutrientRowsForItem(item) {
  const key = profileKey(item);
  if (!key) return [];
  const profile = nutritionProfiles[key];
  return profile.map(row => {
    const multiplier = Number(item.dailyUnits || 0) / Number(row.servingUnits || 1);
    return { ...row, amount: row.amount * multiplier, itemName: shortName(item.name) };
  });
}

function applyAutoConsumption() {
  const today = todayIso();
  let changed = false;
  let lines = [];
  for (const item of items) {
    if (!item.lastAutoDate) item.lastAutoDate = item.startDate || today;
    const days = dateDiffDays(item.lastAutoDate, today);
    if (days <= 0) continue;
    const consume = Number(item.dailyUnits || 0) * days;
    if (consume > 0) {
      const before = Number(item.remainingUnits || 0);
      item.remainingUnits = Math.max(0, Number((before - consume).toFixed(2)));
      lines.push(`${shortName(item.name)} -${formatAmount(consume)}${item.unitLabel}`);
      changed = true;
    }
    item.lastAutoDate = today;
  }
  if (changed) {
    saveItems();
    autoAdjustNotice = `${dateDiffDays(items[0]?.lastAutoDate || today, today)}日分の自動消費を反映しました。`;
    // 上の計算は保存後0日になるため、実表示は各サプリの減算内容を出す
    autoAdjustNotice = `自動消費を反映：${lines.join(" / ")}`;
  }
}

function replenishAmount(item) {
  return Math.max(0, Number(item.totalUnits || 0) - Number(item.remainingUnits || 0));
}

function needsAlert(item) {
  return daysLeft(item) <= Number(item.alertDays ?? 14);
}

function collectNutrition() {
  const map = new Map();
  for (const item of items) {
    for (const row of nutrientRowsForItem(item)) {
      const key = row.name;
      if (!map.has(key)) map.set(key, { name: row.name, unit: row.unit, amount: 0, sources: [] });
      const current = map.get(key);
      current.amount += row.amount;
      current.sources.push({ source: row.itemName, amount: row.amount, unit: row.unit });
    }
  }
  return [...map.values()].sort((a, b) => {
    const order = ["食物繊維", "ビタミンC", "ビタミンD", "亜鉛", "マグネシウム", "カルシウム"];
    const ai = order.indexOf(a.name), bi = order.indexOf(b.name);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    return a.name.localeCompare(b.name, "ja");
  });
}

function renderSystemNotice() {
  const el = document.getElementById("systemNotice");
  if (!el) return;
  if (!autoAdjustNotice || screen !== "list") {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  el.hidden = false;
  el.innerHTML = `<span>${escapeHtml(autoAdjustNotice)}</span><button class="ghost" onclick="dismissNotice()">閉じる</button>`;
}

function renderAlertBox() {
  const alerts = [...items].filter(needsAlert).sort((a, b) => daysLeft(a) - daysLeft(b));
  const box = document.getElementById("alertBox");
  if (!alerts.length || screen !== "list") {
    box.innerHTML = "";
    box.hidden = true;
    return;
  }
  box.hidden = false;
  box.innerHTML = `
    <div class="alert-title">補充アラート</div>
    <div class="alert-list">
      ${alerts.map(item => `
        <button class="alert-item ${statusClass(item)}" onclick="openDetail('${item.id}')">
          <span class="alert-icon">${statusIcon(item)}</span>
          <span><b>${escapeHtml(shortName(item.name))}</b><small>${statusLabel(item)} / 残り${daysText(item)}日 / アラート${item.alertDays || 30}日前設定</small></span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderStockStrip() {
  const sorted = [...items].sort((a, b) => daysLeft(a) - daysLeft(b));
  document.getElementById("stockStrip").innerHTML = sorted.map(item => `
    <button class="stock-pill ${statusClass(item)}" type="button" onclick="openDetail('${item.id}')">
      <span class="status-icon" aria-hidden="true">${statusIcon(item)}</span>
      <span class="stock-name">${escapeHtml(shortName(item.name))}</span>
      <span class="stock-days">${daysText(item)}日</span>
      <span class="status-badge">${statusLabel(item)}</span>
      <span class="stock-meta">残量 ${Number(item.remainingUnits).toLocaleString()}${escapeHtml(item.unitLabel)} / 1日${item.dailyUnits}${escapeHtml(item.unitLabel)}</span>
    </button>
  `).join("");
}

function renderRoutineCard() {
  const card = document.getElementById("routineCard");
  if (screen !== "list") {
    card.hidden = true;
    return;
  }
  card.hidden = false;
  card.innerHTML = `
    <div class="routine-head">
      <h2>飲み方</h2>
      <span>毎日の固定ルーティン</span>
    </div>
    <div class="routine-grid">
      <div class="routine-block"><b>朝・食前</b><span>サイリウム 2カプセル<br>水300〜500mL</span></div>
      <div class="routine-block"><b>朝食後</b><span>Two-Per-Day 1錠<br>ビタミンC2000 2錠</span></div>
      <div class="routine-block"><b>夜・食前</b><span>サイリウム 2カプセル<br>水300〜500mL</span></div>
      <div class="routine-block"><b>夕食後</b><span>Two-Per-Day 1錠<br>ビタミンC2000 2錠</span></div>
    </div>
    <p class="routine-note">食前が無理な日はサイリウムは食後でも可。寝る前は飲んだ後15〜30分は横にならない。</p>
  `;
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
      <span class="item-status" aria-hidden="true">${statusIcon(item)}</span>
      <span class="item-main">
        <strong>${escapeHtml(shortName(item.name))}</strong>
        <small>${escapeHtml(item.store || "購入先未入力")} / ${escapeHtml(item.category || inferCategory(item.name))}</small>
      </span>
      <span class="item-stock">
        <b>${daysText(item)}日</b>
        <small>${Number(item.remainingUnits).toLocaleString()}${escapeHtml(item.unitLabel)} / ${endDate(item)}</small>
      </span>
    </button>
  `;
}

function renderDetail() {
  const card = document.getElementById("detailCard");
  const item = items.find(x => x.id === selectedId);

  if (screen !== "detail" || !item) {
    card.hidden = true;
    return;
  }

  card.hidden = false;
  document.getElementById("detailTitle").textContent = detailMode === "edit" ? "編集" : shortName(item.name);
  document.getElementById("detailView").innerHTML = detailMode === "edit" ? renderEditForm(item) : renderDetailView(item);
}

function renderDetailView(item) {
  return `
    <div class="detail-header">
      <div>
        <p class="full-name">${escapeHtml(item.name)}</p>
        <span class="badge">${escapeHtml(item.category || inferCategory(item.name))}</span>
      </div>
      <button onclick="replenishItem('${item.id}')">満タン補充</button>
    </div>
    <div class="metrics">
      <div class="metric"><span>残り日数</span><b>${daysText(item)}日</b></div>
      <div class="metric"><span>状態</span><b>${statusLabel(item)}</b></div>
      <div class="metric"><span>終了予定</span><b>${longEndDate(item)}</b></div>
      <div class="metric"><span>残量</span><b>${Number(item.remainingUnits).toLocaleString()} ${escapeHtml(item.unitLabel)}</b></div>
      <div class="metric"><span>1日量</span><b>${item.dailyUnits} ${escapeHtml(item.unitLabel)}</b></div>
      <div class="metric"><span>購入価格</span><b>${yen(item.price)}</b></div>
      <div class="metric"><span>1日コスト</span><b>${yen(costPerDay(item))}</b></div>
      <div class="metric"><span>購入先</span><b>${escapeHtml(item.store || "未入力")}</b></div>
      <div class="metric"><span>通知開始</span><b>残り${item.alertDays || 14}日前</b></div>
      <div class="metric"><span>自動消費更新</span><b>${escapeHtml(item.lastAutoDate || "未設定")}</b></div>
      <div class="metric"><span>容量</span><b>${Number(item.totalUnits).toLocaleString()} ${escapeHtml(item.unitLabel)}</b></div>
    </div>
    ${item.memo ? `<p class="memo">${escapeHtml(item.memo)}</p>` : ""}
    <div class="actions">
      <button class="ghost" onclick="adjustStock('${item.id}', -1)">−1</button>
      <button class="ghost" onclick="adjustStock('${item.id}', 1)">＋1</button>
      <button class="ghost" onclick="openEdit('${item.id}')">編集</button>
      <button class="ghost danger" onclick="deleteItem('${item.id}')">削除</button>
    </div>
  `;
}

function renderEditForm(item) {
  return `
    <form id="inlineEditForm" onsubmit="saveEdit(event, '${item.id}')">
      <div class="form-grid">
        <label>商品名<input id="edit-name" required value="${escapeHtml(item.name)}" /></label>
        <label>カテゴリー
          <select id="edit-category">
            ${["ビタミン・ミネラル", "食物繊維", "医薬品・その他"].map(c => `<option value="${c}" ${item.category === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </label>
        <label>容量<input id="edit-totalUnits" required type="number" min="1" step="1" value="${item.totalUnits}" /></label>
        <label>単位<input id="edit-unitLabel" required value="${escapeHtml(item.unitLabel)}" /></label>
        <label>1日量<input id="edit-dailyUnits" required type="number" min="0.1" step="0.1" value="${item.dailyUnits}" /></label>
        <label>現在残量<input id="edit-remainingUnits" required type="number" min="0" step="0.1" value="${item.remainingUnits}" /></label>
        <label>購入価格<input id="edit-price" type="number" min="0" step="1" value="${item.price || ""}" placeholder="円" /></label>
        <label>開始日<input id="edit-startDate" type="date" value="${escapeHtml(item.startDate || "")}" /></label>
        <label>購入先<input id="edit-store" value="${escapeHtml(item.store || "")}" placeholder="iHerb / Amazon" /></label>
        <label>通知開始（日数）<input id="edit-alertDays" type="number" min="1" step="1" value="${item.alertDays || 14}" /></label>
        <label>自動消費の最終更新日<input id="edit-lastAutoDate" type="date" value="${escapeHtml(item.lastAutoDate || todayIso())}" /></label>
      </div>
      <label>メモ<textarea id="edit-memo" rows="3">${escapeHtml(item.memo || "")}</textarea></label>
      <div class="button-row">
        <button type="submit">保存</button>
        <button type="button" class="ghost" onclick="cancelEdit()">キャンセル</button>
      </div>
    </form>
  `;
}

function renderCostScreen() {
  const costScreen = document.getElementById("costScreen");
  if (screen !== "cost") {
    costScreen.hidden = true;
    return;
  }

  costScreen.hidden = false;
  const daily = items.reduce((sum, item) => sum + costPerDay(item), 0);
  const monthly = daily * 30;
  const yearly = daily * 365;

  document.getElementById("costView").innerHTML = `
    <div class="cost-total">
      <div class="metric"><span>1日</span><b>${yen(daily)}</b></div>
      <div class="metric"><span>月額目安</span><b>${yen(monthly)}</b></div>
      <div class="metric"><span>年間目安</span><b>${yen(yearly)}</b></div>
    </div>
    ${items.map(item => `
      <div class="cost-row">
        <div>
          <b>${escapeHtml(shortName(item.name))}</b>
          <small>${yen(item.price)} / ${Number(item.totalUnits).toLocaleString()}${escapeHtml(item.unitLabel)} / 1日${item.dailyUnits}${escapeHtml(item.unitLabel)}</small>
        </div>
        <div>
          <b>${yen(monthlyCost(item))}/月</b>
          <small>${yen(yearlyCost(item))}/年</small>
        </div>
      </div>
    `).join("")}
  `;
}

function renderNutritionScreen() {
  const nutritionScreen = document.getElementById("nutritionScreen");
  if (screen !== "nutrition") {
    nutritionScreen.hidden = true;
    return;
  }
  nutritionScreen.hidden = false;
  const rows = collectNutrition();
  document.getElementById("nutritionView").innerHTML = `
    <div class="nutrition-note">
      <b>登録済みサプリのみから計算</b>
      <span>通常の食事・外食・自炊は含みません。Two-Per-Day、ビタミンC2000、サイリウムは現在の1日量で計算しています。</span>
    </div>
    <div class="nutrition-list">
      ${rows.map(row => renderNutrientRow(row)).join("")}
    </div>
  `;
}

function renderNutrientRow(row) {
  const target = nutrientTargets[row.name];
  const targetAmount = target?.amount;
  const percent = targetAmount ? Math.round((row.amount / targetAmount) * 100) : null;
  const cappedPercent = percent ? Math.min(percent, 160) : 0;
  return `
    <details class="nutrient-row">
      <summary>
        <span class="nutrient-main">
          <b>${escapeHtml(row.name)}</b>
          <small>${formatAmount(row.amount)}${escapeHtml(row.unit)}${targetAmount ? ` / 目安 ${formatAmount(targetAmount)}${escapeHtml(target.unit)}` : ""}</small>
        </span>
        <span class="nutrient-percent">${percent ? `${percent}%` : "内訳"}</span>
      </summary>
      ${percent ? `<div class="bar"><span style="width:${cappedPercent}%"></span></div>` : ""}
      <div class="source-list">
        ${row.sources.map(src => `<div><span>${escapeHtml(src.source)}</span><b>${formatAmount(src.amount)}${escapeHtml(src.unit)}</b></div>`).join("")}
      </div>
    </details>
  `;
}

function renderScreens() {
  document.getElementById("listScreen").hidden = screen !== "list";
  document.getElementById("detailCard").hidden = screen !== "detail";
  document.getElementById("costScreen").hidden = screen !== "cost";
  document.getElementById("nutritionScreen").hidden = screen !== "nutrition";
}

function render() {
  renderSystemNotice();
  renderAlertBox();
  renderStockStrip();
  renderRoutineCard();
  renderCategoryList();
  renderScreens();
  renderDetail();
  renderCostScreen();
  renderNutritionScreen();
}

window.dismissNotice = () => { autoAdjustNotice = ""; render(); };

window.openDetail = (id) => {
  selectedId = id;
  screen = "detail";
  detailMode = "view";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.openEdit = (id) => {
  selectedId = id;
  screen = "detail";
  detailMode = "edit";
  render();
};

window.cancelEdit = () => {
  detailMode = "view";
  render();
};

window.saveEdit = (e, id) => {
  e.preventDefault();
  const item = {
    id,
    name: document.getElementById("edit-name").value.trim(),
    category: document.getElementById("edit-category").value,
    totalUnits: Number(document.getElementById("edit-totalUnits").value),
    unitLabel: document.getElementById("edit-unitLabel").value.trim(),
    dailyUnits: Number(document.getElementById("edit-dailyUnits").value),
    remainingUnits: Number(document.getElementById("edit-remainingUnits").value),
    price: Number(document.getElementById("edit-price").value || 0),
    startDate: document.getElementById("edit-startDate").value,
    store: document.getElementById("edit-store").value.trim(),
    alertDays: Number(document.getElementById("edit-alertDays").value || 14),
    lastAutoDate: document.getElementById("edit-lastAutoDate").value || todayIso(),
    memo: document.getElementById("edit-memo").value.trim()
  };

  const idx = items.findIndex(x => x.id === id);
  if (idx >= 0) items[idx] = item;
  else items.push(item);
  selectedId = id;
  detailMode = "view";
  saveItems();
  render();
};

window.adjustStock = (id, amount) => {
  const item = items.find(x => x.id === id);
  if (!item) return;
  item.remainingUnits = Math.max(0, Number((Number(item.remainingUnits) + Number(amount)).toFixed(2)));
  saveItems();
  render();
};

window.replenishItem = (id) => {
  const item = items.find(x => x.id === id);
  if (!item) return;
  const add = replenishAmount(item);
  const label = add > 0 ? `${formatAmount(add)}${item.unitLabel}追加して` : "";
  if (!confirm(`${shortName(item.name)}を${label}満タンにしますか？`)) return;
  item.remainingUnits = Number(item.totalUnits || item.remainingUnits || 0);
  item.lastAutoDate = todayIso();
  saveItems();
  render();
};

window.deleteItem = (id) => {
  const item = items.find(x => x.id === id);
  if (!item || !confirm(`${shortName(item.name)}を削除しますか？`)) return;
  items = items.filter(x => x.id !== id);
  selectedId = null;
  screen = "list";
  detailMode = "view";
  saveItems();
  render();
};

document.getElementById("newItem").onclick = () => {
  const item = {
    id: crypto.randomUUID(),
    name: "",
    category: "ビタミン・ミネラル",
    totalUnits: 1,
    remainingUnits: 1,
    unitLabel: "錠",
    dailyUnits: 1,
    price: 0,
    startDate: new Date().toISOString().slice(0, 10),
    store: "",
    alertDays: 14,
    lastAutoDate: todayIso(),
    memo: ""
  };
  items.push(item);
  selectedId = item.id;
  screen = "detail";
  detailMode = "edit";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

document.getElementById("closeDetail").onclick = () => {
  if (detailMode === "edit") detailMode = "view";
  else { selectedId = null; screen = "list"; }
  render();
};

document.getElementById("openCost").onclick = () => { screen = "cost"; render(); window.scrollTo({ top: 0, behavior: "smooth" }); };
document.getElementById("closeCost").onclick = () => { screen = "list"; render(); };
document.getElementById("openNutrition").onclick = () => { screen = "nutrition"; render(); window.scrollTo({ top: 0, behavior: "smooth" }); };
document.getElementById("closeNutrition").onclick = () => { screen = "list"; render(); };

document.getElementById("restoreDefault").onclick = () => {
  if (!confirm("初期データに戻しますか？現在の登録内容は消えます。")) return;
  items = structuredClone(defaultItems);
  selectedId = null;
  screen = "list";
  detailMode = "view";
  saveItems();
  render();
};

document.getElementById("exportJson").onclick = () => {
  const blob = new Blob([JSON.stringify({ app: "SuppLog", version: APP_VERSION, items }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "supplog-backup.json";
  a.click();
  URL.revokeObjectURL(url);
};

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.register(`service-worker.js?v=${APP_VERSION}`);
  registration.addEventListener("updatefound", () => {
    const worker = registration.installing;
    if (!worker) return;
    worker.addEventListener("statechange", () => {
      if (worker.state === "installed" && navigator.serviceWorker.controller) {
        worker.postMessage({ type: "SKIP_WAITING" });
      }
    });
  });
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!sessionStorage.getItem("supplog-reloaded-v61")) {
      sessionStorage.setItem("supplog-reloaded-v61", "1");
      location.reload();
    }
  });
}

applyAutoConsumption();
registerServiceWorker();
render();

// ===== 身份词库 =====
const leftWords = [
  "天赋超群的",
  "要上班的",
  "社恐严重的",
  "要早八的",
  "氪金成瘾的",
  "老二次元的",
  "初入圈的",
  "下楼梯骨折的",
  "上戒社的",
  "失业中的",
  "被亲戚催婚的"
  "没天赋的",
];

const rightWords = [
  "社畜",
  "学生",
  "自由职业者",
  "家里蹲",
  "斜杠青年",
  "研究生",
  "猫奴",
  "狗奴",
  "农村入",
  "死人"
];

let currentIdentity = { left: null, right: null };

// 全局游戏状态
const gameState = {
  basic: {
    playerName: "玩家",
    mainLeft: "",
    mainRight: "",
    rivalLeft: "",
    rivalRight: "",
    identityLeft: "",
    identityRight: "",
    fandomType: ""
  },
  stats: {
    cpHeat: 60,
    selfHeat: 10,
    power: 5,
    mental: 80,
    passion: 70,
    energy: 80,
    money: 50,
    social: 40
  },
  time: {
    month: 1,
    actionsPerMonth: 4,
    actionsLeft: 4
  },
  events: []  // 从 events.json 载入
};

function $(id) {
  return document.getElementById(id);
}

// ===== 初始化 =====
window.addEventListener("DOMContentLoaded", () => {
  setupPageSwitch();
  initIdentityModeSwitch();
  initManualSelectOptions();
  initSlotMachine();
  initStartGameButton();
  loadEvents();
});

// ===== 页面切换（基础信息页 -> 身份页） =====
function setupPageSwitch() {
  $("btn-to-page2").addEventListener("click", () => {
    const mainLeft = $("input-main-left").value.trim();
    const mainRight = $("input-main-right").value.trim();
    if (!mainLeft || !mainRight) {
      $("start-summary").textContent = "请先把主推 CP 的左右位填完整（例如 A × B）。";
      return;
    }
    $("start-page-1").classList.add("hidden");
    $("start-page-2").classList.remove("hidden");
  });

  $("btn-back-page1").addEventListener("click", () => {
    $("start-page-2").classList.add("hidden");
    $("start-page-1").classList.remove("hidden");
  });
}

// ===== 身份模式切换 =====
function initIdentityModeSwitch() {
  const radios = document.querySelectorAll("input[name='identityMode']");
  const randomPanel = $("identity-random");
  const manualPanel = $("identity-manual");

  radios.forEach(r => {
    r.addEventListener("change", () => {
      if (r.value === "random" && r.checked) {
        randomPanel.classList.remove("hidden");
        manualPanel.classList.add("hidden");
      }
      if (r.value === "manual" && r.checked) {
        manualPanel.classList.remove("hidden");
        randomPanel.classList.add("hidden");
      }
    });
  });
}

// ===== 自选身份下拉 =====
function initManualSelectOptions() {
  const selectLeft = $("select-left");
  const selectRight = $("select-right");

  leftWords.forEach(w => {
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = w;
    selectLeft.appendChild(opt);
  });

  rightWords.forEach(w => {
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = w;
    selectRight.appendChild(opt);
  });

  currentIdentity.left = leftWords[0];
  currentIdentity.right = rightWords[0];
  updateManualIdentityText();

  selectLeft.addEventListener("change", () => {
    currentIdentity.left = selectLeft.value;
    updateManualIdentityText();
  });
  selectRight.addEventListener("change", () => {
    currentIdentity.right = selectRight.value;
    updateManualIdentityText();
  });
}

function updateManualIdentityText() {
  $("identity-manual-result").textContent =
    "当前身份：" + currentIdentity.left + " " + currentIdentity.right;
}

// ===== 老虎机：先快后慢 =====
function initSlotMachine() {
  const btnSpin = $("btn-spin");
  const leftEl = $("slot-left");
  const rightEl = $("slot-right");
  const resultText = $("identity-result");
  let spinning = false;

  btnSpin.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;
    resultText.textContent = "身份抽取中…";

    let step = 0;
    let leftY = 0;
    let rightY = 0;

    function spinOneStep() {
      step++;

      // 随着 step 增加，间隔变大，相当于“慢下来”
      let interval;
      if (step < 8) interval = 60;      // 很快
      else if (step < 16) interval = 90;
      else if (step < 24) interval = 130;
      else interval = 180;              // 很慢

      // 每次滚动一格高度
      leftY += 32;
      rightY += 32;

      leftEl.classList.add("slot-animating");
      rightEl.classList.add("slot-animating");

      leftEl.style.transform = `translateY(${-(leftY % (32 * 3))}px)`;
      rightEl.style.transform = `translateY(${-(rightY % (32 * 3))}px)`;

      // 同时换文字内容
      leftEl.textContent = randomChoice(leftWords);
      rightEl.textContent = randomChoice(rightWords);

      if (step < 24) {
        setTimeout(spinOneStep, interval);
      } else {
        // 最后一次，确定结果
        const finalLeft = randomChoice(leftWords);
        const finalRight = randomChoice(rightWords);
        leftEl.textContent = finalLeft;
        rightEl.textContent = finalRight;
        leftEl.style.transform = "translateY(0)";
        rightEl.style.transform = "translateY(0)";

        currentIdentity.left = finalLeft;
        currentIdentity.right = finalRight;
        resultText.textContent = "当前身份：" + finalLeft + " " + finalRight;

        spinning = false;
      }
    }

    spinOneStep();
  });
}

// ===== 读取 events.json =====
async function loadEvents() {
  try {
    const res = await fetch("events.json");
    const data = await res.json();
    gameState.events = data;
  } catch (e) {
    console.error("加载 events.json 失败", e);
  }
}

// ===== 开始游戏按钮（从身份页进入主界面） =====
function initStartGameButton() {
  $("btn-start-game").addEventListener("click", () => {
    const playerName = $("input-playerName").value.trim() || "玩家";
    const mainLeft = $("input-main-left").value.trim();
    const mainRight = $("input-main-right").value.trim();
    const rivalLeft = $("input-rival-left").value.trim();
    const rivalRight = $("input-rival-right").value.trim();

    if (!mainLeft || !mainRight) return; // 理论上前一页已经校验过

    // 身份模式
    const mode = document.querySelector("input[name='identityMode']:checked").value;
    if (mode === "random") {
      if (!currentIdentity.left || !currentIdentity.right) {
        $("identity-result").textContent = "请先点“抽一抽”确定身份。";
        return;
      }
    } else {
      if (!currentIdentity.left || !currentIdentity.right) {
        currentIdentity.left = leftWords[0];
        currentIdentity.right = rightWords[0];
      }
    }

    // 主坑类型
    const fandomTypeValue = document.querySelector("input[name='fandomType']:checked").value;
    let fandomTypeLabel = "";
    if (fandomTypeValue === "3d") fandomTypeLabel = "三次元";
    if (fandomTypeValue === "2d") fandomTypeLabel = "二次元";
    if (fandomTypeValue === "2_5d") fandomTypeLabel = "二点五次元";

    // 写入 gameState.basic
    Object.assign(gameState.basic, {
      playerName,
      mainLeft,
      mainRight,
      rivalLeft,
      rivalRight,
      identityLeft: currentIdentity.left,
      identityRight: currentIdentity.right,
      fandomType: fandomTypeLabel
    });

    // 依据身份稍微调整初始属性
    adjustStatsByIdentity();

    // 切换到游戏主界面
    $("start-page-2").classList.add("hidden");
    $("game-container").classList.remove("hidden");

    renderBasicInfo();
    renderAllStats();
    nextEvent();  // 抽第一个事件
  });
}

// 根据身份微调属性
function adjustStatsByIdentity() {
  const l = gameState.basic.identityLeft;
  const r = gameState.basic.identityRight;
  const s = gameState.stats;

  if (l.includes("天赋超群")) {
    s.power += 5;
    s.passion += 5;
  }
  if (r.includes("社畜")) {
    s.energy -= 10;
    s.money += 15;
  }
  if (r.includes("学生")) {
    s.energy += 10;
    s.money -= 10;
  }
}

// ===== 渲染通用状态 =====
function renderAllStats() {
  const s = gameState.stats;
  $("stat-cpHeat").textContent = s.cpHeat;
  $("stat-selfHeat").textContent = s.selfHeat;
  $("stat-power").textContent = s.power;
  $("stat-mental").textContent = s.mental;
  $("stat-passion").textContent = s.passion;
  $("stat-energy").textContent = s.energy;
  $("stat-money").textContent = s.money;
  $("stat-social").textContent = s.social;

  const t = gameState.time;
  $("stat-time").textContent = `第 ${t.month} 月 · ${t.actionsLeft}/${t.actionsPerMonth}`;
}

function renderBasicInfo() {
  const b = gameState.basic;
  const mainCP = `${b.mainLeft}×${b.mainRight}`;
  const rivalCP = (b.rivalLeft && b.rivalRight)
    ? `${b.rivalLeft}×${b.rivalRight}`
    : "（未指定）";

  $("info-player").textContent = b.playerName;
  $("info-maincp").textContent = mainCP;
  $("info-rivalcp").textContent = rivalCP;
  $("info-identity").textContent = `${b.identityLeft} ${b.identityRight}`;
  $("info-fandom").textContent = b.fandomType;
}

// ===== 抽事件 + 月份推进 =====

// 抽一个随机事件并渲染
function nextEvent() {
  if (!gameState.events || gameState.events.length === 0) {
    $("event-title").textContent = "暂无事件";
    $("event-text").textContent = "events.json 还没写好，先休息一会儿吧。";
    $("event-options").innerHTML = "";
    return;
  }

  const ev = randomChoice(gameState.events);
  const b = gameState.basic;
  const mainCP = `${b.mainLeft}×${b.mainRight}`;
  const rivalCP = (b.rivalLeft && b.rivalRight)
    ? `${b.rivalLeft}×${b.rivalRight}`
    : "对家";

  const title = ev.title;
  const text = ev.text
    .replace(/MAIN_CP/g, mainCP)
    .replace(/RIVAL_CP/g, rivalCP);

  $("event-title").textContent = title;
  $("event-text").textContent = text;

  const box = $("event-options");
  box.innerHTML = "";

  ev.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "btn btn-secondary";
    btn.textContent = opt.label;
    btn.onclick = () => {
      applyEffects(opt.effects || {});
      useActionAndMaybeNextMonth();
      renderAllStats();
      nextEvent();
    };
    box.appendChild(btn);
  });
}

// 应用事件效果到属性
function applyEffects(effects) {
  const s = gameState.stats;
  for (const key in effects) {
    if (Object.prototype.hasOwnProperty.call(s, key)) {
      s[key] += effects[key];
    }
  }
}

// 消耗一个行动，如果用完则进入下个月
function useActionAndMaybeNextMonth() {
  const t = gameState.time;
  if (t.actionsLeft > 0) {
    t.actionsLeft -= 1;
  }
  if (t.actionsLeft === 0) {
    // 进入新月份
    t.month += 1;
    t.actionsLeft = t.actionsPerMonth;
    // 这里可以加“月底总结事件”等
  }
}
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
  "被亲戚催婚的",
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
  events: [],  // 从 events.json 载入
  introShown: false // 是否已经放过导入剧情
};
// 历史记录：每项为 { month, week, title, text }
gameState.history = [];

function $(id) {
  return document.getElementById(id);
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== 初始化 =====
window.addEventListener("DOMContentLoaded", () => {
  setupPageSwitch();
  initIdentityModeSwitch();
  initManualSelectOptions();
  initSlotMachine();
  initStartGameButton();
  initActionBar();
  loadEvents();
  loadIntroFlag();
});

// ====== introShown 持久化（localStorage） ======
function loadIntroFlag() {
  try {
    const raw = localStorage.getItem('introShown_v1');
    if (raw !== null) {
      gameState.introShown = JSON.parse(raw) === true;
    }
  } catch (e) {
    console.warn('读取 introShown 失败', e);
  }
}

function saveIntroFlag() {
  try {
    localStorage.setItem('introShown_v1', JSON.stringify(!!gameState.introShown));
  } catch (e) {
    console.warn('保存 introShown 失败', e);
  }
}

// ====== 状态快照与差值渲染 ======
function initStatsSnapshot() {
  gameState.lastStats = { ...gameState.stats };
}

function renderStatWithDiff(id, value, oldValue) {
  const el = $(id);
  if (!el) return;

  // 先移除旧的差值（如果有），保留数值本体
  const oldDiff = el.querySelector('.stat-diff');
  if (oldDiff) oldDiff.remove();

  // 显示当前值
  el.textContent = value;

  // 如果有变动，插入差值并保持，直到下一次 renderAllStats 调用覆盖为止
  if (typeof oldValue === 'number' && oldValue !== value) {
    const diff = value - oldValue;
    const span = document.createElement('span');
    span.className = 'stat-diff ' + (diff > 0 ? 'pos' : 'neg');
    span.textContent = (diff > 0 ? '+' : '') + diff;
    el.appendChild(span);
  }
}

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
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    // 兼容旧格式（array）和新格式（object 按 action 分组）
    if (Array.isArray(data)) {
      gameState.events = data;
      eventsByAction = {};
    } else if (typeof data === 'object' && data !== null) {
      // data e.g. { random: [...], browse: [...], study: [...], ... }
      // 填充 eventsByAction
      eventsByAction = {};
      for (const k in data) {
        if (Object.prototype.hasOwnProperty.call(data, k)) {
          eventsByAction[k] = Array.isArray(data[k]) ? data[k] : [];
        }
      }

      // 随机事件池：优先使用 random，否则合并所有子池
      if (Array.isArray(data.random)) {
        gameState.events = data.random;
      } else {
        const all = [];
        for (const k in eventsByAction) {
          all.push(...eventsByAction[k]);
        }
        gameState.events = all;
      }
    } else {
      gameState.events = [];
      eventsByAction = {};
    }
    console.log('事件池加载：随机事件', (gameState.events || []).length, '，按行动分组', Object.keys(eventsByAction || {}).join(','));
  } catch (e) {
    console.error("加载 events.json 失败", e);
  }
}

// 按行动分组的事件池（由 loadEvents 填充）
let eventsByAction = {};

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

      // 切换到游戏主界面并进入游戏流程
      startGame();
  });
}

  // ===== 开始游戏的统一入口（显示导入剧情，然后进入随机事件流） =====
  function startGame() {
    $("start-page-2").classList.add("hidden");
    $("game-container").classList.remove("hidden");

    renderBasicInfo();
    renderAllStats();

    // 如果还没展示导入剧情，先展示；否则直接抽事件
    if (!gameState.introShown) {
      renderIntroEvent();
    } else {
      nextRandomEvent();
    }
    // 显示底部行动条
    const actionBar = $("action-bar");
    if (actionBar) actionBar.classList.remove("hidden");
    // 初始化 stats 快照，用于渲染差值
    initStatsSnapshot();
  }

  // ===== 导入剧情（首次进入游戏时展示） =====
  function renderIntroEvent() {
    const b = gameState.basic;
    const mainCP = `${b.mainLeft}×${b.mainRight}`;
    const rivalCP = (b.rivalLeft && b.rivalRight)
      ? `${b.rivalLeft}×${b.rivalRight}`
      : "对家";

    const title = "踏入坑底的那一刻";
    const text =
      `你正式给自己按下了“确认入坑”的按钮。\n\n` +
      `从今天起，${mainCP} 会成为你日常生活的一部分，` +
      `而 ${rivalCP} 这几个字则会在你的视线边缘时不时闪过。\n\n` +
      `你躺在床上刷着手机，想决定今天的第一件事：`;

    const options = [
      {
        label: "先把主坑的基本设定/角色关系捋一捋，做个新手笔记。",
        effects: { cpHeat: 3, passion: 4, mental: 1 },
        result: "你认真查了一圈资料，对角色的时间线和设定有了大致印象。"
      },
      {
        label: "直接冲到同人tag，看看大家都在产些什么。",
        effects: { cpHeat: 4, passion: 3, selfHeat: 1, mental: -1 },
        result: "你一头扎进tag，收藏栏已经多了好几篇看起来就很危险的标题。"
      }
    ];

    // 标记已展示导入剧情并持久化
    gameState.introShown = true;
    saveIntroFlag();

    renderEvent(title, text, options, { after: () => {
      // 导入剧情结束后不立即强制下一步，renderEvent 会在选项处理后触发 nextRandomEvent
    } });
  }

  // ===== 统一渲染事件（标题、正文、选项） =====
  function renderEvent(title, text, options, { after } = {}) {
    $("event-title").textContent = title;
    $("event-text").textContent = text;
    const box = $("event-options");
    box.innerHTML = "";

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "btn btn-secondary";
      btn.textContent = opt.label;
      btn.onclick = () => {
        // 计算本月第几次行动（在推进月份前计算当前周数）
        const tNow = gameState.time;
        const actionIndex = tNow.actionsPerMonth - tNow.actionsLeft + 1;
        const weekLabel = `第 ${tNow.month} 月-第 ${actionIndex} 周`;

        // 应用属性变化
        applyEffects(opt.effects || {});
        renderAllStats();

        const resultText = (opt.result || '').toString();

        // 组成完整剧情文本：周标 + 事件标题 + 原始正文 + 选项结果
        const fullText = `${weekLabel}：\n${title}\n\n${text}\n\n【结果】${resultText}`;

        // 推进行动（月份/行动次数）
        useActionAndMaybeNextMonth();

        // 在事件区显示完整剧情
        $("event-title").textContent = title;
        $("event-text").textContent = fullText;

        // 记录历史并刷新历史栏
        gameState.history.push({ month: tNow.month, week: actionIndex, title: title, text: fullText });
        renderHistoryLog();

        if (after) after();

        // 如果导入剧情已经展示过，选择后进入随机事件流
        if (gameState.introShown) {
          nextRandomEvent();
        }
      };
      box.appendChild(btn);
    });
  }

  // ===== 抽取并渲染来自 events.json 的随机事件 =====
  function nextRandomEvent() {
    if (!gameState.events || gameState.events.length === 0) {
      $("event-title").textContent = "暂无事件";
      $("event-text").textContent = "events.json 没有读取到任何事件，先休息一会儿吧。";
      $("event-options").innerHTML = "";
      return;
    }

    const ev = randomChoice(gameState.events);
    const b = gameState.basic;
    const mainCP = `${b.mainLeft}×${b.mainRight}`;
    const rivalCP = (b.rivalLeft && b.rivalRight)
      ? `${b.rivalLeft}×${b.rivalRight}`
      : "对家";

    const title = ev.title || "未命名事件";
    const text = (ev.text || "").replace(/MAIN_CP/g, mainCP).replace(/RIVAL_CP/g, rivalCP);

    const options = (ev.options || []).map(o => ({
      label: o.label || "无名选项",
      effects: o.effects || {},
      result: o.result || ""
    }));

    if (options.length === 0) {
      options.push({ label: "继续下一件事", effects: {}, result: "你什么也没做，这天就这么过去了。" });
    }

    renderEvent(title, text, options);
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
// actionsConfig: 行动 -> 子选项配置（可按需补充/扩展）
const actionsConfig = {
  browse: {
    label: "刷平台冲浪",
    choices: [
      { label: "刷树洞岛上最新长文", effects: { cpHeat: 3, passion: 3, mental: -1, energy: -2 }, text: "你在树洞岛上刷到一篇长文，熬夜看完后心里满是【MAIN_CP】的画面。" },
      { label: "刷围栏网看瓜", effects: { selfHeat: 1, social: 2, mental: -3, energy: -1 }, text: "围栏网上的瓜又多了一条，你看得又累又满足。" },
      { label: "看 A-3 文库的长篇", effects: { cpHeat: 2, passion: 2, power: 1, mental: -2, energy: -2 }, text: "你打开文库看完一篇长篇，脑袋里全是人物的日常设定。" }
    ]
  },
  create: {
    label: "创作",
    choices: [
      { label: "写一篇 3000 字短打", effects: { power: 2, selfHeat: 2, passion: 2, energy: -5 }, text: "你写完一篇短打，稍微有点疲惫但成就感满满。" },
      { label: "画一张上色插图", effects: { power: 3, selfHeat: 3, passion: 2, energy: -8, money: -2 }, text: "你画了一整天，终于完成一张插图。" }
    ]
  },
  follow: {
    label: "追更",
    choices: [
      { label: "追最新一话", effects: { cpHeat: 3, passion: 3, energy: -2, mental: 1 }, text: "最新一话太甜了，让你精神小幅回暖。" },
      { label: "看现场/演出", effects: { cpHeat: 4, passion: 4, energy: -4, money: -10 }, text: "现场气氛炸裂，你的热情被点燃。" }
    ]
  }
  ,
  social: {
    label: "社交互动",
    choices: [
      { label: "在圈内安利/发帖", effects: { social: 3, selfHeat: 1, passion: 1 }, text: "你写了一段热情的安利文，收获了几条回应。" },
      { label: "线下约饭/应援", effects: { social: 5, passion: 3, energy: -5, money: -8 }, text: "和同好线下聚会，很开心但消耗不少体力与金钱。" }
    ]
  },
  study: {
    label: "学习精进",
    choices: [
      { label: "上写作/美术/剪辑课", effects: { power: 2, energy: -4, money: -5, mental: 1 }, text: "上完课后你的技能提升了一点，感觉更有把握了。" },
      { label: "自学/练习一小时", effects: { power: 1, energy: -2, passion: 1 }, text: "自学一小时，虽然累但收获颇丰。" }
    ]
  },
  real: {
    label: "现实生活",
    choices: [
      { label: "处理现实工作/学习", effects: { energy: -5, money: 5, passion: -2 }, text: "你处理完现实事务，短期内同人生活被压缩了。" },
      { label: "休息放松", effects: { mental: 3, energy: 5, passion: -1 }, text: "好好休息后精神状态有所恢复。" }
    ]
  },
  explore: {
    label: "探索新坑",
    choices: [
      { label: "扫一眼新番/新作", effects: { cpHeat: -1, passion: -1, mental: 1 }, text: "新鲜感来临，但对主坑的关注略有下降。" },
      { label: "被朋友安利新CP", effects: { cpHeat: -2, passion: -2, social: 1 }, text: "你被新CP吸引，短期分散了部分注意力。" }
    ]
  }
};

function initActionBar() {
  const buttons = document.querySelectorAll('.action-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.action;
      openActionChoices(key);
    });
  });
}

function openActionChoices(actionKey) {
  const config = actionsConfig[actionKey];
  const pool = eventsByAction[actionKey] || [];

  const t = gameState.time;
  const actionIndex = t.actionsPerMonth - t.actionsLeft + 1;

  const title = config ? `第 ${t.month} 月 · 行动：${config.label}` : `第 ${t.month} 月 · 行动`;
  const baseText = config ? `你决定执行：${config.label}。\n\n接下来要怎么做？` : `请选择要执行的行动。`;

  $('event-title').textContent = title;
  $('event-text').textContent = baseText;
  const box = $('event-options');
  box.innerHTML = '';

  // 如果有按行动分组的事件池，优先从里边抽出 2-3 条作为可选项
  if (pool && pool.length > 0) {
    const choices = pickRandomEvents(pool, 3);
    renderChoicesForAction(actionKey, config, choices);
    return;
  }

  // 否则回退到旧的 inline choices（兼容性）
  if (!config || !config.choices) return;
  const b = gameState.basic;
  const mainCP = `${b.mainLeft}×${b.mainRight}`;
  const rivalCP = (b.rivalLeft && b.rivalRight) ? `${b.rivalLeft}×${b.rivalRight}` : '对家';

  config.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary';
    btn.textContent = choice.label.replace(/MAIN_CP/g, mainCP).replace(/RIVAL_CP/g, rivalCP);
    btn.onclick = () => {
      const tNow = gameState.time;
      const actionIndex = tNow.actionsPerMonth - tNow.actionsLeft + 1;
      const weekLabel = `第 ${tNow.month} 月-第 ${actionIndex} 周`;

      const resultText = (choice.text || '').replace(/MAIN_CP/g, mainCP).replace(/RIVAL_CP/g, rivalCP);

      const fullText = `${weekLabel}：\n` +
        `你决定 ${config.label} —— ${choice.label}。\n\n` +
        `${resultText}`;

      applyEffects(choice.effects || {});
      useActionAndMaybeNextMonth();
      renderAllStats();

      $('event-title').textContent = config.label;
      $('event-text').textContent = fullText;

      gameState.history.push({ month: tNow.month, week: actionIndex, title: config.label, text: fullText });
      renderHistoryLog();
    };
    box.appendChild(btn);
  });
}

// 从池中随机挑出最多 count 条（去重）
function pickRandomEvents(pool, maxCount) {
  const arr = [...pool];
  const result = [];
  while (arr.length && result.length < maxCount) {
    const idx = Math.floor(Math.random() * arr.length);
    result.push(arr.splice(idx, 1)[0]);
  }
  return result;
}

// 渲染从 eventsByAction 中抽到的事件选项
function renderChoicesForAction(actionKey, actionMeta, choices) {
  const box = $('event-options');
  box.innerHTML = '';
  const b = gameState.basic;
  const mainCP = `${b.mainLeft}×${b.mainRight}`;
  const rivalCP = (b.rivalLeft && b.rivalRight) ? `${b.rivalLeft}×${b.rivalRight}` : '对家';

  const tNow = gameState.time;
  const actionIndex = tNow.actionsPerMonth - tNow.actionsLeft + 1;
  const weekLabel = `第 ${tNow.month} 月-第 ${actionIndex} 周`;

  choices.forEach(ev => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary';

    const label = (ev.label || '无名选项').replace(/MAIN_CP/g, mainCP).replace(/RIVAL_CP/g, rivalCP);
    btn.textContent = label;

    btn.onclick = () => {
      const rawText = ev.text || '';
      const resultText = rawText.replace(/MAIN_CP/g, mainCP).replace(/RIVAL_CP/g, rivalCP);

      applyEffects(ev.effects || {});
      useActionAndMaybeNextMonth();
      renderAllStats();

      const fullText = `${weekLabel}：\n` +
        `你选择了【${actionMeta ? actionMeta.label : actionKey}】中的「${label}」。\n\n` +
        `${resultText}`;

      $('event-title').textContent = actionMeta ? actionMeta.label : actionKey;
      $('event-text').textContent = fullText;

      gameState.history.push({ month: tNow.month, week: actionIndex, title: actionMeta ? actionMeta.label : actionKey, text: fullText });
      renderHistoryLog();
    };

    box.appendChild(btn);
  });
}

function appendLogEntry(title, choiceLabel, effects) {
  const log = $('event-log');
  if (!log) return;
  const entry = document.createElement('div');
  entry.className = 'help';
  const effSummary = summarizeEffects(effects);
  entry.textContent = `${title} → ${choiceLabel}${effSummary ? ' ｜ 属性变化：' + effSummary : ''}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

// ===== 渲染历史记录（完整剧情段落） =====
function renderHistoryLog() {
  const log = $('event-log');
  if (!log) return;
  log.innerHTML = '';
  gameState.history.forEach(entry => {
    const block = document.createElement('div');
    block.style.marginBottom = '10px';
    block.style.paddingBottom = '6px';
    block.style.borderBottom = '1px solid #e9e6e1';
    block.style.whiteSpace = 'pre-wrap';
    block.textContent = entry.text;
    log.appendChild(block);
  });
  log.scrollTop = log.scrollHeight;
}

function summarizeEffects(effects) {
  if (!effects) return '';
  const parts = [];
  const labelMap = {
    cpHeat: 'CP热度', selfHeat: '自己热度', power: '厨力', mental: '精神', passion: '热情', energy: '体力', money: '经济', social: '社交'
  };
  for (const k in effects) {
    const v = effects[k];
    if (!v) continue;
    const label = labelMap[k] || k;
    parts.push(`${label}${v > 0 ? '+' : ''}${v}`);
  }
  return parts.join('，');
}

// ===== 渲染通用状态（带差值提示） =====
function renderAllStats() {
  const s = gameState.stats;
  const last = gameState.lastStats || {};

  renderStatWithDiff('stat-cpHeat', s.cpHeat, last.cpHeat);
  renderStatWithDiff('stat-selfHeat', s.selfHeat, last.selfHeat);
  renderStatWithDiff('stat-power', s.power, last.power);
  renderStatWithDiff('stat-mental', s.mental, last.mental);

  renderStatWithDiff('stat-passion', s.passion, last.passion);
  renderStatWithDiff('stat-energy', s.energy, last.energy);
  renderStatWithDiff('stat-money', s.money, last.money);
  renderStatWithDiff('stat-social', s.social, last.social);

  const t = gameState.time;
  $('stat-time').textContent = `第 ${t.month} 月 · ${t.actionsLeft}/${t.actionsPerMonth}`;

  // 更新快照
  gameState.lastStats = { ...s };
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
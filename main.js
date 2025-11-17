// ===== 1. 玩家属性（先做最简单版） =====
const state = {
  cpHeat: 60,     // CP热度
  selfHeat: 10,   // 自己热度
  power: 5,       // 厨力
  mental: 80      // 精神状况（0-100）
};

// 更新顶部UI
function renderStats() {
  document.getElementById("stat-cpHeat").textContent = state.cpHeat;
  document.getElementById("stat-selfHeat").textContent = state.selfHeat;
  document.getElementById("stat-power").textContent = state.power;
  document.getElementById("stat-mental").textContent = state.mental;
}

// ===== 2. 定义一个测试事件 =====
const demoEvent = {
  title: "主tag突然热闹起来",
  text: `你刷开主坑的tag，发现一夜之间多了好多新粮，
同时也有人在吵架。你要怎么做？`,
  options: [
    {
      text: "冲进tag一边舔屏一边顺手拉架",
      effect: () => {
        state.cpHeat += 5;
        state.selfHeat += 3;
        state.power += 1;
        state.mental -= 5;
        showResult("你在tag里活跃发言，顺便安利了自己的产出。虽然有点累，但很爽。");
      }
    },
    {
      text: "把tag关掉，假装什么都没发生",
      effect: () => {
        state.cpHeat -= 2;
        state.mental += 5;
        showResult("你关掉了tag，决定今天只看点轻松的日常向。心情反而好了些。");
      }
    }
  ]
};

// 把事件渲染出来
function renderEvent(ev) {
  document.getElementById("event-title").textContent = ev.title;
  document.getElementById("event-text").textContent = ev.text;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = ""; // 清空旧按钮

  ev.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt.text;
    btn.onclick = () => {
      opt.effect();   // 执行效果
      renderStats();  // 更新属性显示
    };
    optionsDiv.appendChild(btn);
  });
}

// 在页面下方显示选项结果（简单用alert/或文本）
function showResult(msg) {
  // 简单做法：直接在事件文本后面加一段
  const textEl = document.getElementById("event-text");
  textEl.textContent += "\n\n【结果】" + msg;
}

// ===== 3. 页面加载时初始化 =====
window.addEventListener("DOMContentLoaded", () => {
  renderStats();
  renderEvent(demoEvent);
});
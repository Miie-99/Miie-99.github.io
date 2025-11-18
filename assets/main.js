/* assets/main.js
   Extracted from index.html for maintainability.
   Exposes globals: Game, UI, Logic, State, DATA (used by inline onclick handlers).
*/

// ==========================================
// MODULE: DATA
// ==========================================
const DATA = {
    prefixes: [
        { txt: "下楼梯骨折的", buff: { social: -20 }, desc: "出门困难，强制宅家" },
        { txt: "家里有矿的", buff: { money: 5000 }, desc: "钞能力者，开局资金充足" },
        { txt: "玻璃心的", buff: { san: -20, passion: 20 }, desc: "容易破防，但爱得深沉" },
        { txt: "手速惊人的", buff: { tech: 20 }, desc: "产粮效率极高" },
        { txt: "住在A站的", buff: { passion: 30 }, desc: "阅片无数，审美极高" }
    ],
    roles: [
        { txt: "社畜", base: { money: 3000, time: 2 } },
        { txt: "学生", base: { money: 500, time: 4 } },
        { txt: "家里蹲", base: { money: 100, time: 6 } },
        { txt: "自由职业", base: { money: 1500, time: 5 } }
    ],
    events: {
        work: [
            { title: "加班地狱", text: "老板让你连夜改PPT，你错过了晚上的CP群语音。", effect: { money: 800, san: -10, passion: -5 } },
            { title: "掉马危机", text: "同事看到了你的屏保，问：'这是同性恋漫画吗？' 你吓出一身冷汗。", effect: { san: -15, social: -5 } },
            { title: "发奖金了", text: "项目结款！你立刻把钱换成了谷子（周边）。", effect: { money: 2000, love: 10 } },
            { title: "遇到同好", text: "新来的实习生居然也是{cp}姐！世界真小。", effect: { social: 15, san: 10, passion: 10 } }
        ],
        create: [
            { title: "手感火热", text: "文思泉涌，下笔如有神，这篇绝对是神作！", effect: { tech: 15, myHeat: 20, works: 0.5 } },
            { title: "遭遇瓶颈", text: "卡文了，坐在电脑前三个小时只写了三百字。", effect: { san: -10, stamina: -20, works: 0.1 } },
            { title: "忘记保存", text: "软件崩溃了...你的心也碎了。", effect: { san: -30, passion: -10 } },
            { title: "被大V转了", text: "你的产出被圈内大手转发，通知栏炸了！", effect: { myHeat: 50, passion: 20, love: 5 } }
        ],
        consume: [
            { title: "神仙太太", text: "在AO3读到一篇绝世好文，哭得稀里哗啦。", effect: { love: 20, passion: 10, san: 10 } },
            { title: "OOC警告", text: "不仅逆了你的CP，还把你推写成了恋爱脑。我想吐。", effect: { san: -20, passion: -5 } },
            { title: "官方发糖", text: "最新一集动画里他们牵手了（并没有，是你显微镜看错了）。", effect: { love: 15, san: 5 } },
            { title: "由于版权原因", text: "你收藏的几十个本子链接全部失效了。", effect: { san: -15, passion: -10 } }
        ],
        social: [
            { title: "由于太现充", text: "群里在聊CP，你在聊今晚吃什么，被冷落了。", effect: { social: 10, myHeat: -5 } },
            { title: "小团体撕逼", text: "群主和管理吵起来了，你被要求站队。", effect: { san: -20, social: -10 } },
            { title: "扩列成功", text: "在微博勾搭到了一个同城同好，相谈甚欢。", effect: { social: 15, passion: 10 } },
            { title: "挂人贴", text: "你在广场吐槽了一句，被对家截图挂了。", effect: { myHeat: 30, san: -30, toxic: true } }
        ],
        rest: [
            { title: "深度睡眠", text: "梦里什么都有，梦里你的CP结婚了。", effect: { stamina: 40, san: 20 } },
            { title: "断网保平安", text: "不看SNS的一天，世界如此美好。", effect: { san: 15, passion: -5 } },
            { title: "生病了", text: "熬夜太多抵抗力下降，不得不去医院。", effect: { money: -200, stamina: 20 } }
        ]
    },
    triggers: [
        { condition: (s) => s.san < 20, event: { title: "发疯文学", text: "你的精神状态已岌岌可危，在微博连发50条乱码，吓跑了粉丝。", effect: { myHeat: -20, social: -10 } } },
        { condition: (s) => s.money < 100, event: { title: "吃土警告", text: "余额不足，你不得不卖掉一部分吧唧回血。", effect: { money: 500, love: -10 } } },
        { condition: (s) => s.myHeat > 200 && !s.goddess, event: { title: "加冕时刻", text: "你的粉丝数突破了临界点，现在你说话就是圈内风向标。", effect: { goddess: true, passion: 50 } } }
    ]
};

// ==========================================
// MODULE: STATE
// ==========================================
const State = {
    turn: 1,
    maxTurn: 48,
    cp: "AB",
    rival: "BA",
    identity: { prefix: null, role: null },
    stats: {
        san: 100,
        passion: 100,
        stamina: 100,
        money: 1000,
        social: 50,
        tech: 10,
        love: 50,
        myHeat: 0,
        cpHeat: 10
    },
    progress: { works: 0 },
    flags: { toxic: false, goddess: false },
    history: [],

    modify(effects) {
        for (let key in effects) {
            if (key === 'works') {
                this.progress.works += effects[key];
            } else if (key === 'toxic' || key === 'goddess') {
                this.flags[key] = effects[key];
            } else if (this.stats.hasOwnProperty(key)) {
                this.stats[key] += effects[key];
                if (key === 'stamina' && this.stats[key] > 100) this.stats[key] = 100;
                if (key === 'san' && this.stats[key] > 100) this.stats[key] = 100;
            }
        }
    }
};

// ==========================================
// MODULE: LOGIC
// ==========================================
const Logic = {
    costs: {
        work:   { stamina: -15, passion: -5, time: 1 },
        create: { stamina: -20, passion: 5, time: 1 },
        consume:{ stamina: -5,  passion: 5, time: 1 },
        social: { stamina: -10, passion: -2,time: 1 },
        rest:   { stamina: 0,   passion: -5, time: 1 }
    },

    processAction(actionType) {
        if (State.stats.stamina < 15 && actionType !== 'rest') {
            UI.log("体力透支，强制休息！", "red");
            this.processAction('rest');
            return;
        }

        const cost = this.costs[actionType];
        State.modify(cost);
        State.turn += 1;

        let event = this.getTriggerEvent() || this.getRandomEvent(actionType);

        if (event) {
            State.modify(event.effect);
            UI.showEventModal(event);
            UI.log(`[事件] ${event.title}`, "blue");
        }

        this.checkGameOver();
        UI.render();
    },

    getTriggerEvent() {
        if (Math.random() > 0.3) return null;
        for (let t of DATA.triggers) {
            if (t.condition(State.stats)) return t.event;
        }
        return null;
    },

    getRandomEvent(poolKey) {
        const pool = DATA.events[poolKey];
        if (!pool) return null;
        if (Math.random() > 0.4) {
            const evt = pool[Math.floor(Math.random() * pool.length)];
            const processedEvt = JSON.parse(JSON.stringify(evt));
            processedEvt.text = processedEvt.text.replace(/{cp}/g, State.cp).replace(/{rival}/g, State.rival);
            return processedEvt;
        }
        return { title: "平淡的一周", text: "这周什么特别的事都没发生，只是时间流逝了。", effect: {} };
    },

    checkGameOver() {
        if (State.stats.passion <= 0) UI.showEnd("淡坑退圈", "爱会消失，对吗？你的热情耗尽了，变成了现充。");
        else if (State.stats.san <= 0) UI.showEnd("破防退网", "互联网太恶意了，你的精神已经崩溃。");
        else if (State.stats.money <= -500) UI.showEnd("信用破产", "为了买谷欠下巨款，号被收走了。");
        else if (State.turn > State.maxTurn) UI.showEnd("一周年纪念", "你在坑里坚持了一年，这就是真爱吗？");
    }
};

// ==========================================
// MODULE: UI
// ==========================================
const UI = {
    bindIds: ['val-san', 'val-passion', 'val-stamina', 'val-money', 'val-social', 'val-tech', 'val-love', 'val-myheat', 'val-cpheat'],

    render() {
        this.bindIds.forEach(id => {
            const key = id.split('-')[1];
            const el = document.getElementById(id);
            if(el) el.innerText = Math.floor(State.stats[key]);
        });

        const barLove = document.getElementById('bar-love');
        if (barLove) barLove.style.width = Math.min(100, State.stats.love) + '%';
        const barTech = document.getElementById('bar-tech');
        if (barTech) barTech.style.width = Math.min(100, State.stats.tech) + '%';

        const vw = document.getElementById('val-works');
        if (vw) vw.innerText = State.progress.works.toFixed(1);
        const disp = document.getElementById('disp-date');
        if (disp) {
            const m = Math.ceil(State.turn / 4);
            const w = State.turn % 4 || 4;
            disp.innerText = `第${m}月 第${w}周`;
        }
    },

    log(msg, color = "gray") {
        const box = document.getElementById('game-log');
        if (!box) return;
        const p = document.createElement('div');
        p.className = `text-xs mb-1 border-b border-gray-100 pb-1 text-${color}-600`;
        p.innerHTML = `<span class="opacity-50 mr-2">W${State.turn}</span> ${msg}`;
        box.appendChild(p);
        box.scrollTop = box.scrollHeight;
    },

    showEventModal(evt) {
        const t = document.getElementById('evt-title');
        const tx = document.getElementById('evt-text');
        const eff = document.getElementById('evt-effects');
        if (t) t.innerText = evt.title;
        if (tx) tx.innerText = evt.text;

        if (eff) {
            let effectsHtml = "";
            for (let k in evt.effect) {
                let v = evt.effect[k];
                let color = v > 0 ? "text-green-600" : "text-red-600";
                let sign = v > 0 ? "+" : "";
                const map = {san:"San值", money:"金钱", social:"社交", passion:"热情", stamina:"体力", love:"厨力", tech:"技术", myHeat:"热度"};
                let name = map[k] || k;
                effectsHtml += `<div class="flex justify-between"><span>${name}</span><span class="${color}">${sign}${v}</span></div>`;
            }
            eff.innerHTML = effectsHtml || "无数值变化";
        }
        const modal = document.getElementById('modal-event');
        if (modal) modal.classList.remove('hidden');
    },

    closeModal() {
        const modal = document.getElementById('modal-event');
        if (modal) modal.classList.add('hidden');
    },

    toggleStatus() {
        this.log(`当前状态: 毒唯倾向:${State.flags.toxic?"是":"否"} 女神:${State.flags.goddess?"是":"否"}`, "purple");
    },

    showEnd(title, desc) {
        const sg = document.getElementById('screen-game');
        const se = document.getElementById('screen-end');
        if (sg) sg.classList.add('hidden');
        if (se) se.classList.remove('hidden');
        const et = document.getElementById('end-title');
        const ed = document.getElementById('end-desc');
        if (et) et.innerText = title;
        if (ed) ed.innerText = desc;

        const eh = document.getElementById('end-stat-heat');
        const ew = document.getElementById('end-stat-works');
        const em = document.getElementById('end-stat-money');
        if (eh) eh.innerText = State.stats.myHeat;
        if (ew) ew.innerText = Math.floor(State.progress.works);
        if (em) em.innerText = State.stats.money;

        this.drawRadar();
    },

    drawRadar() {
        const svg = document.getElementById('radar-chart');
        if (!svg) return;
        const stats = [State.stats.love, State.stats.myHeat, State.stats.tech, State.stats.money/50, State.stats.san];
        const max = [100, 200, 100, 200, 100];
        const labels = ["爱", "热", "力", "财", "智"];

        let points = "";
        let labelTags = "";
        const cx = 100, cy = 100, r = 70;
        svg.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#374151" stroke="none"/>`;

        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI/2;
            let val = stats[i] / max[i];
            if (val > 1) val = 1; if (val < 0.1) val = 0.1;
            const x = cx + r * val * Math.cos(angle);
            const y = cy + r * val * Math.sin(angle);
            points += `${x},${y} `;
            const lx = cx + (r+15) * Math.cos(angle);
            const ly = cy + (r+15) * Math.sin(angle);
            labelTags += `<text x="${lx}" y="${ly}" fill="#fbbf24" font-size="10" text-anchor="middle" alignment-baseline="middle">${labels[i]}</text>`;
        }
        svg.innerHTML += `<polygon points="${points}" fill="rgba(59, 130, 246, 0.6)" stroke="#3b82f6" stroke-width="2"/>` + labelTags;
    }
};

// ==========================================
// MODULE: MAIN
// ==========================================
const Game = {
    spinIdentity() {
        const btn = document.getElementById('btn-spin');
        const pEl = document.getElementById('slot-prefix');
        const rEl = document.getElementById('slot-role');
        if (btn) btn.disabled = true;
        if (pEl) pEl.classList.add('scrolling');
        if (rEl) rEl.classList.add('scrolling');

        setTimeout(() => {
            if (pEl) pEl.classList.remove('scrolling');
            if (rEl) rEl.classList.remove('scrolling');
            const pf = DATA.prefixes[Math.floor(Math.random() * DATA.prefixes.length)];
            const rl = DATA.roles[Math.floor(Math.random() * DATA.roles.length)];
            if (pEl) pEl.innerText = pf.txt;
            if (rEl) rEl.innerText = rl.txt;
            State.identity = { prefix: pf, role: rl };
            const descEl = document.getElementById('identity-desc');
            if (descEl) {
                descEl.innerHTML = `<strong>效果:</strong> ${pf.desc} <br> <strong>初始:</strong> 金钱${rl.base.money}`;
                descEl.classList.remove('hidden');
            }

            const startBtn = document.getElementById('btn-start');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.classList.remove('bg-gray-400');
                startBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }
        }, 1000);
    },

    start() {
        State.cp = document.getElementById('inp-cp').value || "AB";
        State.rival = document.getElementById('inp-rival').value || "BA";
        State.stats.money = State.identity.role.base.money;
        State.modify(State.identity.prefix.buff);

        const setup = document.getElementById('screen-setup');
        const game = document.getElementById('screen-game');
        if (setup) setup.classList.add('hidden');
        if (game) { game.classList.remove('hidden'); game.classList.add('flex'); }

        UI.render();
        UI.log(`你转生成为了【${State.identity.prefix.txt}${State.identity.role.txt}】`, "blue");
        if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();
    },

    action(type) {
        Logic.processAction(type);
    }
};

// expose to window for inline onclick usage
window.DATA = DATA;
window.State = State;
window.Logic = Logic;
window.UI = UI;
window.Game = Game;

// initialize icons if available
if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();

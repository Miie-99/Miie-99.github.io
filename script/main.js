// ==========================================
// MODULE: MAIN (js/main.js)
// 入口与事件绑定 - v2.0
// ==========================================
const Game = {
    spinIdentity() {
        const btn = document.getElementById('btn-spin');
        const pEl = document.getElementById('slot-prefix');
        const rEl = document.getElementById('slot-role');

        if (btn) btn.disabled = true;

        // 选择最终结果
        const finalPf = DATA.prefixes[Math.floor(Math.random() * DATA.prefixes.length)];
        const finalRl = DATA.roles[Math.floor(Math.random() * DATA.roles.length)];

        State.identity = { prefix: finalPf, role: finalRl };

        // 老虎机滚动效果
        const runSlot = (el, dataArray, finalItem, delay) => {
            el.classList.add('scrolling');
            const item = dataArray[Math.floor(Math.random() * dataArray.length)];
            el.innerText = item.txt || item;

            if (delay > 350) {
                el.classList.remove('scrolling');
                el.innerText = finalItem.txt || finalItem;
                el.classList.add('animate-bounce-once');
                setTimeout(() => el.classList.remove('animate-bounce-once'), 600);
                return;
            }

            setTimeout(() => runSlot(el, dataArray, finalItem, delay * 1.15), delay);
        };

        // 启动滚动
        runSlot(pEl, DATA.prefixes, finalPf, 45);
        setTimeout(() => runSlot(rEl, DATA.roles, finalRl, 45), 250);

        // 显示结果
        setTimeout(() => {
            const descEl = document.getElementById('identity-desc');
            if (descEl) {
                // 构建被动技能说明
                let passiveInfo = '';
                if (finalPf.passive) {
                    passiveInfo = `<br><strong>🎯 被动技能【${finalPf.passive.name}】:</strong> ${finalPf.passive.desc}`;
                }
                // 构建职业周期效果说明
                let periodicInfo = '';
                if (finalRl.periodic) {
                    periodicInfo = `<br><strong>📅 职业效果【${finalRl.periodic.name}】:</strong> ${finalRl.periodic.desc}`;
                }

                descEl.innerHTML = `<strong>✨ 特质:</strong> ${finalPf.desc}${passiveInfo} <br><strong>💰 初始资金:</strong> ${finalRl.base.money}${periodicInfo}`;
                descEl.classList.remove('hidden');
            }

            const startBtn = document.getElementById('btn-start');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.classList.remove('bg-neutral-300', 'text-neutral-500', 'cursor-not-allowed');
                startBtn.classList.add('cute-modal-btn');
            }
            if (btn) btn.disabled = false;
        }, 1600);
    },

    start() {
        // 获取CP设置
        const cpInput = document.getElementById('inp-cp');
        const rivalInput = document.getElementById('inp-rival');
        State.cp = (cpInput && cpInput.value) ? cpInput.value : "AB";
        State.rival = (rivalInput && rivalInput.value) ? rivalInput.value : "BA";

        // 如果未摇号，随机分配身份
        if (!State.identity || !State.identity.role) {
            const pf = DATA.prefixes[Math.floor(Math.random() * DATA.prefixes.length)];
            const rl = DATA.roles[Math.floor(Math.random() * DATA.roles.length)];
            State.identity = { prefix: pf, role: rl };
        }

        // 应用初始属性
        if (State.identity.role && State.identity.role.base) {
            State.stats.money = State.identity.role.base.money;
        }
        if (State.identity.prefix && State.identity.prefix.buff) {
            State.modify(State.identity.prefix.buff);
        }

        // 切换到游戏画面
        UI.switchScreen('screen-game');
        UI.render();

        // 初始日志
        UI.log(`🎉 你转生成为了【${State.identity.prefix.txt}${State.identity.role.txt}】`, "positive");
        UI.log(`💕 本命CP: ${State.cp} | 💔 雷点: ${State.rival}`, "normal");
        UI.log(`✨ 开始你的同人圈冒险吧！`, "normal");

        // 刷新图标
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // 初始化App菜单
        if (typeof Apps !== 'undefined') {
            Apps.init();
        }
    },

    action(type) {
        if (typeof Logic !== 'undefined') {
            Logic.processAction(type);
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化图标
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 暴露模块到全局
    try {
        window.Game = Game;
        window.UI = UI;
        window.State = State;
        window.Logic = Logic;
        window.DATA = DATA;
        if (typeof CHAINS !== 'undefined') {
            window.CHAINS = CHAINS;
        }
    } catch (e) {
        console.warn('无法将模块绑定到 window：', e);
    }
});

// 兼容性：直接暴露
try {
    window.Game = Game;
    window.UI = UI;
    window.State = State;
    window.Logic = Logic;
    window.DATA = DATA;
} catch (e) {
    // ignore
}

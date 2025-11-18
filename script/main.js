        // ==========================================
        // MODULE: MAIN (js/main.js)
        // 入口与事件绑定
        // ==========================================
        const Game = {
            spinIdentity() {
                const btn = document.getElementById('btn-spin');
                const pEl = document.getElementById('slot-prefix');
                const rEl = document.getElementById('slot-role');

                btn.disabled = true;

                // 选择最终结果
                const finalPf = DATA.prefixes[Math.floor(Math.random() * DATA.prefixes.length)];
                const finalRl = DATA.roles[Math.floor(Math.random() * DATA.roles.length)];

                State.identity = { prefix: finalPf, role: finalRl };

                // 递归滚动实现阻尼效果
                const runSlot = (el, dataArray, finalItem, delay) => {
                    el.classList.add('scrolling');
                    // 随机显示过程项
                    const item = dataArray[Math.floor(Math.random() * dataArray.length)];
                    el.innerText = item.txt || item;

                    if (delay > 300) {
                        // 停止并显示最终
                        el.classList.remove('scrolling');
                        el.innerText = finalItem.txt || finalItem;
                        el.classList.add('animate-bounce-once');
                        setTimeout(() => el.classList.remove('animate-bounce-once'), 600);
                        return;
                    }

                    setTimeout(() => runSlot(el, dataArray, finalItem, delay * 1.12), delay);
                };

                // 启动两个滚轮，稍微错开时间
                runSlot(pEl, DATA.prefixes, finalPf, 40);
                setTimeout(() => runSlot(rEl, DATA.roles, finalRl, 40), 220);

                // 当两个滚轮基本停下时显示描述与开始按钮
                setTimeout(() => {
                    const descEl = document.getElementById('identity-desc');
                    descEl.innerHTML = `<strong>效果:</strong> ${finalPf.desc} <br> <strong>初始:</strong> 金钱${finalRl.base.money}`;
                    descEl.classList.remove('hidden');

                    const startBtn = document.getElementById('btn-start');
                    startBtn.disabled = false;
                    startBtn.classList.remove('bg-gray-400');
                    startBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    btn.disabled = false;
                }, 1500);
            },

            start() {
                State.cp = document.getElementById('inp-cp').value || "AB";
                State.rival = document.getElementById('inp-rival').value || "BA";

                // 若玩家未先摇号，做一个安全的默认分配，避免空引用导致脚本中断
                if (!State.identity || !State.identity.role) {
                    const pf = DATA.prefixes[Math.floor(Math.random() * DATA.prefixes.length)];
                    const rl = DATA.roles[Math.floor(Math.random() * DATA.roles.length)];
                    State.identity = { prefix: pf, role: rl };
                }

                // Apply initial stats（存在性保护）
                if (State.identity && State.identity.role && State.identity.role.base && typeof State.identity.role.base.money === 'number') {
                    State.stats.money = State.identity.role.base.money;
                }
                if (State.identity && State.identity.prefix && State.identity.prefix.buff) {
                    State.modify(State.identity.prefix.buff);
                }

                UI.switchScreen('screen-game');

                UI.render();
                UI.log(`你转生成为了【${State.identity.prefix.txt}${State.identity.role.txt}】`, "blue");
                lucide.createIcons();
            },

            action(type) {
                Logic.processAction(type);
            }
        };

        // 初始化图标
        lucide.createIcons();

        // 将模块暴露到全局 window，保证 HTML inline `onclick` 能找到它们
        try {
            window.Game = Game;
            window.UI = UI;
            window.State = State;
            window.Logic = Logic;
            window.DATA = DATA;
        } catch (e) {
            // 在极少数环境下直接赋值可能失败，捕获以免影响运行
            console.warn('无法将模块绑定到 window：', e);
        }

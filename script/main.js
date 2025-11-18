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
                pEl.classList.add('scrolling');
                rEl.classList.add('scrolling');

                // 动画
                setTimeout(() => {
                    pEl.classList.remove('scrolling');
                    rEl.classList.remove('scrolling');
                    
                    const pf = DATA.prefixes[Math.floor(Math.random() * DATA.prefixes.length)];
                    const rl = DATA.roles[Math.floor(Math.random() * DATA.roles.length)];
                    
                    pEl.innerText = pf.txt;
                    rEl.innerText = rl.txt;
                    
                    State.identity = { prefix: pf, role: rl };
                    
                    const descEl = document.getElementById('identity-desc');
                    descEl.innerHTML = `<strong>效果:</strong> ${pf.desc} <br> <strong>初始:</strong> 金钱${rl.base.money}`;
                    descEl.classList.remove('hidden');

                    const startBtn = document.getElementById('btn-start');
                    startBtn.disabled = false;
                    startBtn.classList.remove('bg-gray-400');
                    startBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                }, 1000);
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

                document.getElementById('screen-setup').classList.add('hidden');
                document.getElementById('screen-game').classList.remove('hidden');
                document.getElementById('screen-game').classList.add('flex');

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

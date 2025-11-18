        // ==========================================
        // MODULE: UI (js/ui.js)
        // 界面渲染
        // ==========================================
        const UI = {
            // 防止页面加载时被意外触发显示状态面板
            _allowStatusModal: false,
            bindIds: ['val-san', 'val-passion', 'val-stamina', 'val-money', 'val-social', 'val-tech', 'val-love', 'val-myheat', 'val-cpheat'],

            render() {
                // 映射表：将 DOM id 的 key 部分映射到 State.stats 的真实属性名
                const keyMap = {
                    'myheat': 'myHeat',
                    'cpheat': 'cpHeat',
                    'passion': 'passion',
                    'san': 'san',
                    'stamina': 'stamina',
                    'money': 'money',
                    'social': 'social',
                    'tech': 'tech',
                    'love': 'love'
                };

                // 更新数值文本（容错：缺失属性显示 0）
                this.bindIds.forEach(id => {
                    const short = id.split('-')[1];
                    const key = keyMap[short] || short;
                    const el = document.getElementById(id);
                    const val = (State.stats && typeof State.stats[key] !== 'undefined') ? State.stats[key] : 0;
                    if (el) el.innerText = Number.isFinite(val) ? Math.floor(val) : 0;
                });

                // 更新进度条
                document.getElementById('bar-love').style.width = Math.min(100, State.stats.love) + '%';
                document.getElementById('bar-tech').style.width = Math.min(100, State.stats.tech) + '%';

                // 更新作品数和日期
                document.getElementById('val-works').innerText = (State.progress && typeof State.progress.works === 'number') ? State.progress.works.toFixed(1) : '0.0';
                const m = Math.ceil(State.turn / 4);
                const w = State.turn % 4 || 4;
                document.getElementById('disp-date').innerText = `第${m}月 第${w}周`;
            },

            log(msg, color = "gray") {
                const box = document.getElementById('game-log');
                const p = document.createElement('div');
                p.className = `text-xs mb-1 border-b border-gray-100 pb-1 text-${color}-600`;
                p.innerHTML = `<span class="opacity-50 mr-2">W${State.turn}</span> ${msg}`;
                box.appendChild(p);
                box.scrollTop = box.scrollHeight;
            },

            showEventModal(evt) {
                document.getElementById('evt-title').innerText = evt.title;
                document.getElementById('evt-text').innerText = evt.text;

                // 格式化效果展示（只显示数值变化，隐藏布尔或内部标记）
                const PROP_MAP = { san: "SAN值", money: "金钱", social: "社交", passion: "热情", stamina: "体力", love: "厨力", tech: "技术", myHeat: "个人热度", cpHeat: "CP热度" };
                const HIDDEN_PROPS = ['toxic', 'goddess', 'chain', 'step'];

                let effectsHtml = "";
                if (evt.effect && typeof evt.effect === 'object') {
                    for (let k in evt.effect) {
                        if (HIDDEN_PROPS.includes(k)) continue;
                        const v = evt.effect[k];
                        if (typeof v !== 'number') continue; // 只展示数字变化
                        const color = v > 0 ? "text-green-600" : "text-red-600";
                        const sign = v > 0 ? "+" : "";
                        const name = PROP_MAP[k] || k;
                        effectsHtml += `<div class="flex justify-between border-b border-gray-100 py-1"><span class="text-gray-600">${name}</span><span class="${color} font-bold font-mono">${sign}${v}</span></div>`;
                    }
                }
                document.getElementById('evt-effects').innerHTML = effectsHtml || "<div class='text-center text-gray-400'>状态无变化</div>";

                // 清理可能残留的链事件动作按钮，恢复默认确认按钮显示
                const actionContainer = document.getElementById('evt-actions');
                if (actionContainer) actionContainer.innerHTML = '';
                const modal = document.getElementById('modal-event');
                const defaultBtn = modal ? modal.querySelector('button[data-default="evt-ok"]') : null;
                if (defaultBtn) defaultBtn.style.display = 'block';

                if (modal) {
                    modal.style.display = 'flex';
                    modal.classList.remove('hidden');
                }
            },

            // 切换页面（使用 page-section / active-screen 机制）
            switchScreen(screenId) {
                document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active-screen'));
                const target = document.getElementById(screenId);
                if (target) target.classList.add('active-screen');
            },

            // 在连续事件中使用的模态，带选项按钮
            showChainModal({ title, text, options }) {
                const modal = document.getElementById('modal-event');
                const titleEl = document.getElementById('evt-title');
                const textEl = document.getElementById('evt-text');
                const effectsEl = document.getElementById('evt-effects');

                titleEl.innerText = title;
                textEl.innerText = text;
                effectsEl.innerHTML = "";

                // 准备动作区域
                let actionContainer = document.getElementById('evt-actions');
                if (!actionContainer) {
                    actionContainer = document.createElement('div');
                    actionContainer.id = 'evt-actions';
                    const modalInner = modal.querySelector('.modal-enter') || modal.querySelector('div');
                    modalInner.appendChild(actionContainer);
                }
                // 生成按钮
                actionContainer.innerHTML = '';
                // 确保动作容器可见（可能被 showEventModal 隐藏过）
                actionContainer.style.display = 'block';
                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2';
                    btn.innerText = opt.text;
                    if (opt.next === '__DYN__') {
                        btn.onclick = () => Logic.advanceChainDynamic();
                    } else {
                        btn.onclick = () => Logic.advanceChain(opt.next);
                    }
                    actionContainer.appendChild(btn);
                });

                // 隐藏默认确定按钮（如果存在）
                const defaultBtn = modal.querySelector('button[data-default="evt-ok"]');
                if (defaultBtn) defaultBtn.style.display = 'none';

                // 强制显示模态（使用 inline style 以防 Tailwind 延迟）
                if (modal) {
                    modal.style.display = 'flex';
                    modal.classList.remove('hidden');
                }
                // 如果没有提供任何选项，回退到默认确认按钮，避免无按钮卡死
                if (!options || options.length === 0) {
                    if (defaultBtn) defaultBtn.style.display = 'block';
                    actionContainer.style.display = 'none';
                }
            },

            closeModal() {
                const modal = document.getElementById('modal-event');
                if (!modal) return;

                // 隐藏模态（同时使用 inline style 保证在无 Tailwind 场景下也生效）
                modal.classList.add('hidden');
                modal.style.display = 'none';

                // 恢复默认确定按钮显示
                const defaultBtn = modal.querySelector('button[data-default="evt-ok"]');
                if (defaultBtn) defaultBtn.style.display = 'block';

                // 清空连续事件动作容器
                const actionContainer = document.getElementById('evt-actions');
                if (actionContainer) {
                    actionContainer.innerHTML = '';
                    actionContainer.style.display = 'none';
                }

                // 如果存在残留的链事件状态，确保被清理并恢复底部按钮交互
                if (State && State.chain && State.chain.active) {
                    State.chain.active = false;
                    State.chain.id = null;
                    State.chain.step = null;
                    State.chain.data = null;
                }
                this.updateActionButtons(true);
            },

            toggleStatus() {
                // 仅在用户主动点击时允许显示状态模态
                this._allowStatusModal = true;
                this.showStatusModal(true);
            },

            showStatusModal(force) {
                // 防护：只有在明确允许时才自动显示，避免加载时被调用
                if (!force && !this._allowStatusModal) {
                    console.warn('showStatusModal blocked: not allowed yet');
                    return;
                }
                console.info('showStatusModal invoked', { force, allow: this._allowStatusModal });
                // reset allow flag to require explicit next click
                this._allowStatusModal = false;
                // 从 State.alignment 读取数据并绘制雷达
                const labels = ["公", "嬷", "TTK", "MMR", "毒唯", "洁癖", "杂食"];
                const keys = ["gong", "ma", "ttk", "mmr", "toxic", "purity", "omnivory"];
                const values = keys.map(k => (State.alignment && typeof State.alignment[k] === 'number') ? State.alignment[k] : 50);

                this.drawAlignmentRadar('status-radar', labels, values);

                let comment = '';
                if (values[4] > 70) comment += '毒唯倾向明显；';
                if (values[5] > 70) comment += '偏洁癖；';
                if (!comment) comment = '倾向均衡，未见极端。';
                document.getElementById('status-comment').innerText = comment;

                const modal = document.getElementById('modal-status');
                if (modal) {
                    modal.style.display = 'flex';
                    modal.classList.remove('hidden');
                }
            },

            // 关闭状态模态
            closeStatusModal() {
                const modal = document.getElementById('modal-status');
                if (modal) {
                    modal.classList.add('hidden');
                    modal.style.display = 'none';
                }
                // 复位允许标志，避免未授权再次弹出
                this._allowStatusModal = false;
            },

            drawAlignmentRadar(svgId, labels, values) {
                const svg = document.getElementById(svgId);
                if (!svg) return;
                const cx = 100, cy = 100, r = 70;
                const n = labels.length;
                let points = '';
                let labelTags = '';

                // background
                let bg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#111827" opacity="0.06"/>`;

                for (let i = 0; i < n; i++) {
                    const angle = (Math.PI * 2 * i) / n - Math.PI/2;
                    const val = Math.max(0.05, Math.min(1, values[i] / 100));
                    const x = cx + r * val * Math.cos(angle);
                    const y = cy + r * val * Math.sin(angle);
                    points += `${x},${y} `;

                    const lx = cx + (r + 18) * Math.cos(angle);
                    const ly = cy + (r + 18) * Math.sin(angle);
                    labelTags += `<text x="${lx}" y="${ly}" fill="#fbbf24" font-size="10" text-anchor="middle" alignment-baseline="middle">${labels[i]}</text>`;
                }

                svg.innerHTML = bg + `<polygon points="${points.trim()}" fill="rgba(59,130,246,0.45)" stroke="#3b82f6" stroke-width="2"/>` + labelTags;
            },

            // 启用/禁用底部常规行动按钮
            updateActionButtons(enabled) {
                const btns = document.querySelectorAll('.action-btn');
                btns.forEach(btn => {
                    btn.disabled = !enabled;
                    btn.style.opacity = enabled ? '1' : '0.5';
                    btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
                });
            },

            showEnd(title, desc) {
                this.switchScreen('screen-end');
                document.getElementById('end-title').innerText = title;
                document.getElementById('end-desc').innerText = desc;
                
                document.getElementById('end-stat-heat').innerText = State.stats.myHeat;
                document.getElementById('end-stat-works').innerText = Math.floor(State.progress.works);
                document.getElementById('end-stat-money').innerText = State.stats.money;

                this.drawRadar();
            },

            drawRadar() {
                // 简单的雷达图绘制
                const svg = document.getElementById('radar-chart');
                const stats = [State.stats.love, State.stats.myHeat, State.stats.tech, State.stats.money/50, State.stats.san];
                const max = [100, 200, 100, 200, 100]; // 归一化分母
                const labels = ["爱", "热", "力", "财", "智"];
                
                let points = "";
                let labelTags = "";
                const cx = 100, cy = 100, r = 70;

                // 背景
                svg.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#374151" stroke="none"/>`;

                for(let i=0; i<5; i++) {
                    const angle = (Math.PI * 2 * i) / 5 - Math.PI/2;
                    let val = stats[i] / max[i];
                    if(val>1) val=1; if(val<0.1) val=0.1;
                    
                    const x = cx + r * val * Math.cos(angle);
                    const y = cy + r * val * Math.sin(angle);
                    points += `${x},${y} `;

                    // Labels
                    const lx = cx + (r+15) * Math.cos(angle);
                    const ly = cy + (r+15) * Math.sin(angle);
                    labelTags += `<text x="${lx}" y="${ly}" fill="#fbbf24" font-size="10" text-anchor="middle" alignment-baseline="middle">${labels[i]}</text>`;
                }
                
                svg.innerHTML += `<polygon points="${points}" fill="rgba(59, 130, 246, 0.6)" stroke="#3b82f6" stroke-width="2"/>` + labelTags;
            }
        };

// ==========================================
// MODULE: UI (js/ui.js)
// 界面渲染 - v2.0 
// ==========================================
const UI = {
    _allowStatusModal: false,
    bindIds: ['val-san', 'val-passion', 'val-stamina', 'val-money', 'val-social', 'val-tech', 'val-love', 'val-myheat', 'val-cpheat'],

    render() {
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

        // 更新数值文本
        this.bindIds.forEach(id => {
            const short = id.split('-')[1];
            const key = keyMap[short] || short;
            const el = document.getElementById(id);
            const val = (State.stats && typeof State.stats[key] !== 'undefined') ? State.stats[key] : 0;
            if (el) {
                // 【v3.2】热度使用格式化显示
                if (key === 'myHeat' || key === 'cpHeat') {
                    el.innerText = State.formatHeat ? State.formatHeat(val) : val;
                } else {
                    el.innerText = Number.isFinite(val) ? Math.floor(val) : 0;
                }
            }
        });

        // 更新进度条
        const loveBar = document.getElementById('bar-love');
        const techBar = document.getElementById('bar-tech');
        if (loveBar) loveBar.style.width = Math.min(100, State.stats.love) + '%';
        if (techBar) techBar.style.width = Math.min(100, State.stats.tech) + '%';

        // 更新作品数
        const worksEl = document.getElementById('val-works');
        if (worksEl) {
            worksEl.innerText = (State.progress && typeof State.progress.works === 'number')
                ? State.progress.works.toFixed(1)
                : '0.0';
        }

        // 更新日期显示
        const m = Math.ceil(State.turn / 4);
        const w = State.turn % 4 || 4;
        const dateEl = document.getElementById('disp-date');
        if (dateEl) dateEl.innerText = `第${m}月 第${w}周`;

        // 【新增】更新阶段显示
        const phaseEl = document.getElementById('disp-phase');
        if (phaseEl && typeof Logic !== 'undefined') {
            const phase = Logic.getCurrentPhase();
            phaseEl.innerText = Logic.getPhaseDisplayName(phase);
        }

        // 【v3.2】更新新闻播报
        if (typeof DATA !== 'undefined' && DATA.getRandomNews) {
            this.updateNewsTicker(DATA.getRandomNews(5));
        }

        // 【新增】更新属性条样式（低值警告）
        this.updateStatWarnings();
    },

    // 【新增】低值警告效果
    updateStatWarnings() {
        const sanEl = document.getElementById('val-san');
        const staminaEl = document.getElementById('val-stamina');
        const passionEl = document.getElementById('val-passion');
        const moneyEl = document.getElementById('val-money');

        // SAN值警告
        if (sanEl) {
            if (State.stats.san < 20) {
                sanEl.classList.add('text-red-400');
                sanEl.classList.add('animate-pulse');
            } else if (State.stats.san < 40) {
                sanEl.classList.add('text-yellow-400');
                sanEl.classList.remove('animate-pulse');
            } else {
                sanEl.classList.remove('text-red-400', 'text-yellow-400', 'animate-pulse');
            }
        }

        // 体力警告
        if (staminaEl) {
            if (State.stats.stamina < 20) {
                staminaEl.parentElement.classList.add('text-red-500');
            } else {
                staminaEl.parentElement.classList.remove('text-red-500');
            }
        }

        // 金钱警告
        if (moneyEl) {
            if (State.stats.money < 0) {
                moneyEl.classList.add('text-red-500');
            } else {
                moneyEl.classList.remove('text-red-500');
            }
        }
    },

    log(msg, type = "normal") {
        const box = document.getElementById('game-log');
        if (!box) return;

        const entry = document.createElement('div');
        entry.className = 'log-entry';

        // 根据类型添加样式
        if (type === 'positive' || msg.includes('↑') || msg.includes('+')) {
            entry.classList.add('positive');
        } else if (type === 'negative' || msg.includes('↓') || msg.includes('-') || msg.includes('⚠️')) {
            entry.classList.add('negative');
        } else if (type === 'event') {
            entry.classList.add('event');
        }

        entry.innerHTML = `<span class="text-neutral-400 mr-2 text-xs">W${State.turn}</span>${msg}`;
        box.appendChild(entry);
        box.scrollTop = box.scrollHeight;
    },

    // 【v3.0】事件日志 - 显示标题和完整内容
    logEvent(event) {
        const box = document.getElementById('game-log');
        if (!box || !event) return;

        const entry = document.createElement('div');
        entry.className = 'log-entry event';

        // 根据事件情感类型添加样式
        if (event.tags && event.tags.sentiment) {
            if (event.tags.sentiment === 'positive') {
                entry.classList.add('positive');
            } else if (event.tags.sentiment === 'negative') {
                entry.classList.add('negative');
            }
        }

        // 显示标题和内容
        entry.innerHTML = `
            <div class="font-bold text-sm mb-1">
                <span class="text-neutral-400 mr-1 text-xs">W${State.turn}</span>
                ${event.title}
            </div>
            <div class="text-xs text-neutral-600 pl-6">${event.text || ''}</div>
        `;
        box.appendChild(entry);
        box.scrollTop = box.scrollHeight;
    },

    showEventModal(evt) {
        const titleEl = document.getElementById('evt-title');
        const textEl = document.getElementById('evt-text');
        const effectsEl = document.getElementById('evt-effects');

        if (titleEl) titleEl.innerText = evt.title;
        if (textEl) textEl.innerText = evt.text;

        // 格式化效果展示
        const PROP_MAP = {
            san: "🧠 SAN值",
            money: "💰 金钱",
            social: "👥 社交",
            passion: "⚡ 热情",
            stamina: "🔋 体力",
            love: "💖 厨力",
            tech: "🎨 技术",
            myHeat: "⭐ 个人热度",
            cpHeat: "🔥 CP热度",
            works: "📝 作品进度"
        };
        const HIDDEN_PROPS = ['toxic', 'goddess', 'chain', 'step'];

        let effectsHtml = "";
        if (evt.effect && typeof evt.effect === 'object') {
            for (let k in evt.effect) {
                if (HIDDEN_PROPS.includes(k)) continue;
                const v = evt.effect[k];
                if (typeof v !== 'number') continue;
                const isPositive = (k === 'san' || k === 'love' || k === 'passion' || k === 'stamina' || k === 'money' || k === 'tech' || k === 'myHeat' || k === 'social')
                    ? v > 0
                    : v < 0;
                const color = isPositive ? "text-green-600" : "text-red-500";
                const sign = v > 0 ? "+" : "";
                const name = PROP_MAP[k] || k;
                effectsHtml += `<div class="flex justify-between items-center py-1.5 border-b border-neutral-100 last:border-0">
                    <span class="text-neutral-600">${name}</span>
                    <span class="${color} font-bold">${sign}${v}</span>
                </div>`;
            }
        }
        if (effectsEl) {
            effectsEl.innerHTML = effectsHtml || "<div class='text-center text-neutral-400 py-2'>状态无变化</div>";
        }

        // 清理链事件按钮，恢复默认按钮
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

    switchScreen(screenId) {
        document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active-screen'));
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active-screen');
    },

    showChainModal({ title, text, options }) {
        const modal = document.getElementById('modal-event');
        const titleEl = document.getElementById('evt-title');
        const textEl = document.getElementById('evt-text');
        const effectsEl = document.getElementById('evt-effects');

        if (titleEl) titleEl.innerText = title;
        if (textEl) textEl.innerText = text;
        if (effectsEl) effectsEl.innerHTML = "";

        let actionContainer = document.getElementById('evt-actions');
        if (!actionContainer) {
            actionContainer = document.createElement('div');
            actionContainer.id = 'evt-actions';
            const modalInner = modal.querySelector('.cute-modal') || modal.querySelector('div');
            if (modalInner) modalInner.appendChild(actionContainer);
        }

        actionContainer.innerHTML = '';
        actionContainer.style.display = 'block';

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'cute-modal-btn w-full mb-2';
            btn.innerText = opt.text;
            if (opt.next === '__DYN__') {
                btn.onclick = () => Logic.advanceChainDynamic();
            } else {
                btn.onclick = () => Logic.advanceChain(opt.next);
            }
            actionContainer.appendChild(btn);
        });

        const defaultBtn = modal ? modal.querySelector('button[data-default="evt-ok"]') : null;
        if (defaultBtn) defaultBtn.style.display = 'none';

        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }

        if (!options || options.length === 0) {
            if (defaultBtn) defaultBtn.style.display = 'block';
            actionContainer.style.display = 'none';
        }
    },

    closeModal() {
        const modal = document.getElementById('modal-event');
        if (!modal) return;

        modal.classList.add('hidden');
        modal.style.display = 'none';

        const defaultBtn = modal.querySelector('button[data-default="evt-ok"]');
        if (defaultBtn) defaultBtn.style.display = 'block';

        const actionContainer = document.getElementById('evt-actions');
        if (actionContainer) {
            actionContainer.innerHTML = '';
            actionContainer.style.display = 'none';
        }

        if (State && State.chain && State.chain.active) {
            State.chain.active = false;
            State.chain.id = null;
            State.chain.step = null;
            State.chain.data = null;
        }
        this.updateActionButtons(true);
    },

    toggleStatus() {
        this._allowStatusModal = true;
        this.showStatusModal(true);
    },

    showStatusModal(force) {
        if (!force && !this._allowStatusModal) return;
        this._allowStatusModal = false;

        const labels = ["公", "嬷", "TTK", "MMR", "毒唯", "洁癖", "杂食"];
        const keys = ["gong", "ma", "ttk", "mmr", "toxic", "purity", "omnivory"];
        const values = keys.map(k => (State.alignment && typeof State.alignment[k] === 'number') ? State.alignment[k] : 50);

        this.drawAlignmentRadar('status-radar', labels, values);

        let comment = '';
        if (values[4] > 70) comment += '毒唯倾向明显；';
        if (values[5] > 70) comment += '偏洁癖；';
        if (values[6] > 70) comment += '杂食属性强；';
        if (!comment) comment = '倾向均衡，未见极端。继续努力~ 💪';

        const commentEl = document.getElementById('status-comment');
        if (commentEl) commentEl.innerText = comment;

        const modal = document.getElementById('modal-status');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }
    },

    closeStatusModal() {
        const modal = document.getElementById('modal-status');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
        this._allowStatusModal = false;
    },

    drawAlignmentRadar(svgId, labels, values) {
        const svg = document.getElementById(svgId);
        if (!svg) return;
        const cx = 100, cy = 100, r = 70;
        const n = labels.length;
        let points = '';
        let labelTags = '';

        // 背景圆环
        let bg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(217, 70, 239, 0.05)" stroke="rgba(217, 70, 239, 0.2)" stroke-width="1"/>`;
        bg += `<circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="none" stroke="rgba(217, 70, 239, 0.1)" stroke-width="1"/>`;
        bg += `<circle cx="${cx}" cy="${cy}" r="${r * 0.33}" fill="none" stroke="rgba(217, 70, 239, 0.1)" stroke-width="1"/>`;

        for (let i = 0; i < n; i++) {
            const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            const val = Math.max(0.1, Math.min(1, values[i] / 100));
            const x = cx + r * val * Math.cos(angle);
            const y = cy + r * val * Math.sin(angle);
            points += `${x},${y} `;

            const lx = cx + (r + 20) * Math.cos(angle);
            const ly = cy + (r + 20) * Math.sin(angle);
            labelTags += `<text x="${lx}" y="${ly}" fill="#d946ef" font-size="11" font-weight="600" text-anchor="middle" alignment-baseline="middle">${labels[i]}</text>`;
        }

        svg.innerHTML = bg +
            `<polygon points="${points.trim()}" fill="rgba(217, 70, 239, 0.3)" stroke="#d946ef" stroke-width="2"/>` +
            labelTags;
    },

    updateActionButtons(enabled) {
        const btns = document.querySelectorAll('.action-btn');
        btns.forEach(btn => {
            btn.disabled = !enabled;
            btn.style.opacity = enabled ? '1' : '0.4';
            btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
            btn.style.pointerEvents = enabled ? 'auto' : 'none';
        });
    },

    showEnd(title, desc) {
        this.switchScreen('screen-end');

        const titleEl = document.getElementById('end-title');
        const descEl = document.getElementById('end-desc');
        if (titleEl) titleEl.innerText = title;
        if (descEl) descEl.innerText = desc;

        const heatEl = document.getElementById('end-stat-heat');
        const worksEl = document.getElementById('end-stat-works');
        const moneyEl = document.getElementById('end-stat-money');

        if (heatEl) heatEl.innerText = State.stats.myHeat;
        if (worksEl) worksEl.innerText = Math.floor(State.progress.works);
        if (moneyEl) moneyEl.innerText = State.stats.money;

        this.drawRadar();
    },

    // 【v3.0】带人生总结的结局展示
    showEndWithSummary(title, desc) {
        this.switchScreen('screen-end');

        const titleEl = document.getElementById('end-title');
        const descEl = document.getElementById('end-desc');
        if (titleEl) titleEl.innerText = title;
        if (descEl) descEl.innerText = desc;

        // 基础统计
        const heatEl = document.getElementById('end-stat-heat');
        const worksEl = document.getElementById('end-stat-works');
        const moneyEl = document.getElementById('end-stat-money');
        if (heatEl) heatEl.innerText = State.stats.myHeat;
        if (worksEl) worksEl.innerText = Math.floor(State.progress.works);
        if (moneyEl) moneyEl.innerText = State.stats.money;

        // 绘制雷达图
        this.drawRadar();

        // 生成人生总结内容
        const summaryContainer = document.getElementById('life-summary');
        if (summaryContainer) {
            let summaryHtml = '';

            // 成就展示
            summaryHtml += '<div class="mb-4"><h4 class="text-lg font-bold text-fuchsia-600 mb-2">🏆 获得成就</h4>';
            if (State.achievements && State.achievements.length > 0 && DATA.achievements) {
                summaryHtml += '<div class="flex flex-wrap gap-2">';
                for (let achId of State.achievements) {
                    const ach = DATA.achievements.find(a => a.id === achId);
                    if (ach) {
                        summaryHtml += `<span class="inline-block px-3 py-1 bg-gradient-to-r from-fuchsia-100 to-pink-100 text-fuchsia-700 rounded-full text-sm" title="${ach.desc}">${ach.icon} ${ach.name}</span>`;
                    }
                }
                summaryHtml += '</div>';
            } else {
                summaryHtml += '<p class="text-neutral-500 text-sm">暂无成就解锁</p>';
            }
            summaryHtml += '</div>';

            // 关键时刻
            summaryHtml += '<div class="mb-4"><h4 class="text-lg font-bold text-fuchsia-600 mb-2">📖 关键时刻</h4>';
            if (State.keyMoments && State.keyMoments.length > 0) {
                summaryHtml += '<div class="space-y-2">';
                for (let moment of State.keyMoments) {
                    const typeIcon = moment.type === 'positive' ? '💖' : (moment.type === 'negative' ? '💔' : '📌');
                    const typeColor = moment.type === 'positive' ? 'border-green-300 bg-green-50' : (moment.type === 'negative' ? 'border-red-300 bg-red-50' : 'border-neutral-300 bg-neutral-50');
                    const monthWeek = `第${Math.ceil(moment.turn / 4)}月`;
                    summaryHtml += `<div class="p-2 rounded-lg border ${typeColor}">
                        <div class="font-bold text-neutral-700">${typeIcon} ${moment.title} <span class="text-xs text-neutral-400">(${monthWeek})</span></div>
                        <div class="text-xs text-neutral-600 mt-1">${moment.content}</div>
                    </div>`;
                }
                summaryHtml += '</div>';
            } else {
                summaryHtml += '<p class="text-neutral-500 text-sm">平平淡淡的一年</p>';
            }
            summaryHtml += '</div>';

            // 行动统计
            summaryHtml += '<div class="mb-4"><h4 class="text-lg font-bold text-fuchsia-600 mb-2">📊 行动统计</h4>';
            summaryHtml += '<div class="grid grid-cols-5 gap-2 text-center text-sm">';
            const actionNames = { work: '打工', create: '创作', consume: '嗑糖', social: '社交', rest: '休息' };
            for (let action in State.actionCounts) {
                summaryHtml += `<div class="bg-neutral-100 rounded p-2"><div class="font-bold text-fuchsia-600">${State.actionCounts[action]}</div><div class="text-xs text-neutral-500">${actionNames[action]}</div></div>`;
            }
            summaryHtml += '</div></div>';

            // 个性化评语
            summaryHtml += '<div class="mb-2"><h4 class="text-lg font-bold text-fuchsia-600 mb-2">💬 总评</h4>';
            summaryHtml += `<p class="text-sm text-neutral-700 italic">${this.generateComment()}</p></div>`;

            summaryContainer.innerHTML = summaryHtml;
        }
    },

    // 【v3.0】生成个性化评语
    generateComment() {
        const s = State.stats;
        const works = State.progress.works;
        let comments = [];

        if (works >= 10) comments.push(`你完成了${Math.floor(works)}份作品，堪称高产！`);
        else if (works >= 5) comments.push(`${Math.floor(works)}份作品的产出还不错。`);
        else if (works < 2) comments.push('虽然没怎么产粮，但嗑糖也是一种快乐。');

        if (s.myHeat > 100) comments.push('你在圈内已经小有名气了！');
        if (State.totalSpent > 5000) comments.push(`你为${State.cp}总共花了${State.totalSpent}元，真·用爱发电。`);
        if (s.san < 40) comments.push('这一年对精神的考验不小...');
        if (s.love > 80) comments.push(`对${State.cp}的爱依然炽热！`);
        if (State.minSan < 20 && s.san > 60) comments.push('从深渊中爬起来的你，更加坚强了。');

        if (comments.length === 0) {
            comments.push(`在${State.cp}的坑里，你度过了平凡而充实的一年。`);
        }

        return comments.join(' ');
    },

    drawRadar() {
        const svg = document.getElementById('radar-chart');
        if (!svg) return;

        const stats = [
            State.stats.love,
            State.stats.myHeat,
            State.stats.tech,
            State.stats.money / 50,
            State.stats.san
        ];
        const max = [100, 200, 100, 200, 100];
        const labels = ["💖 爱", "🔥 热", "🎨 力", "💰 财", "🧠 智"];

        let points = "";
        let labelTags = "";
        const cx = 100, cy = 100, r = 65;

        // 背景
        svg.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;

        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            let val = stats[i] / max[i];
            if (val > 1) val = 1;
            if (val < 0.1) val = 0.1;

            const x = cx + r * val * Math.cos(angle);
            const y = cy + r * val * Math.sin(angle);
            points += `${x},${y} `;

            const lx = cx + (r + 18) * Math.cos(angle);
            const ly = cy + (r + 18) * Math.sin(angle);
            labelTags += `<text x="${lx}" y="${ly}" fill="#fbbf24" font-size="11" text-anchor="middle" alignment-baseline="middle">${labels[i]}</text>`;
        }

        svg.innerHTML += `<polygon points="${points}" fill="rgba(217, 70, 239, 0.5)" stroke="#d946ef" stroke-width="2"/>` + labelTags;
    },

    // 【新增】更新新闻播报
    updateNewsTicker(newsItems) {
        const ticker = document.getElementById('news-ticker-content');
        if (!ticker || !newsItems || newsItems.length === 0) return;

        let html = '';
        newsItems.forEach(item => {
            let typeClass = '';
            if (item.type === 'hot') typeClass = 'hot';
            else if (item.type === 'alert') typeClass = 'alert';
            else if (item.type === 'happy') typeClass = 'happy';

            html += `<span class="news-item ${typeClass}">${item.text}</span>`;
        });
        // 复制一份实现无缝滚动
        html += html;

        ticker.innerHTML = html;
    }
};

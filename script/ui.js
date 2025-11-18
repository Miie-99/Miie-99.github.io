        // ==========================================
        // MODULE: UI (js/ui.js)
        // 界面渲染
        // ==========================================
        const UI = {
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
                
                // 格式化效果展示
                let effectsHtml = "";
                for(let k in evt.effect) {
                    let v = evt.effect[k];
                    let color = v > 0 ? "text-green-600" : "text-red-600";
                    let sign = v > 0 ? "+" : "";
                    // 简单的字典翻译
                    const map = {san:"San值", money:"金钱", social:"社交", passion:"热情", stamina:"体力", love:"厨力", tech:"技术", myHeat:"热度"};
                    let name = map[k] || k;
                    effectsHtml += `<div class="flex justify-between"><span>${name}</span><span class="${color}">${sign}${v}</span></div>`;
                }
                document.getElementById('evt-effects').innerHTML = effectsHtml || "无数值变化";
                document.getElementById('modal-event').classList.remove('hidden');
            },

            closeModal() {
                document.getElementById('modal-event').classList.add('hidden');
            },

            toggleStatus() {
                // 简单实现：直接在log里打印详细状态
                this.log(`当前状态: 毒唯倾向:${State.flags.toxic?"是":"否"} 女神:${State.flags.goddess?"是":"否"}`, "purple");
            },

            showEnd(title, desc) {
                document.getElementById('screen-game').classList.add('hidden');
                document.getElementById('screen-end').classList.remove('hidden');
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

        // ==========================================
        // MODULE: LOGIC (js/logic.js)
        // 业务逻辑控制
        // ==========================================
        const Logic = {
            // 全局配置：连续事件触发概率（可调）
            CHAIN_TRIGGER_RATES: {
                ai_accuse: 0.04,
                collab_project: 0.03
            },

            // 行动基础消耗配置
            costs: {
                work:   { stamina: -15, passion: -5, time: 1 },
                create: { stamina: -20, passion: 5, time: 1 },
                consume:{ stamina: -5,  passion: 5, time: 1 },
                social: { stamina: -10, passion: -2,time: 1 },
                rest:   { stamina: 0,   passion: -5, time: 1 }
            },

            processAction(actionType) {
                    // Special-case: rest action uses probabilistic recovery and its own flow
                    if (actionType === 'rest') {
                        State.turn += 1;
                        State.stats.passion -= 5; // 睡觉不产粮，热情微降

                        const roll = Math.random();
                        let heal = 50;
                        let msg = "【休息】平平淡淡地睡了一觉，补足了精力。(体力+50)";

                        if (roll > 0.9) {
                            heal = 70;
                            State.stats.san += 15;
                            msg = "【深度睡眠】做了一个美梦，醒来神清气爽！(体力+70, San+15)";
                        } else if (roll < 0.15) {
                            heal = 30;
                            State.stats.san -= 10;
                            msg = "【失眠】辗转反侧，翻来覆去，没睡好。(体力+30, San-10)";
                        } else if (roll < 0.05) {
                            heal = 20;
                            State.stats.money -= 200;
                            msg = "【生病】半夜突发不适，去医院花了不少钱。(体力+20, 金钱-200)";
                        }

                        State.stats.stamina += heal;
                        if (State.stats.stamina > 100) State.stats.stamina = 100;

                        UI.showEventModal({ title: "休息结束", text: msg, effect: {} });
                        UI.render();
                        return;
                    }

                    // 1. 检查体力
                    if (State.stats.stamina < 15) {
                        UI.log("体力透支，强制休息！", "red");
                        this.processAction('rest');
                        return;
                    }

                    // 2. 扣除基础消耗
                    const cost = this.costs[actionType] || {};
                    State.modify(cost);
                    State.turn += 1;

                    // 3. 连续事件随机触发（小概率）
                    // 当产出(create)时可能触发鉴AI或接力企划
                    if (actionType === 'create') {
                        if (Math.random() < this.CHAIN_TRIGGER_RATES.ai_accuse) { // 触发鉴AI
                            this.triggerChain('ai_accuse');
                            UI.render();
                            return;
                        }
                        if (Math.random() < this.CHAIN_TRIGGER_RATES.collab_project) { // 触发接力企划
                            this.triggerChain('collab_project');
                            UI.render();
                            return;
                        }
                    }

                    // 4. 判定事件
                    let event = this.getTriggerEvent() || this.getRandomEvent(actionType);

                    // 5. 执行事件并弹窗
                    if (event) {
                        State.modify(event.effect || {});
                        UI.showEventModal(event);
                        UI.log(`[事件] ${event.title}`, "blue");
                    }

                    // 6. 检查游戏结束
                    this.checkGameOver();
                    UI.render();
                },

            // 优先检查特殊触发器
            getTriggerEvent() {
                // 30% 概率检查属性触发器，避免过于频繁
                if (Math.random() > 0.3) return null;
                
                for (let t of DATA.triggers) {
                    if (t.condition(State.stats)) {
                        return t.event;
                    }
                }
                return null;
            },

            // 从对应池子捞事件
            getRandomEvent(poolKey) {
                const pool = DATA.events[poolKey];
                if (!pool) return null;
                // 75% 概率触发事件，否则是平淡的日常
                if (Math.random() > 0.25) {
                    const evt = pool[Math.floor(Math.random() * pool.length)];
                    // 文本替换
                    const processedEvt = JSON.parse(JSON.stringify(evt)); // deep copy
                    processedEvt.text = processedEvt.text.replace(/{cp}/g, State.cp).replace(/{rival}/g, State.rival);
                    return processedEvt;
                }
                return {
                    title: "平淡的一周",
                    text: "这周什么特别的事都没发生，只是时间流逝了。",
                    effect: {}
                };
            },

            checkGameOver() {
                if (State.stats.passion <= 0) UI.showEnd("淡坑退圈", "爱会消失，对吗？你的热情耗尽了，变成了现充。");
                else if (State.stats.san <= 0) UI.showEnd("破防退网", "互联网太恶意了，你的精神已经崩溃。");
                else if (State.stats.money <= -500) UI.showEnd("信用破产", "为了买谷欠下巨款，号被收走了。");
                else if (State.turn > State.maxTurn) UI.showEnd("一周年纪念", "你在坑里坚持了一年，这就是真爱吗？");
            }
            ,

            // ========== 连续事件 (Chain Events) ===========
            triggerChain(chainId) {
                const chain = (typeof CHAINS !== 'undefined') ? CHAINS[chainId] : null;
                if (!chain) return;

                State.chain.active = true;
                State.chain.id = chainId;
                State.chain.step = null;
                State.chain.data = {};

                UI.updateActionButtons(false);

                // 如果有 onStart 返回直接的 step key，则直接进入步骤
                if (chain.onStart) {
                    const startKey = chain.onStart(State);
                    this.processChainStep(startKey);
                    return;
                }

                // 否则显示起始文本与选项
                UI.showChainModal({ title: chain.title, text: chain.startText || '', options: chain.options || [] });
            },

            advanceChain(nextStepKey) {
                // 兼容传入函数或字符串
                const chain = CHAINS[State.chain.id];
                if (!chain) return;

                // 如果 next 是特殊标记 '__DYN__'，让 processChainStep 去解析当前 step 的 next
                if (nextStepKey === '__DYN__') {
                    this.advanceChainDynamic();
                    return;
                }

                this.processChainStep(nextStepKey);
            },

            advanceChainDynamic() {
                const chain = CHAINS[State.chain.id];
                if (!chain) return;
                const current = State.chain.step;
                const step = chain.steps[current];
                if (!step) return;
                let nextKey = null;
                if (typeof step.next === 'function') nextKey = step.next(State);
                else nextKey = step.next;
                if (nextKey) this.processChainStep(nextKey);
            },

            processChainStep(stepKey) {
                const chain = CHAINS[State.chain.id];
                if (!chain) return;
                const step = chain.steps[stepKey];
                if (!step) return;

                State.chain.step = stepKey;

                // a) 消耗时间
                if (step.duration && step.duration > 0) {
                    State.turn += step.duration;
                    State.stats.stamina -= (10 * step.duration);
                }

                // b) 随机内容处理
                let content = step.text || '';
                if (step.randomContent) {
                    const rc = step.randomContent[Math.floor(Math.random() * step.randomContent.length)];
                    content = rc.text;
                    if (rc.effect) State.modify(rc.effect);
                }

                // c) 结算 effect
                if (step.effect) State.modify(step.effect);

                // d) 处理结束或继续
                if (step.isEnd) {
                    UI.showEventModal({ title: chain.title + ' - 结局', text: content, effect: step.effect || {} });
                    State.chain.active = false;
                    State.chain.id = null;
                    State.chain.step = null;
                    State.chain.data = null;
                    UI.updateActionButtons(true);
                } else {
                    // 还未结束，准备下一步选项（通常是继续）
                    const next = step.next;
                    // 如果 next 是函数或 undefined，使用动态推进按钮
                    const option = (typeof next === 'string') ? { text: '继续...', next: next } : { text: '继续...', next: '__DYN__' };
                    UI.showChainModal({ title: chain.title + '（进行中）', text: content, options: [option] });
                }

                UI.render();
            },

            // ========== 称号/头衔判定 ===========
            getEndTitle() {
                const Titles = [
                    { title: "镇圈神仙", check: (s) => s.myHeat > 180 && s.tech > 80, desc: "你的名字就是质量保证。" },
                    { title: "钞能力者", check: (s) => s.money > 8000, desc: "用钱提升了影响力。" },
                    { title: "深渊疯狗", check: (s) => s.san < 20 && s.passion > 60, desc: "为爱撕得狠戾。" },
                    { title: "吃瓜路人", check: (s) => s.works < 2 && s.social > 60, desc: "热衷旁观且社交活跃。" },
                    { title: "默默无闻", check: (s) => true, desc: "没有留下太多印象。" }
                ];
                return Titles.find(t => t.check(State.stats));
            }
        };


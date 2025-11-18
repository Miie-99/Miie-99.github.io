        // ==========================================
        // MODULE: LOGIC (js/logic.js)
        // 业务逻辑控制
        // ==========================================
        const Logic = {
            // 行动基础消耗配置
            costs: {
                work:   { stamina: -15, passion: -5, time: 1 },
                create: { stamina: -20, passion: 5, time: 1 },
                consume:{ stamina: -5,  passion: 5, time: 1 },
                social: { stamina: -10, passion: -2,time: 1 },
                rest:   { stamina: 0,   passion: -5, time: 1 }
            },

            processAction(actionType) {
                // 1. 检查体力
                if (State.stats.stamina < 15 && actionType !== 'rest') {
                    UI.log("体力透支，强制休息！", "red");
                    this.processAction('rest');
                    return;
                }

                // 2. 扣除基础消耗
                const cost = this.costs[actionType];
                State.modify(cost);
                State.turn += 1;

                // 3. 判定事件
                let event = this.getTriggerEvent() || this.getRandomEvent(actionType);
                
                // 4. 执行事件并弹窗
                if (event) {
                    State.modify(event.effect);
                    UI.showEventModal(event);
                    UI.log(`[事件] ${event.title}`, "blue");
                }

                // 5. 检查游戏结束
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
                // 40% 概率触发事件，否则是平淡的日常
                if (Math.random() > 0.4) {
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
        };

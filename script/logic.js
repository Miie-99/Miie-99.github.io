// ==========================================
// MODULE: LOGIC (js/logic.js)
// 业务逻辑控制 - v3.2 游戏平衡重构版
// ==========================================
const Logic = {
    // 连续事件触发概率
    CHAIN_TRIGGER_RATES: {
        ai_accuse: 0.04,
        collab_project: 0.03
    },

    // 【重平衡】行动基础消耗配置
    costs: {
        work: { stamina: -18, passion: -3, time: 1 },  // 打工更累
        create: { stamina: -25, passion: 3, time: 1 },   // 创作最费体力
        consume: { stamina: -8, passion: 3, time: 1 },   // 嗑糖轻松
        social: { stamina: -12, passion: -2, time: 1 },  // 社交有消耗
        rest: { stamina: 0, passion: -3, time: 1 }   // 休息略降热情
    },

    // 【v3.2新增】行动默认效果（基础收益）
    actionBaseEffects: {
        work: { money: 300 },           // 打工：+300金钱
        create: { tech: 2, cpHeat: 500 }, // 产粮：+2技术，+500热度
        consume: { san: 5 },            // 磕糖：+5 SAN
        social: { myHeat: 1000 }        // 社交：+1000个人热度
    },

    // 【新增】难度阶段配置
    phases: {
        rookie: { turns: [1, 12], positiveBias: 0.7, eventIntensity: 0.6 },   // 入坑期：温和
        honeymoon: { turns: [13, 24], positiveBias: 0.5, eventIntensity: 0.8 },  // 热恋期：正常
        fatigue: { turns: [25, 36], positiveBias: 0.35, eventIntensity: 1.0 }, // 疲惫期：变难
        climax: { turns: [37, 48], positiveBias: 0.3, eventIntensity: 1.2 }   // 抉择期：极端
    },

    // 获取当前阶段
    getCurrentPhase() {
        const turn = State.turn;
        for (let phase in this.phases) {
            const [start, end] = this.phases[phase].turns;
            if (turn >= start && turn <= end) return phase;
        }
        return 'climax';
    },

    // 获取阶段显示名
    getPhaseDisplayName(phase) {
        const names = {
            rookie: '🌸 入坑期',
            honeymoon: '💕 热恋期',
            fatigue: '😓 疲惫期',
            climax: '⚡ 抉择期'
        };
        return names[phase] || '🌸 入坑期';
    },

    // 【重平衡】应用难度系数到效果
    applyDifficultyModifier(effect) {
        const phase = this.getCurrentPhase();
        const config = this.phases[phase];
        const modified = { ...effect };

        for (let key in modified) {
            if (typeof modified[key] === 'number' && key !== 'works') {
                // 负面效果在后期放大
                if (modified[key] < 0) {
                    modified[key] = Math.floor(modified[key] * config.eventIntensity);
                }
                // 正面效果在后期略微降低
                else if (modified[key] > 0 && config.eventIntensity > 1) {
                    modified[key] = Math.floor(modified[key] * 0.9);
                }
            }
        }
        return modified;
    },

    // 【v3.2更新】热度联动修正 - 使用新量级阈值
    applyHeatModifier(effect, actionType) {
        const modified = { ...effect };
        const cpHeat = State.stats.cpHeat;
        const myHeat = State.stats.myHeat;

        // 创作行动：个人热度越高，myHeat和作品进度加成越大
        if (actionType === 'create') {
            if (myHeat > 1000000) {
                // 大V创作事半功倍（100万粉以上）
                if (modified.myHeat) modified.myHeat = Math.floor(modified.myHeat * 1.5);
                if (modified.works) modified.works = modified.works * 1.2;
            } else if (myHeat < 10000) {
                // 小透明努力不一定有回报（1万以下）
                if (modified.myHeat) modified.myHeat = Math.floor(modified.myHeat * 0.5);
            }
            // CP热度影响作品传播
            if (cpHeat > 10000000) {
                // 热门CP（1000万以上）
                if (modified.myHeat) modified.myHeat = Math.floor(modified.myHeat * 1.3);
            } else if (cpHeat < 10000) {
                // 冷门CP（1万以下）
                if (modified.myHeat) modified.myHeat = Math.floor(modified.myHeat * 0.6);
            }
        }

        // 消费行动：CP热度影响嗑糖体验
        if (actionType === 'consume') {
            if (cpHeat > 1000000) {
                // 热门CP糖多（100万以上）
                if (modified.love) modified.love = Math.floor(modified.love * 1.3);
            } else if (cpHeat < 5000) {
                // 冷门CP糖少（5000以下）
                if (modified.love) modified.love = Math.floor(modified.love * 0.7);
                modified.passion = (modified.passion || 0) - 3; // 冷圈嗑糖略显孤独
            }
        }

        // 社交行动：个人热度影响社交结果
        if (actionType === 'social') {
            if (myHeat > 500000) {
                // 有名气的人社交更顺利（50万以上）
                if (modified.social) modified.social = Math.floor(modified.social * 1.3);
                if (modified.myHeat) modified.myHeat = Math.floor(modified.myHeat * 1.2);
            }
            if (myHeat > 10000000) {
                // 但太红也容易招来是非（1000万以上）
                modified.san = (modified.san || 0) - 5;
            }
        }

        return modified;
    },

    // 【v3.0】身份被动技能系统 - 根据事件标签应用被动效果
    applyIdentityPassive(effect, actionType, eventTags) {
        if (!State.identity || !State.identity.prefix || !State.identity.prefix.passive) {
            return effect;
        }

        const modified = { ...effect };
        const passive = State.identity.prefix.passive;
        const modifiers = passive.modifiers || {};
        const triggers = passive.triggers || {};

        // 检查是否触发被动
        let triggered = false;

        // 检查行动类型触发
        if (triggers.actionTypes && triggers.actionTypes.includes(actionType)) {
            triggered = true;
        }

        // 检查内容类型触发
        if (triggers.contentTypes && eventTags && eventTags.contentTypes) {
            for (let ct of triggers.contentTypes) {
                if (eventTags.contentTypes.includes(ct)) {
                    triggered = true;
                    break;
                }
            }
        }

        // 检查情感类型触发
        if (triggers.sentiments && eventTags && eventTags.sentiment) {
            if (triggers.sentiments.includes(eventTags.sentiment)) {
                triggered = true;
            }
        }

        if (!triggered) return modified;

        // 应用修正器
        // 休息恢复加成
        if (modifiers.rest_heal && actionType === 'rest') {
            if (modified.stamina && modified.stamina > 0) {
                modified.stamina = Math.floor(modified.stamina * modifiers.rest_heal);
            }
            if (modified.san && modified.san > 0) {
                modified.san = Math.floor(modified.san * modifiers.rest_heal);
            }
        }

        // 社交负面加成
        if (modifiers.social_negative && actionType === 'social' && eventTags && eventTags.sentiment === 'negative') {
            if (modified.san && modified.san < 0) {
                modified.san = Math.floor(modified.san * modifiers.social_negative);
            }
            if (modified.social && modified.social < 0) {
                modified.social = Math.floor(modified.social * modifiers.social_negative);
            }
        }

        // 金钱损失减半
        if (modifiers.money_loss && modified.money && modified.money < 0) {
            modified.money = Math.floor(modified.money * modifiers.money_loss);
        }

        // 免费购买概率（在事件处理时单独检查）
        if (modifiers.free_purchase_chance && eventTags && eventTags.contentTypes && eventTags.contentTypes.includes('purchase')) {
            if (Math.random() < modifiers.free_purchase_chance) {
                modified.money = 0; // 免费了！
                modified._freeGift = true; // 标记免费
            }
        }

        // 嗑糖正面加成
        if (modifiers.consume_positive && actionType === 'consume' && eventTags && eventTags.sentiment === 'positive') {
            if (modified.love && modified.love > 0) {
                modified.love = Math.floor(modified.love * modifiers.consume_positive);
            }
            if (modified.passion && modified.passion > 0) {
                modified.passion = Math.floor(modified.passion * modifiers.consume_positive);
            }
        }

        // SAN损失加成（玻璃心）
        if (modifiers.san_loss && eventTags && eventTags.sentiment === 'negative') {
            if (modified.san && modified.san < 0) {
                modified.san = Math.floor(modified.san * modifiers.san_loss);
            }
        }

        // 热度获取加成
        if (modifiers.heat_gain && eventTags && eventTags.contentTypes && eventTags.contentTypes.includes('heat_gain')) {
            if (modified.myHeat && modified.myHeat > 0) {
                modified.myHeat = Math.floor(modified.myHeat * modifiers.heat_gain);
            }
        }

        // 社交正面削弱（社恐）
        if (modifiers.social_positive && actionType === 'social' && eventTags && eventTags.sentiment === 'positive') {
            if (modified.social && modified.social > 0) {
                modified.social = Math.floor(modified.social * modifiers.social_positive);
            }
        }

        // 创作额外作品（手速惊人）
        if (modifiers.extra_works_chance && eventTags && eventTags.contentTypes && eventTags.contentTypes.includes('creation')) {
            if (Math.random() < modifiers.extra_works_chance) {
                modified.works = (modified.works || 0) + modifiers.extra_works;
                modified._bonusWorks = true;
            }
        }

        return modified;
    },

    // 【v3.0】职业周期效果 - 每周/每月触发
    applyRolePeriodic() {
        if (!State.identity || !State.identity.role || !State.identity.role.periodic) {
            return;
        }

        const periodic = State.identity.role.periodic;
        const turn = State.turn;

        // 检查是否到达触发周期
        if (periodic.interval === 0) {
            // interval为0表示特殊触发（如创作成功时）
            return;
        }

        if (turn % periodic.interval !== 0) {
            return;
        }

        // 应用周期效果
        if (periodic.effect) {
            const changes = State.modify(periodic.effect);
            if (changes.length > 0) {
                const roleName = State.identity.role.txt;
                UI.log(`📅 【${roleName}·${periodic.name}】周期效果触发！`, "event");
            }
        }

        // 检查特殊效果
        if (periodic.special) {
            // 学生考试周
            if (periodic.special.examWeek) {
                const month = Math.ceil(turn / 4);
                if (month === periodic.special.examWeek.month) {
                    State.modify(periodic.special.examWeek.effect);
                    UI.log(`📚 考试周来临，压力山大...`, "negative");
                }
            }

            // 猫奴猫生病
            if (periodic.special.sickChance && Math.random() < periodic.special.sickChance) {
                State.modify(periodic.special.sickEffect);
                UI.log(`🐱 猫主子生病了，带去看兽医花了钱...`, "negative");
            }
        }
    },

    // 【v3.0】自由职业创作成功奖励
    applyFreelanceBonus() {
        if (!State.identity || !State.identity.role) return;
        if (State.identity.role.txt !== "自由职业") return;

        const periodic = State.identity.role.periodic;
        if (periodic && periodic.onCreateSuccess) {
            State.modify(periodic.onCreateSuccess);
            UI.log(`💼 【自由职业】创作成功，额外获得稿费！`, "positive");
        }
    },

    processAction(actionType) {
        // 【v3.0】统计行动次数
        if (State.actionCounts && State.actionCounts.hasOwnProperty(actionType)) {
            State.actionCounts[actionType]++;
        }

        // 【v3.2】记录当前回合执行的行动（用于条件扣除判断）
        if (!State.currentTurnActions) State.currentTurnActions = [];
        if (!State.currentTurnActions.includes(actionType)) {
            State.currentTurnActions.push(actionType);
        }

        // 【重平衡】休息行动 - 降低恢复量
        if (actionType === 'rest') {
            State.turn += 1;
            State.stats.passion -= 3;

            const roll = Math.random();
            let heal = 30;  // 基础恢复从50降到30
            let sanHeal = 8;
            let msg = "【休息】平平淡淡地睡了一觉，补充了些精力。(体力+30, SAN+8)";

            if (roll > 0.85) {
                heal = 45;
                sanHeal = 15;
                msg = "【深度睡眠】做了一个关于CP的美梦，醒来神清气爽！(体力+45, SAN+15)";
            } else if (roll < 0.15) {
                heal = 20;
                sanHeal = -5;
                msg = "【失眠】脑子里全是CP，翻来覆去睡不着。(体力+20, SAN-5)";
            } else if (roll < 0.08) {
                heal = 15;
                State.stats.money -= 150;
                msg = "【生病】熬夜太多身体扛不住了，去医院花了钱。(体力+15, 金钱-150)";
            }

            State.stats.stamina += heal;
            State.stats.san += sanHeal;
            if (State.stats.stamina > 100) State.stats.stamina = 100;
            if (State.stats.san > 100) State.stats.san = 100;

            UI.showEventModal({ title: "休息结束", text: msg, effect: {} });
            UI.render();
            this.applyWeeklyDecay();
            // 【v3.0】职业周期效果
            this.applyRolePeriodic();
            return;
        }

        // 体力检查
        if (State.stats.stamina < 18) {
            UI.log("⚠️ 体力透支，强制休息！", "negative");
            this.processAction('rest');
            return;
        }

        // 扣除基础消耗
        const cost = this.costs[actionType] || {};
        State.modify(cost);
        State.turn += 1;

        // 【v3.2新增】应用行动默认效果（基础收益）
        const baseEffect = this.actionBaseEffects[actionType];
        if (baseEffect) {
            State.modify(baseEffect);
            // 记录基础收益日志
            const effectStr = Object.entries(baseEffect)
                .map(([k, v]) => `${k}${v > 0 ? '+' : ''}${k.includes('Heat') ? State.formatHeat(v) : v}`)
                .join(', ');
            UI.log(`📌 【${actionType === 'work' ? '打工' : actionType === 'create' ? '产粮' : actionType === 'consume' ? '磕糖' : '社交'}基础】${effectStr}`, "neutral");
        }

        // 连续事件触发
        if (actionType === 'create') {
            if (Math.random() < this.CHAIN_TRIGGER_RATES.ai_accuse) {
                this.triggerChain('ai_accuse');
                UI.render();
                return;
            }
            if (Math.random() < this.CHAIN_TRIGGER_RATES.collab_project) {
                this.triggerChain('collab_project');
                UI.render();
                return;
            }
        }

        // 判定事件
        let event = this.getTriggerEvent() || this.getRandomEvent(actionType);

        // 执行事件
        if (event) {
            // 【重平衡】应用难度系数
            let modifiedEffect = this.applyDifficultyModifier(event.effect || {});
            // 【新增】应用热度联动修正
            modifiedEffect = this.applyHeatModifier(modifiedEffect, actionType);
            // 【v3.0】应用身份被动技能
            modifiedEffect = this.applyIdentityPassive(modifiedEffect, actionType, event.tags);

            State.modify(modifiedEffect);
            UI.showEventModal({ ...event, effect: modifiedEffect });
            // 【v3.0】使用新的事件日志显示完整内容
            UI.logEvent(event);

            // 【v3.0】记录关键时刻
            this.recordKeyMoment(event, event.tags?.sentiment);

            // 【v3.0】处理属性倾向变化
            if (event.alignmentChange) {
                State.modifyAlignment(event.alignmentChange);
            }

            // 【v3.0】特殊标记提示
            if (modifiedEffect._freeGift) {
                UI.log(`✨ 【钞能力】触发！本次购买免费！`, "positive");
            }
            if (modifiedEffect._bonusWorks) {
                UI.log(`⚡ 【高产似母猪】触发！额外作品进度+0.5！`, "positive");
            }

            // 【v3.0】自由职业创作成功奖励
            if (actionType === 'create' && event.tags && event.tags.contentTypes &&
                event.tags.contentTypes.includes('creation') && event.tags.sentiment === 'positive') {
                this.applyFreelanceBonus();
            }
        }

        // 【v3.0】职业周期效果
        this.applyRolePeriodic();

        // 【v3.0】定期检查成就
        if (State.turn % 4 === 0) {
            this.checkAchievements();
        }

        // 【v3.2】每周条件衰减
        this.applyWeeklyDecay();

        // 检查游戏结束
        this.checkGameOver();
        UI.render();
    },

    // 【v3.2重写】每周条件衰减 - 只有未执行对应行动时才扣除
    applyWeeklyDecay() {
        const actions = State.currentTurnActions || [];
        const phase = this.getCurrentPhase();
        let decayLog = [];

        // 没打工 → 扣金钱（生活费）
        if (!actions.includes('work')) {
            const expense = 200;
            State.stats.money -= expense;
            decayLog.push(`金钱-${expense}`);
        }

        // 没产粮 → 扣技术和CP热度
        if (!actions.includes('create')) {
            // 技术遗忘
            if (State.stats.tech > 0) {
                State.stats.tech = Math.max(0, State.stats.tech - 1);
                decayLog.push('技术-1');
            }
            // CP热度衰减2%
            const heatDecay = Math.floor(State.stats.cpHeat * 0.02);
            if (heatDecay > 0) {
                State.stats.cpHeat -= heatDecay;
                decayLog.push(`CP热度-${State.formatHeat(heatDecay)}`);
            }
        }

        // 没社交 → 扣个人热度
        if (!actions.includes('social')) {
            // 个人热度衰减3%
            const myHeatDecay = Math.floor(State.stats.myHeat * 0.03);
            if (myHeatDecay > 0) {
                State.stats.myHeat -= myHeatDecay;
                decayLog.push(`个人热度-${State.formatHeat(myHeatDecay)}`);
            }
        }

        // SAN值自然衰减（后期更快）
        let sanDecay = 1;
        if (phase === 'fatigue') sanDecay = 2;
        if (phase === 'climax') sanDecay = 3;
        State.stats.san -= sanDecay;
        decayLog.push(`SAN-${sanDecay}`);

        // 热度下限保护
        if (State.stats.cpHeat < 0) State.stats.cpHeat = 0;
        if (State.stats.myHeat < 0) State.stats.myHeat = 0;

        // 显示衰减日志
        if (decayLog.length > 0) {
            UI.log(`📉 【周结算】${decayLog.join(', ')}`, "neutral");
        }

        // 清空当前回合行动记录
        State.currentTurnActions = [];
    },

    // 优先检查特殊触发器
    getTriggerEvent() {
        // 25% 概率检查
        if (Math.random() > 0.25) return null;

        for (let t of DATA.triggers) {
            if (t.condition(State.stats)) {
                return t.event;
            }
        }
        return null;
    },

    // 【重平衡】从池子捞事件 - 加入阶段偏向
    getRandomEvent(poolKey) {
        const pool = DATA.events[poolKey];
        if (!pool) return null;

        const phase = this.getCurrentPhase();
        const config = this.phases[phase];

        // 事件触发概率：70%
        if (Math.random() > 0.3) {
            const evt = pool[Math.floor(Math.random() * pool.length)];
            const processedEvt = JSON.parse(JSON.stringify(evt));
            processedEvt.text = processedEvt.text.replace(/{cp}/g, State.cp).replace(/{rival}/g, State.rival);

            // 【重平衡】根据阶段调整事件效果
            if (processedEvt.effect) {
                // 计算事件是正面还是负面
                let netEffect = 0;
                for (let key in processedEvt.effect) {
                    if (typeof processedEvt.effect[key] === 'number') {
                        netEffect += processedEvt.effect[key];
                    }
                }

                // 如果是正面事件且超过正面偏向，可能跳过
                if (netEffect > 10 && Math.random() > config.positiveBias) {
                    // 返回平淡事件代替
                    return {
                        title: "平淡的一周",
                        text: "这周没什么特别的，你默默刷了刷首页，时间就这么过去了。",
                        effect: {}
                    };
                }
            }

            return processedEvt;
        }

        return {
            title: "平淡的一周",
            text: "这周什么特别的事都没发生，只是时间流逝了。",
            effect: {}
        };
    },

    // 【重平衡】游戏结束检查 - 调整阈值
    checkGameOver() {
        if (State.stats.passion <= 0) {
            UI.showEnd("淡坑退圈", "爱会消失，对吗？你的热情耗尽了，变成了普通的现充。");
        } else if (State.stats.san <= 0) {
            UI.showEnd("破防退网", "互联网太恶意了，同人圈的纷争让你的精神彻底崩溃。");
        } else if (State.stats.money <= -300) {  // 从-500调整到-300
            UI.showEnd("信用破产", "为了买谷欠下巨款，花呗白条全部逾期，电话被打爆了。");
        } else if (State.turn > State.maxTurn) {
            // 根据成就给出不同结局
            this.showFinalEnding();
        }
    },

    // 【v3.0】最终结局判定 - 使用新结局系统
    showFinalEnding() {
        const s = State.stats;

        // 检查成就
        this.checkAchievements();

        // 从DATA.endings中查找匹配的结局（按顺序，第一个匹配的结局生效）
        let ending = null;
        if (DATA.endings) {
            for (let e of DATA.endings) {
                try {
                    if (e.condition(s)) {
                        ending = e;
                        break;
                    }
                } catch (err) {
                    console.log('Ending check error:', e.id, err);
                }
            }
        }

        // 默认结局
        if (!ending) {
            ending = {
                title: "📖 平凡的一年",
                desc: "不算轰轰烈烈，但你在{cp}坑里坚持了365天，这就是真爱吧？"
            };
        }

        // 替换CP/rival占位符
        let title = ending.title;
        let desc = ending.desc.replace(/{cp}/g, State.cp).replace(/{rival}/g, State.rival);

        // 调用UI显示结局和人生总结
        UI.showEndWithSummary(title, desc);
    },

    // 【v3.0】成就检查
    checkAchievements() {
        if (!DATA.achievements) return;

        const s = State.stats;
        for (let ach of DATA.achievements) {
            // 跳过已解锁的
            if (State.achievements.includes(ach.id)) continue;

            try {
                if (ach.condition(s)) {
                    State.achievements.push(ach.id);
                    UI.log(`🏆 成就解锁：${ach.name}`, "positive");
                }
            } catch (err) {
                console.log('Achievement check error:', ach.id, err);
            }
        }
    },

    // 【v3.0】记录关键事件
    recordKeyMoment(event, sentiment) {
        if (!event || !event.title) return;

        // 只记录重要事件
        const isImportant =
            (event.effect && (Math.abs(event.effect.san || 0) >= 20 ||
                Math.abs(event.effect.myHeat || 0) >= 30 ||
                Math.abs(event.effect.money || 0) >= 500)) ||
            (event.tags && event.tags.contentTypes &&
                (event.tags.contentTypes.includes('cp_sweet') || event.tags.contentTypes.includes('rival_pain')));

        if (isImportant) {
            // 传递标题和文本内容
            State.addKeyMoment(event.title, event.text || '', sentiment || event.tags?.sentiment || 'neutral');
        }
    },

    // ========== 连续事件系统 ==========
    triggerChain(chainId) {
        const chain = (typeof CHAINS !== 'undefined') ? CHAINS[chainId] : null;
        if (!chain) return;

        State.chain.active = true;
        State.chain.id = chainId;
        State.chain.step = null;
        State.chain.data = {};

        UI.updateActionButtons(false);

        if (chain.onStart) {
            const startKey = chain.onStart(State);
            this.processChainStep(startKey);
            return;
        }

        UI.showChainModal({ title: chain.title, text: chain.startText || '', options: chain.options || [] });
    },

    advanceChain(nextStepKey) {
        const chain = CHAINS[State.chain.id];
        if (!chain) return;

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

        if (step.duration && step.duration > 0) {
            State.turn += step.duration;
            State.stats.stamina -= (12 * step.duration); // 从10调整到12
        }

        let content = step.text || '';
        if (step.randomContent) {
            const rc = step.randomContent[Math.floor(Math.random() * step.randomContent.length)];
            content = rc.text;
            if (rc.effect) State.modify(rc.effect);
        }

        if (step.effect) State.modify(step.effect);

        if (step.isEnd) {
            UI.showEventModal({ title: chain.title + ' - 结局', text: content, effect: step.effect || {} });
            State.chain.active = false;
            State.chain.id = null;
            State.chain.step = null;
            State.chain.data = null;
            UI.updateActionButtons(true);
        } else {
            const next = step.next;
            const option = (typeof next === 'string') ? { text: '继续...', next: next } : { text: '继续...', next: '__DYN__' };
            UI.showChainModal({ title: chain.title + '（进行中）', text: content, options: [option] });
        }

        UI.render();
    },

    // 称号判定
    getEndTitle() {
        const Titles = [
            { title: "镇圈神仙", check: (s) => s.myHeat > 150 && s.tech > 60, desc: "你的名字就是质量保证。" },
            { title: "钞能力者", check: (s) => s.money > 6000, desc: "用钱撑起了整个圈子。" },
            { title: "深渊疯狗", check: (s) => s.san < 25 && s.passion > 50, desc: "为爱疯狂。" },
            { title: "吃瓜路人", check: (s) => State.progress.works < 2 && s.social > 50, desc: "热衷旁观。" },
            { title: "默默无闻", check: (s) => true, desc: "平平淡淡才是真。" }
        ];
        return Titles.find(t => t.check(State.stats));
    }
};

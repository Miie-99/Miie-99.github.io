// ==========================================
// MODULE: STATE (js/state.js)
// 管理游戏核心数值 - v3.2 热度重构版
// ==========================================
const State = {
    turn: 1,
    maxTurn: 48, // 48周 = 1年
    cp: "AB",
    rival: "BA",
    identity: { prefix: null, role: null },

    // 【v3.2】核心属性 - 热度改为大数值
    stats: {
        san: 80,        // 精神值
        passion: 80,    // 热情
        stamina: 100,   // 体力
        money: 1000,    // 金钱
        social: 40,     // 社交
        tech: 10,       // 技术
        combat: 0,      // 战斗力
        love: 40,       // 厨力
        myHeat: 0,      // 个人热度（0-1亿）
        cpHeat: 15000   // CP热度（0-1亿）
    },

    progress: { works: 0 },
    flags: { toxic: false, goddess: false },
    history: [],

    // 连续事件状态
    chain: {
        active: false,
        id: null,
        step: null,
        data: null
    },

    // 属性倾向 (雷达图用)
    alignment: {
        gong: 50,
        ma: 50,
        ttk: 50,
        mmr: 50,
        toxic: 50,
        purity: 50,
        omnivory: 50
    },

    // 【新增】成就记录
    achievements: [],

    // 【新增】新闻历史
    newsHistory: [],

    // 【v3.0】行动统计
    actionCounts: {
        work: 0,
        create: 0,
        consume: 0,
        social: 0,
        rest: 0
    },

    // 【v3.2】当前回合执行的行动（用于条件扣除）
    currentTurnActions: [],

    // 【v3.0】消费追踪（用于氪金鲸鱼成就）
    totalSpent: 0,

    // 【v3.1】App内容缓存（每月更新一次）
    appContentCache: {},      // { appId: { month: X, content: [...] } }
    appLastViewed: {},        // { appId: lastViewedMonth }
    appHasNewContent: {},     // { appId: true/false } 小红点状态

    // 获取当前游戏月份 (每4回合=1个月)
    getCurrentMonth() {
        return Math.ceil(this.turn / 4);
    },

    // 【v3.0】关键时刻记录（用于人生总结）
    keyMoments: [],

    // 【v3.0】初始CP热度（用于圈子缔造者结局）
    initialCpHeat: 15000,

    // 【v3.0】最低SAN值记录（用于浴火重生成就）
    minSan: 80,

    // 【v3.2】获取热度等级名称
    getHeatLevelName(heat) {
        if (heat >= 50000000) return '烫圈';
        if (heat >= 10000000) return '热';
        if (heat >= 1000000) return '温热';
        if (heat >= 100000) return '温';
        if (heat >= 10000) return '温冷';
        if (heat >= 1000) return '冷圈';
        return '北极圈';
    },

    // 【v3.2】格式化热度显示
    formatHeat(heat) {
        if (heat >= 100000000) return (heat / 100000000).toFixed(1) + '亿';
        if (heat >= 10000) return (heat / 10000).toFixed(1) + 'w';
        if (heat >= 1000) return (heat / 1000).toFixed(1) + 'k';
        return heat.toString();
    },

    // 状态修改器
    modify(effects) {
        let changes = [];
        for (let key in effects) {
            if (key === 'works') {
                this.progress.works += effects[key];
                changes.push({ key: 'works', delta: effects[key] });
            } else if (key === 'toxic' || key === 'goddess') {
                this.flags[key] = effects[key];
            } else if (this.stats.hasOwnProperty(key)) {
                this.stats[key] += effects[key];
                changes.push({ key, delta: effects[key] });

                // 边界限制
                if (key === 'stamina') {
                    if (this.stats[key] > 100) this.stats[key] = 100;
                    if (this.stats[key] < 0) this.stats[key] = 0;
                }
                if (key === 'san') {
                    if (this.stats[key] > 100) this.stats[key] = 100;
                    // 【v3.0】追踪最低SAN值
                    if (this.stats[key] < this.minSan) {
                        this.minSan = this.stats[key];
                    }
                    // 浴火重生成就条件
                    if (this.stats[key] < 20) {
                        this.flags.phoenixEligible = true;
                    }
                }
                if (key === 'passion') {
                    if (this.stats[key] > 120) this.stats[key] = 120;
                }
                if (key === 'love') {
                    if (this.stats[key] > 100) this.stats[key] = 100;
                }
                // 【v3.2】热度下限
                if (key === 'cpHeat' || key === 'myHeat') {
                    if (this.stats[key] < 0) this.stats[key] = 0;
                }
                // 【v3.0】追踪消费
                if (key === 'money' && effects[key] < 0) {
                    this.totalSpent += Math.abs(effects[key]);
                }
            }
        }
        return changes;
    },

    // 【v3.0】记录关键时刻
    addKeyMoment(title, content = '', type = 'neutral') {
        this.keyMoments.push({
            turn: this.turn,
            title: title,
            content: content,
            type: type // 'positive', 'negative', 'neutral'
        });
        // 最多保留10个关键时刻
        if (this.keyMoments.length > 10) {
            this.keyMoments.shift();
        }
    },

    // 【v3.0】修改属性倾向
    modifyAlignment(changes) {
        if (!changes) return;
        for (let key in changes) {
            if (this.alignment.hasOwnProperty(key)) {
                this.alignment[key] += changes[key];
                // 边界限制 0-100
                if (this.alignment[key] < 0) this.alignment[key] = 0;
                if (this.alignment[key] > 100) this.alignment[key] = 100;
            }
        }
    },

    // 【新增】重置状态（用于新游戏）
    reset() {
        this.turn = 1;
        this.cp = "AB";
        this.rival = "BA";
        this.identity = { prefix: null, role: null };

        // 【v3.2】随机初始化CP热度到一个等级（新量级：0-1亿）
        const heatLevels = [
            { name: '北极圈', min: 0, max: 1000, weight: 15 },
            { name: '冷圈', min: 1000, max: 10000, weight: 30 },
            { name: '温冷', min: 10000, max: 100000, weight: 25 },
            { name: '温', min: 100000, max: 1000000, weight: 15 },
            { name: '温热', min: 1000000, max: 10000000, weight: 10 },
            { name: '热', min: 10000000, max: 50000000, weight: 4 },
            { name: '烫圈', min: 50000000, max: 100000000, weight: 1 }
        ];

        // 按权重随机选择等级
        const totalWeight = heatLevels.reduce((sum, l) => sum + l.weight, 0);
        let rand = Math.random() * totalWeight;
        let selectedLevel = heatLevels[0];
        for (const level of heatLevels) {
            rand -= level.weight;
            if (rand <= 0) {
                selectedLevel = level;
                break;
            }
        }

        // 在该等级范围内随机一个具体数值
        const randomHeat = Math.floor(Math.random() * (selectedLevel.max - selectedLevel.min + 1)) + selectedLevel.min;

        this.stats = {
            san: 80,
            passion: 80,
            stamina: 100,
            money: 1000,
            social: 40,
            tech: 10,
            combat: 0,
            love: 40,
            myHeat: 0,
            cpHeat: randomHeat
        };
        this.progress = { works: 0 };
        this.flags = { toxic: false, goddess: false, phoenixEligible: false };
        this.history = [];
        this.chain = { active: false, id: null, step: null, data: null };
        this.alignment = { gong: 50, ma: 50, ttk: 50, mmr: 50, toxic: 50, purity: 50, omnivory: 50 };
        this.achievements = [];
        this.newsHistory = [];
        this.actionCounts = { work: 0, create: 0, consume: 0, social: 0, rest: 0 };
        this.currentTurnActions = [];
        this.totalSpent = 0;
        this.keyMoments = [];
        this.initialCpHeat = randomHeat;
        this.minSan = 80;

        // 【v3.1】App缓存重置
        this.appContentCache = {};
        this.appLastViewed = {};
        this.appHasNewContent = {};

        console.log(`[初始化] CP热度等级: ${selectedLevel.name}, 数值: ${this.formatHeat(randomHeat)}`);
    }
};


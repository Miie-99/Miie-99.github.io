// ==========================================
// MODULE: STATE (js/state.js)
// 管理游戏核心数值 - v2.0
// ==========================================
const State = {
    turn: 1,
    maxTurn: 48, // 48周 = 1年
    cp: "AB",
    rival: "BA",
    identity: { prefix: null, role: null },

    // 【v2.0】核心属性 - 调整初始值
    stats: {
        san: 80,        // 精神值 (从100降到80，增加压力感)
        passion: 80,    // 热情 (从100降到80)
        stamina: 100,   // 体力
        money: 1000,    // 金钱
        social: 40,     // 社交 (从50降到40)
        tech: 10,       // 技术
        combat: 0,      // 战斗力
        love: 40,       // 厨力 (从50降到40)
        myHeat: 0,      // 个人热度
        cpHeat: 15      // CP热度 (从10提高到15)
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

    // 【v3.0】消费追踪（用于氪金鲸鱼成就）
    totalSpent: 0,

    // 【v3.0】关键时刻记录（用于人生总结）
    keyMoments: [],

    // 【v3.0】初始CP热度（用于圈子缔造者结局）
    initialCpHeat: 15,

    // 【v3.0】最低SAN值记录（用于浴火重生成就）
    minSan: 80,

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
            cpHeat: 15
        };
        this.progress = { works: 0 };
        this.flags = { toxic: false, goddess: false, phoenixEligible: false };
        this.history = [];
        this.chain = { active: false, id: null, step: null, data: null };
        this.alignment = { gong: 50, ma: 50, ttk: 50, mmr: 50, toxic: 50, purity: 50, omnivory: 50 };
        this.achievements = [];
        this.newsHistory = [];
        this.actionCounts = { work: 0, create: 0, consume: 0, social: 0, rest: 0 };
        this.totalSpent = 0;
        this.keyMoments = [];
        this.initialCpHeat = 15;
        this.minSan = 80;
    }
};

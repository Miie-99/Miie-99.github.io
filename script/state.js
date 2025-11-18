        // ==========================================
        // MODULE: STATE (js/state.js)
        // 管理游戏核心数值
        // ==========================================
        const State = {
            turn: 1,
            maxTurn: 48, // 48周 = 1年
            cp: "AB",
            rival: "BA",
            identity: { prefix: null, role: null },
            // 核心七维属性
            stats: {
                san: 100,      // 精神 (理智) -> 0 结局: 发疯
                passion: 100,  // 热情 (爱)   -> 0 结局: 退坑
                stamina: 100,  // 体力       -> 消耗品
                money: 1000,   // 金钱       -> 0 结局: 破产
                social: 50,    // 现充       -> 影响特殊事件
                tech: 10,      // 技术       -> 影响产出品质
                love: 50,      // 厨力       -> 结局评分
                myHeat: 0,     // 个人热度    -> 结局评分
                cpHeat: 10     // 圈子热度    -> 环境变量
            },
            progress: { works: 0 },
            flags: { toxic: false, goddess: false },
            history: [],

            // 状态修改器
            modify(effects) {
                let changes = [];
                for (let key in effects) {
                    if (key === 'works') {
                        this.progress.works += effects[key];
                    } else if (key === 'toxic' || key === 'goddess') {
                        this.flags[key] = effects[key];
                    } else if (this.stats.hasOwnProperty(key)) {
                        this.stats[key] += effects[key];
                        // 边界限制
                        if (key === 'stamina' && this.stats[key] > 100) this.stats[key] = 100;
                        if (key === 'san' && this.stats[key] > 100) this.stats[key] = 100;
                    }
                }
                return changes;
            }
        };

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
                combat: 0,     // 战斗/斗争欲（用于社交事件、争论等）
                love: 50,      // 厨力       -> 结局评分
                myHeat: 0,     // 个人热度    -> 结局评分
                cpHeat: 10     // 圈子热度    -> 环境变量
            },
            progress: { works: 0 },
            flags: { toxic: false, goddess: false },
            history: [],
            // 连续事件状态：当 active=true 时底部常规行动被禁用
            chain: {
                active: false,
                id: null,
                step: null,
                data: null
            },

            // 属性倾向 (用于雷达图)：范围 0-100，50 为中立
            alignment: {
                gong: 50,   // "公" 倾向
                ma: 50,     // "嬷" 倾向
                ttk: 50,    // ttk 风格
                mmr: 50,    // mmr 风格
                toxic: 50,  // 毒唯倾向
                purity: 50, // 洁癖
                omnivory: 50 // 杂食/杂食性
            },

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

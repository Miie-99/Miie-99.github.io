        // ==========================================
        // MODULE: DATA (js/data.js)
        // 定义所有静态数据：身份、事件池
        // ==========================================
        const DATA = {
            prefixes: [
                { txt: "下楼梯骨折的", buff: { social: -20 }, desc: "出门困难，强制宅家" },
                { txt: "家里有矿的", buff: { money: 5000 }, desc: "钞能力者，开局资金充足" },
                { txt: "玻璃心的", buff: { san: -20, passion: 20 }, desc: "容易破防，但爱得深沉" },
                { txt: "手速惊人的", buff: { tech: 20 }, desc: "产粮效率极高" },
                { txt: "住在X站的", buff: { passion: 30 }, desc: "阅片无数，审美极高" }
                { txt: "社恐严重的", buff: { passion: -20 }, desc: "阅片无数，审美极高" }
            ],
            roles: [
                { txt: "社畜", base: { money: 3000, time: 2 } }, // time代表每回合行动力消耗倍率(未实装，简化为体力)
                { txt: "学生", base: { money: 500, time: 4 } },
                { txt: "家里蹲", base: { money: 100, time: 6 } },
                { txt: "农村入", base: { money: 100, time: 6 } },
                { txt: "私人", base: { money: 0, time: 6 } },
                { txt: "猫奴", base: { money: 1800, time: 5 } },
                { txt: "自由职业", base: { money: 1500, time: 5 } }
            ],
            // --- 核心：分离的事件池 ---
            events: {
                // 1. 打工/现充事件池
                work: [
                    { title: "加班地狱", text: "老板让你连夜改PPT，你错过了晚上的CP群语音。", effect: { money: 800, san: -10, passion: -5 } },
                    { title: "掉马危机", text: "同事看到了你的屏保，问：'这是同性恋漫画吗？' 你吓出一身冷汗。", effect: { san: -15, social: -5 } },
                    { title: "发奖金了", text: "项目结款！你立刻把钱换成了谷子（周边）。", effect: { money: 2000, love: 10 } },
                    { title: "遇到同好", text: "新来的实习生居然也是{cp}姐！世界真小。", effect: { social: 15, san: 10, passion: 10 } }
                ],
                // 2. 产粮/创作事件池
                create: [
                    { title: "手感火热", text: "文思泉涌，下笔如有神，这篇绝对是神作！", effect: { tech: 15, myHeat: 20, works: 0.5 } },
                    { title: "遭遇瓶颈", text: "卡文了，坐在电脑前三个小时只写了三百字。", effect: { san: -10, stamina: -20, works: 0.1 } },
                    { title: "忘记保存", text: "软件崩溃了...你的心也碎了。", effect: { san: -30, passion: -10 } },
                    { title: "被大V转了", text: "你的产出被圈内大手转发，通知栏炸了！", effect: { myHeat: 50, passion: 20, love: 5 } }
                ],
                // 3. 嗑糖/消费事件池
                consume: [
                    { title: "神仙太太", text: "在AO3读到一篇绝世好文，哭得稀里哗啦。", effect: { love: 20, passion: 10, san: 10 } },
                    { title: "OOC警告", text: "不仅逆了你的CP，还把你推写成了恋爱脑。我想吐。", effect: { san: -20, passion: -5 } },
                    { title: "官方发糖", text: "最新一集动画里他们牵手了（并没有，是你显微镜看错了）。", effect: { love: 15, san: 5 } },
                    { title: "由于版权原因", text: "你收藏的几十个本子链接全部失效了。", effect: { san: -15, passion: -10 } }
                ],
                // 4. 社交/扩列事件池
                social: [
                    { title: "由于太现充", text: "群里在聊CP，你在聊今晚吃什么，被冷落了。", effect: { social: 10, myHeat: -5 } },
                    { title: "小团体撕逼", text: "群主和管理吵起来了，你被要求站队。", effect: { san: -20, social: -10 } },
                    { title: "扩列成功", text: "在微博勾搭到了一个同城同好，相谈甚欢。", effect: { social: 15, passion: 10 } },
                    { title: "挂人贴", text: "你在广场吐槽了一句，被对家截图挂了。", effect: { myHeat: 30, san: -30, toxic: true } }
                ],
                // 5. 休息/退网事件池
                rest: [
                    { title: "深度睡眠", text: "梦里什么都有，梦里你的CP结婚了。", effect: { stamina: 40, san: 20 } },
                    { title: "断网保平安", text: "不看SNS的一天，世界如此美好。", effect: { san: 15, passion: -5 } },
                    { title: "生病了", text: "熬夜太多抵抗力下降，不得不去医院。", effect: { money: -200, stamina: 20 } }
                ]
            },
            // --- 触发器：属性判定特殊事件 ---
            triggers: [
                { 
                    condition: (s) => s.san < 20, 
                    event: { title: "发疯文学", text: "你的精神状态已岌岌可危，在微博连发50条乱码，吓跑了粉丝。", effect: { myHeat: -20, social: -10 } } 
                },
                { 
                    condition: (s) => s.money < 100, 
                    event: { title: "吃土警告", text: "余额不足，你不得不卖掉一部分吧唧回血。", effect: { money: 500, love: -10 } } 
                },
                { 
                    condition: (s) => s.myHeat > 200 && !s.goddess, 
                    event: { title: "加冕时刻", text: "你的粉丝数突破了临界点，现在你说话就是圈内风向标。", effect: { goddess: true, passion: 50 } } 
                }
            ]
        };

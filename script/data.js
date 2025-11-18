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
                { txt: "住在X站的", buff: { passion: 30 }, desc: "阅片无数，审美极高" },
                { txt: "社恐严重的", buff: { passion: -20 }, desc: "社交场合容易紧张" }
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
                    ,
                    { title: "社死瞬间", text: "开会投屏忘关浏览器，全公司都看到了你写的《强制爱》大纲，HR建议你注意心理健康。", effect: { social: -20, san: -20, money: 200 } },
                    { title: "虚伪的现充", text: "同事问你周末去哪浪，你笑着说在家躺平，其实坐了5小时高铁去漫展只为给摊主塞一封信。", effect: { money: -500, passion: 30, social: 5 } },
                    { title: "隐藏款掉落", text: "新来的实习生工位上摆着你CP的绝版吧唧，你试探了一句‘你也吃这对？’，她说是代购送的。", effect: { san: -10, social: 10 } },
                    { title: "加班发疯", text: "凌晨三点还在改PPT，刷到对家太太还在激情产粮。你感叹：原来不用上班的人才配搞同人。", effect: { san: -15, money: 600, passion: -5 } },
                    { title: "发奖金了(大)", text: "季度奖金到账！你表面淡定存入理财，背地里其实把购物车里攒了半年的切页和谷子全清了。", effect: { money: -1000, love: 20, passion: 10 } },
                    { title: "团建噩梦", text: "公司团建去KTV，领导非要让你点歌。你点了一首CP角色的角色歌，全场寂静，没人听过。", effect: { social: -10, san: -5 } }
                ],
                // 2. 产粮/创作事件池
                create: [
                    { title: "手感火热", text: "文思泉涌，下笔如有神，这篇绝对是神作！", effect: { tech: 15, myHeat: 20, works: 0.5 } },
                    { title: "遭遇瓶颈", text: "卡文了，坐在电脑前三个小时只写了三百字。", effect: { san: -10, stamina: -20, works: 0.1 } },
                    { title: "忘记保存", text: "软件崩溃了...你的心也碎了。", effect: { san: -30, passion: -10 } },
                    { title: "被大V转了", text: "你的产出被圈内大手转发，通知栏炸了！", effect: { myHeat: 50, passion: 20, love: 5 } },
                    { title: "发到热评区", text: "你的片段被搬上热评区，几条真诚评论让你暖到心坎里。", effect: { myHeat: 15, passion: 10 } },
                    { title: "被误解为抄袭", text: "有人质疑你的素材来源，留言里有指责也有质疑。", effect: { san: -15, myHeat: -5 } },
                    { title: "合作邀约", text: "一位圈内作者私信邀你合作，你的作品可能迎来联动机会。", effect: { social: 10, tech: 5 } }
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
                    ,
                    { title: "无效扩列", text: "加了一个“只吃甜饼不吃刀”的互暖群，结果群主半夜发了几千字的BE虐文，还说这是糖。", effect: { san: -15, social: 5 } },
                    { title: "赛博背刺", text: "和你聊得最好的亲友突然退群了，私聊才发现她们拉了一个没有你的新群，正在吐槽你的文风太古早。", effect: { san: -50, myHeat: 10, toxic: true } },
                    { title: "海鲜市场", text: "试图在海鲜市场收物扩列，结果卖家是你的前圈对家，她认出了你的ID并在朋友圈挂了你的地址。", effect: { san: -30, money: -200, social: -20 } },
                    { title: "Ky出没", text: "你在超话发了张图，有人评论‘好可爱但是OOC了’，你点开他主页一看，全是泥塑梦女向。", effect: { san: -10, combat: 10 } },
                    { title: "双向取关", text: "互关的大手突然双取了你，你慌得把最近三百条微博都翻了一遍，最后发现是因为你转发了对家的抽奖。", effect: { myHeat: -10, passion: -10, san: -5 } },
                    { title: "百度贴吧", text: "你在搜索{cp}的粮，误入了一个2015年的古早贴吧，发现当年的大手子们现在都在互骂，令人唏嘘。", effect: { passion: -5, san: -5 } },
                    { title: "站队风波", text: "圈内AB两位大触吵架，你在群里发了个“吃瓜”表情包，被两边的人同时拉黑了。", effect: { social: -30, myHeat: 5 } }
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

// === 连续事件（Chain Events）定义：用于实现多步/分支剧情 ===
const CHAINS = {
    // 鉴AI对赌事件链
    "ai_accuse": {
        title: "鉴AI风波",
        startText: "你刚发新图，评论区忽然涌入大量质疑声：有人断言这是AI合成，你感觉被盯上了。",
        options: [
            { text: "直播拿出原画/录屏反驳", next: "prove_it" },
            { text: "清者自清，不理会", next: "ignore_it" }
        ],
        steps: {
            prove_it: {
                duration: 1,
                text: "你开直播逐帧展示PSD图层与作画录屏，耐心解释每一处笔触与调整，观众开始转变态度。",
                effect: { stamina: -20, san: -10 },
                next: "prove_success"
            },
            prove_success: {
                duration: 0,
                text: "真相大白，质疑声消散。你的技术被更多人认可，私信里开始涌入鼓励与问合作。",
                effect: { myHeat: 50, tech: 5, passion: 10, toxic: false },
                isEnd: true
            },
            ignore_it: {
                duration: 1,
                text: "选择沉默，但谣言在角落蔓延，部分粉丝开始疑虑并私下议论你的作画来源。",
                effect: { san: -20 },
                next: "ignore_bad"
            },
            ignore_bad: {
                duration: 0,
                text: "风波渐息，但转发和好评减少，你的热度与信心都受到了明显打击。",
                effect: { myHeat: -30, passion: -15 },
                isEnd: true
            }
        }
    },

    // 接力企划事件链
    "collab_project": {
        title: "同人接力企划",
        onStart: (state) => state.stats.myHeat > 200 ? "role_host" : "role_guest",
        steps: {
            role_host: { duration: 0, text: "作为圈内大手，你被推为企划主催，承担招募、排期与氛围维护的重任。", next: "host_working" },
            host_working: {
                duration: 1,
                randomContent: [
                    { text: "你在群里催稿，几个成员突然失联，通知一片沉默，你焦虑又心疼。", effect: { san: -10 } },
                    { text: "群里气氛火热，一位画手发了神作，你既开心又感到巨大压力。", effect: { tech: 3, san: -5 } },
                    { text: "排版时发现素材有版权疑虑，你紧张地联系作者确认来历，心里悬着。", effect: { san: -8 } }
                ],
                next: "host_publish"
            },
            host_publish: {
                duration: 1,
                text: "宣发日前夜，你连夜排版、修色并写长文介绍，最终在主贴准时发布。",
                effect: { stamina: -30 },
                next: (state) => state.stats.tech > 50 ? "end_success" : "end_flop"
            },

            role_guest: { duration: 0, text: "你报名参加了接力企划，分到自己最喜欢的那一段梗，既激动又紧张。", next: "guest_working" },
            guest_working: {
                duration: 1,
                randomContent: [
                    { text: "你发了草稿到群里，主催夸你画得细腻，瞬间被夸成天使。", effect: { passion: 10, social: 5 } },
                    { text: "DDL临近，你在深夜赶稿，咖啡和方便面相伴，手痛但不敢停。", effect: { stamina: -20, tech: 2 } },
                    { text: "有人在群里发了高质量参考图，你自觉水平不足，心生自卑但也更想努力。", effect: { san: -5, tech: 1 } }
                ],
                next: "guest_publish"
            },
            guest_publish: {
                duration: 1,
                text: "企划发布时，你在长图里看到了自己的名字，心里既满足又忐忑。",
                next: (state) => {
                    const r = Math.random();
                    if (r > 0.8) return "end_success";
                    if (r < 0.2) return "end_drama";
                    return "end_normal";
                }
            },

            end_success: { duration: 0, text: "企划大获成功！你的作品被很多人转发，关注与私信接连而来。", effect: { myHeat: 40, social: 10, love: 10 }, isEnd: true },
            end_flop: { duration: 0, text: "宣发后反响平平，评论里只有几句客套话，你感到失落但继续努力。", effect: { passion: -10, myHeat: 5 }, isEnd: true },
            end_drama: { duration: 0, text: "企划被曝出争议或AI痕迹，整个活动被推上风口，你遭遇大量指责与嘲讽。", effect: { san: -20, myHeat: -10, toxic: true }, isEnd: true },
            end_normal: { duration: 0, text: "企划平稳收场，大家互相夸夸作品，你悄悄把这次经验记在心里。", effect: { passion: -5 }, isEnd: true }
        }
    }
};

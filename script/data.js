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
        { txt: "社畜", base: { money: 3000, time: 2 } },
        { txt: "学生", base: { money: 500, time: 4 } },
        { txt: "家里蹲", base: { money: 100, time: 6 } },
        { txt: "富二代", base: { money: 8000, time: 6 } },
        { txt: "猫奴", base: { money: 1800, time: 5 } },
        { txt: "自由职业", base: { money: 1500, time: 5 } }
    ],
    
    // --- 核心：事件池 ---
    events: {
        // 1. 打工/现充事件池
        work: [
            { title: "加班地狱", text: "老板让你连夜改PPT，你错过了晚上的CP群语音。", effect: { money: 800, san: -10, passion: -5 } },
            { title: "掉马危机", text: "同事看到了你的屏保，问：'这是同性恋漫画吗？' 你吓出一身冷汗。", effect: { san: -15, social: -5 } },
            { title: "发奖金了", text: "项目结款！你立刻把钱换成了谷子（周边）。", effect: { money: 2000, love: 10 } },
            { title: "遇到同好", text: "新来的实习生居然也是{cp}姐！世界真小。", effect: { social: 15, san: 10, passion: 10 } },
            { title: "社死瞬间", text: "开会投屏忘关浏览器，全公司都看到了你写的《强制爱》大纲，HR建议你注意心理健康。", effect: { social: -20, san: -20, money: 200 } },
            { title: "虚伪的现充", text: "同事问你周末去哪浪，你笑着说在家躺平，其实坐了5小时高铁去漫展只为给摊主塞一封信。", effect: { money: -500, passion: 30, social: 5 } },
            { title: "加班发疯", text: "凌晨三点还在改PPT，刷到对家太太还在激情产粮。你感叹：原来不用上班的人才配搞同人。", effect: { san: -15, money: 600, passion: -5 } },
            { title: "团建噩梦", text: "公司团建去KTV，领导非要让你点歌。你点了一首CP角色的角色歌，全场寂静，没人听过。", effect: { social: -10, san: -5 } },
            // 新增
            { title: "带薪搞黄", text: "趁着老板出差，你在工位上偷偷用手机写了一段两千字的豪车，这种背德感让你文思泉涌，效率极高。", effect: { money: 200, passion: 20, stamina: -5 } },
            { title: "快递社死", text: "公司的前台帮你签收了快递，大声喊道：'谁的XX本子？' 包装盒上大大的R18标识让你想当场离职。", effect: { social: -30, san: -30 } },
            { title: "现充的误解", text: "同事看你在画画，凑过来说：'这俩男/女的也是兄弟/闺蜜情吗？' 你露出尴尬又不失礼貌的微笑：'是啊，社会主义友情。'", effect: { social: -5, san: -10 } },
            { title: "为了谷子", text: "为了买那个溢价三倍的场贩限定吧唧，你主动申请了周末加班。老板夸你上进，你只想让他闭嘴给钱。", effect: { money: 600, san: -15, love: 5 } }
        ],
        
        // 2. 产粮/创作事件池
        create: [
            { title: "手感火热", text: "文思泉涌，下笔如有神，这篇绝对是神作！", effect: { tech: 15, myHeat: 20, works: 0.5 } },
            { title: "遭遇瓶颈", text: "卡文了，坐在电脑前三个小时只写了三百字。", effect: { san: -10, stamina: -20, works: 0.1 } },
            { title: "忘记保存", text: "软件崩溃了...你的心也碎了。", effect: { san: -30, passion: -10 } },
            { title: "被大V转了", text: "你的产出被圈内大手转发，通知栏炸了！", effect: { myHeat: 50, passion: 20, love: 5 } },
            { title: "查资料黑洞", text: "本想写个考据向正剧，结果查阅资料查了整整一通宵，正文一个字没动。", effect: { tech: 20, stamina: -20, works: 0 } },
            { title: "冷圈自萌", text: "这真的太冷了，全网只有你在产粮。你既是作者又是读者，自己割大腿肉喂自己，含泪吃下。", effect: { san: -10, passion: 30, myHeat: 5 } },
            // 新增：梗与百合
            { title: "经典永流传", text: "试图搞点新花样，但最后还是忍不住写了最经典的ABO设定，信息素交融的描写让你自己都脸红心跳。", effect: { tech: 10, passion: 15, works: 0.5 } },
            { title: "战损美学", text: "画了一张{cp}的战损图，特意细化了伤口和血迹的质感，这种破碎感和张力让首页的同好们集体发疯。", effect: { tech: 15, myHeat: 25, works: 1 } },
            { title: "清水也是肉", text: "虽然全程连手都没牵，但你通过眼神拉丝和暧昧的指尖接触，写出了比R18还要色气的张力，评论区一片狼嚎。", effect: { tech: 20, myHeat: 15, works: 0.5 } },
            { title: "甚至过度", text: "画人体练习时逐渐走偏，最后变成了一张尺度惊人的{cp}车图。你犹豫再三，打满厚码发到了小号上。", effect: { passion: 20, san: -5, myHeat: 30 } },
            { title: "先婚后爱", text: "写了一个土得掉渣的‘先婚后爱’带球跑剧本，虽然剧情狗血，但这种古早味的酸爽感让数据出奇的好。", effect: { myHeat: 40, social: 10, works: 0.5 } },
            { title: "互攻万岁", text: "写腻了单向攻受，你尝试写了一篇互攻（里板）。两人在床上争夺主导权，从床头打架到床尾，这种势均力敌的性张力太香了。", effect: { tech: 15, myHeat: 20, works: 0.5 } },
            { title: "百合车文", text: "深夜灵感爆发，写了一篇关于'手指'和'湿润'的R18G。虽然没有真的器官描写，但那种湿漉漉的氛围感让你自己写完都脸红。", effect: { passion: 25, san: -5, works: 0.5 } },
            { title: "日常甜饼", text: "不想搞虐的，写了个同居三十题。比如'帮对方吹头发'、'穿对方的衬衫'。这种平淡的幸福感让读者在评论区直呼想结婚。", effect: { san: 10, myHeat: 15, works: 0.5 } },
            { title: "校园考据", text: "为了写好校园文，你专门查了日本女子高中的课程表和制服构造。写出来的'在更衣室互相整理领结'的情节细节满满，被夸严谨。", effect: { tech: 15, stamina: -10, works: 0.5 } },
            { title: "百合构图", text: "尝试画了经典的'磨豆腐'构图（虽然会被屏蔽），两人肢体交缠，大腿和小腿的线条交错，你画腿画得欲罢不能。", effect: { tech: 20, passion: 20, works: 1 } },
            { title: "光影练习", text: "画了一张夕阳下的接吻剪影。重点刻画了两人发丝纠缠的细节，这种朦胧的唯美感比直接画脸更有意境。", effect: { tech: 15, myHeat: 15, works: 1 } },
            { title: "表情差分", text: "画了一组表情包：A在狂笑，B在翻白眼；A在撒娇，B在脸红。这组图迅速在群里传开了，大家都在用。", effect: { social: 15, myHeat: 20, works: 1 } }
        ],

        // 3. 嗑糖/消费事件池
        consume: [
            { title: "神仙太太", text: "在AO3读到一篇绝世好文，哭得稀里哗啦。", effect: { love: 20, passion: 10, san: 10 } },
            { title: "OOC警告", text: "不仅逆了你的CP，还把你推写成了恋爱脑。我想吐。", effect: { san: -20, passion: -5 } },
            { title: "官方发糖", text: "最新一集动画里他们牵手了（并没有，是你显微镜看错了）。", effect: { love: 15, san: 5 } },
            { title: "海鲜市场", text: "在闲鱼高价收到了梦情谷子！收到货打开一看，快递暴力运输，那个绝美镭射票折角了，你的心也折了。", effect: { money: -300, san: -20, love: 5 } },
            { title: "对家骑脸", text: "刷推特看到对家大手发了张神图，虽然很不想承认，但那张图的光影和构图真的该死的好看。", effect: { san: -10, tech: 5, passion: -5 } },
            { title: "塌房预警", text: "你的坑被爆出丑闻。你看着满屋子的周边陷入沉思：是现在出二手止损，还是装死继续爱？", effect: { san: -50, money: 0, love: -50 } },
            // 新增：百合/梗
            { title: "绝美切页", text: "高价收到了几年前的绝版杂志切页，看着图上两个人哪怕站在画面边缘也在对视，你确信他们是真的。", effect: { love: 25, money: -100, san: 10 } },
            { title: "广播剧糖", text: "官方广播剧的边角料里，{cp}互相调侃了一句‘笨蛋’。你戴着耳机反复听了五十遍，嘴角根本压不下来。", effect: { love: 20, passion: 15, san: 5 } },
            { title: "痛包出街", text: "耗时三天扎了一个超完美的痛包，带去漫展被集邮了无数次，痛层里的他们闪闪发光，你是全场最靓的崽。", effect: { love: 20, social: 15, money: -200 } },
            { title: "手办灰模", text: "官方终于公布了{cp}的手办企划！虽然还在监修中，但你看那个底座的设计，分明就是要把他们摆在一起卖！", effect: { love: 15, passion: 10, money: 0 } },
            { title: "视觉污染", text: "首页误刷到一张{rival}的高热度神图，虽然画技无可挑剔，但看到那两个人的脸凑在一起，你的生理性厌恶达到顶峰。", effect: { san: -25, passion: -10 } },
            { title: "泥塑地狱", text: "搜索{cp}的tag，结果全是把你的攻变成娇弱受的泥塑文学，甚至还有生子情节。你气得手抖，立刻写了避雷指南。", effect: { san: -30, combat: 10 } },
            { title: "官方背刺", text: "官方新活动剧情里，你推居然和对家角色的互动比和你CP还多！{rival}家在狂欢，你眼前一黑，感觉天塌了。", effect: { san: -50, love: -20, passion: -20 } },
            { title: "ABO反差萌", text: "刷到一篇ABO文，平日雷厉风行的御姐Alpha易感期发作，把头埋在软妹Omega颈窝里红着眼眶求'再给一点信息素'，这种反差让你当场昏迷。", effect: { love: 25, passion: 15, san: 10 } },
            { title: "死对头文学", text: "看了一篇死对头变情人，两人在暴雨夜的教室里吵架，吵着吵着突然不管不顾地接吻，那句'我讨厌你'被吞没在唇齿间，张力拉满。", effect: { love: 20, san: 5, passion: 10 } },
            { title: "指尖温存", text: "这篇清水文写得太好了，没有大尺度的描写，只写A帮B吹头发时手指穿过发丝触碰头皮的酥麻感，你却看得脸红心跳。", effect: { love: 15, passion: 20, san: 5 } },
            { title: "病娇囚禁", text: "点开一篇Dark向文，平日温柔的学姐笑着给学妹带上项圈：'这样你就哪也去不了了哦'。虽然三观炸裂，但你诚实地收藏了。", effect: { san: -10, passion: 25, love: 10 } },
            { title: "修仙互补", text: "合欢宗妖女x正道大师姐。妖女为了乱师姐道心故意撩拨，结果被师姐按在榻上哑声说'既然要乱，就乱到底'，你直呼好攻！", effect: { love: 30, passion: 10, san: 5 } },
            { title: "哨向神交", text: "这篇哨向文绝了，精神体是雪豹和垂耳兔。兔子在精神图景里把雪豹蹬了一脚，现实中两人的互动也是这种又凶又宠的调调。", effect: { love: 20, passion: 15 } },
            { title: "破镜重圆", text: "分手五年后在同学会重逢，她在桌下偷偷勾住了她的脚踝，面上却还在和别人谈笑风生。这隐秘的背德感让你头皮发麻。", effect: { love: 25, san: -5, passion: 20 } },
            { title: "体格差神图", text: "刷到一张神图，身材高大的骑士单手抱起娇小的公主，公主的双腿紧紧盘在骑士腰间，这个体型差和肤色差让你瞬间嘶哈。", effect: { love: 30, passion: 20 } },
            { title: "浴室湿身", text: "首页飘过一张浴室图，水蒸气缭绕中，她隔着湿透的白衬衫帮她扣扣子，眼神却盯着锁骨上的咬痕。这光影简直是艺术品！", effect: { love: 25, passion: 25, san: 5 } },
            { title: "手书大作", text: "B站刷到一个播放量百万的手书《Magnet》，画面切到两人手指十指相扣、蝴蝶耳机纠缠的瞬间，配合那个旋律，你泪目了。", effect: { love: 35, passion: 20 } },
            { title: "Cosplay", text: "看到一组漫展场照，两个Coser还原了原作里的经典壁咚名场面，那个眼神拉丝简直和原著一模一样，评论区都在按头。", effect: { social: 10, love: 20 } }
        ],

        // 4. 社交/扩列事件池
        social: [
            { title: "由于太现充", text: "群里在聊CP，你在聊今晚吃什么，被冷落了。", effect: { social: 10, myHeat: -5 } },
            { title: "小团体撕逼", text: "群主和管理吵起来了，你被要求站队。", effect: { san: -20, social: -10 } },
            { title: "扩列成功", text: "在微博勾搭到了一个同城同好，相谈甚欢。", effect: { social: 15, passion: 10 } },
            { title: "挂人贴", text: "你在广场吐槽了一句，被对家截图挂了。", effect: { myHeat: 30, san: -30, toxic: true } },
            { title: "无效扩列", text: "加了一个“只吃甜饼不吃刀”的互暖群，结果群主半夜发了几千字的BE虐文，还说这是糖。", effect: { san: -15, social: 5 } },
            { title: "赛博背刺", text: "和你聊得最好的亲友突然退群了，私聊才发现她们拉了一个没有你的新群，正在吐槽你的文风太古早。", effect: { san: -50, myHeat: 10, toxic: true } },
            { title: "漫展无料", text: "为了漫展准备了50份免费物料（无料），结果遇到一群特别有礼貌的小粉丝，听着她们喊‘妈咪’，你心里暖暖的。", effect: { social: 20, passion: 15, money: -100 } },
            { title: "连麦修罗场", text: "深夜CP群语音，两个麦霸因为‘谁是上面的’争论了三个小时，你在旁边瑟瑟发抖，最后被迫当了裁判。", effect: { social: 10, san: -15 } },
            { title: "约稿翻车", text: "花大价钱约了圈内知名画手，结果对方拖稿两个月，最后交出来的图人体崩坏，还不如你自己画的草稿。", effect: { money: -500, san: -20, social: -5 } },
            { title: "匿名树洞", text: "有人在匿名墙投稿吐槽你的文风太矫情，评论区居然还有人附和。你一气之下把那个树洞号拉黑了。", effect: { san: -15, myHeat: 5, toxic: true } },
            { title: "百合只有", text: "去参加了百合Only漫展（全女性向），现场氛围好到爆炸，没有乱七八糟的视线，大家都在疯狂贴贴，你买本子买得停不下来。", effect: { social: 30, money: -500, passion: 20 } },
            { title: "鉴男专家", text: "群里混进了一个伪装百合男，发言油腻被你一眼识破。你带头把他挂了出来，群友纷纷称赞你火眼金睛，守护了这一方净土。", effect: { social: 15, combat: 20, san: 5 } },
            { title: "互推好文", text: "和一个同好互推粮单，结果发现彼此的XP惊人的一致！从ABO到Futa设定都能聊，你们相见恨晚，聊了个通宵。", effect: { social: 20, passion: 20, stamina: -20 } }
        ],

        // 5. 休息/退网事件池
        rest: [
            { title: "深度睡眠", text: "梦里什么都有，梦里你的CP结婚了。", effect: { stamina: 40, san: 20 } },
            { title: "断网保平安", text: "不看SNS的一天，世界如此美好。", effect: { san: 15, passion: -5 } },
            { title: "生病了", text: "熬夜太多抵抗力下降，不得不去医院。", effect: { money: -200, stamina: 20 } },
            { title: "电子阳痿", text: "突然对什么都提不起劲。不想看文，不想打游戏，不想刷推。只想躺在床上盯着天花板发呆。", effect: { stamina: 30, passion: -20, love: -10 } },
            { title: "腱鞘炎犯了", text: "长时间拿笔导致手腕剧痛，医生警告你必须休息。你看着未完成的稿子，含泪给读者发了请假条。", effect: { stamina: -10, san: -10, works: 0 } },
            { title: "岁月静好", text: "收拾了一下乱成猪窝的房间，把谷子整整齐齐摆进展示柜。看着痛柜，你觉得这破世界还是值得活的。", effect: { san: 30, stamina: -10, love: 20 } },
            { title: "现充体验", text: "强迫自己出门去公园走了两万步。没有网络信号，只有花草树木，你感觉自己体内的毒素被净化了。", effect: { stamina: 20, san: 15, passion: -10 } }
        ]
    },

    // --- 触发器：属性判定特殊事件 ---
    triggers: [
        // 1. 冷圈(北极圈) 触发器
        {
            condition: (s) => s.cpHeat < 5,
            event: { 
                title: "极地求生", 
                text: "你的CP实在是太冷了，冷到Tag里上一条微博还是你半个月前发的。你在超话里大喊一声，只有回音。", 
                effect: { passion: -10, san: -5, myHeat: -2 } 
            }
        },
        {
            condition: (s) => s.cpHeat < 15 && s.turn % 4 === 0, 
            event: { 
                title: "圈地自萌", 
                text: "虽然是个冷圈，但仅有的几个亲友都很温暖。大家抱团取暖，一点点粮渣都能嚼半天。", 
                effect: { san: 10, love: 5, social: 2 } 
            }
        },
        // 2. 大烫门(热门) 触发器
        {
            condition: (s) => s.cpHeat > 100 && Math.random() < 0.2,
            event: { 
                title: "烫门是非多", 
                text: "因为你的CP太火，广场上每天都在吵架。今天是因为攻受左右位，明天是因为OOC，你看着满屏的戾气，感到心累。", 
                effect: { san: -20, passion: -5 } 
            }
        },
        {
            condition: (s) => s.cpHeat > 80 && Math.random() < 0.2,
            event: { 
                title: "流量红利", 
                text: "因为CP正当红，你随手画的一个鱼摸居然有几千热度！大量的点赞提示音让你产生了一种这就是“大手”的错觉。", 
                effect: { myHeat: 50, passion: 10, tech: 2 } 
            }
        },
        // 3. 原有属性触发器
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

// === 连续事件（Chain Events）定义 ===
const CHAINS = {
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
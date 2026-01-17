// ==========================================
// MODULE: DATA (js/data.js)
// 定义所有静态数据：身份、事件池
// ==========================================
const DATA = {
    prefixes: [
        {
            txt: "下楼梯骨折的",
            buff: { social: -20 },
            desc: "出门困难，强制宅家",
            passive: {
                name: "宅家BUFF",
                desc: "休息恢复+50%，社交负面效果+30%",
                triggers: { actionTypes: ['rest', 'social'], sentiments: ['negative'] },
                modifiers: { rest_heal: 1.5, social_negative: 1.3 }
            }
        },
        {
            txt: "家里有矿的",
            buff: { money: 5000 },
            desc: "钞能力者，开局资金充足",
            passive: {
                name: "钞能力",
                desc: "金钱损失减半，购买20%几率免费",
                triggers: { contentTypes: ['money_loss', 'purchase'] },
                modifiers: { money_loss: 0.5, free_purchase_chance: 0.2 }
            }
        },
        {
            txt: "玻璃心的",
            buff: { san: -20, passion: 20 },
            desc: "容易破防，但爱得深沉",
            passive: {
                name: "共情体质",
                desc: "嗑糖收益+40%，负面事件SAN损失+50%",
                triggers: { actionTypes: ['consume'], sentiments: ['negative'] },
                modifiers: { consume_positive: 1.4, san_loss: 1.5 }
            }
        },
        {
            txt: "手速惊人的",
            buff: { tech: 20 },
            desc: "产粮效率极高",
            passive: {
                name: "高产似母猪",
                desc: "创作时30%几率额外+0.5作品进度",
                triggers: { contentTypes: ['creation'] },
                modifiers: { extra_works_chance: 0.3, extra_works: 0.5 }
            }
        },
        {
            txt: "住在X站的",
            buff: { passion: 30, love: 20 },
            desc: "阅片无数，审美极高",
            passive: {
                name: "阅片无数",
                desc: "consume正面效果+30%",
                triggers: { actionTypes: ['consume'], sentiments: ['positive'] },
                modifiers: { consume_positive: 1.3 }
            }
        },
        {
            txt: "社恐严重的",
            buff: { passion: -20 },
            desc: "社交场合容易紧张，但线上风生水起",
            passive: {
                name: "线上之神",
                desc: "个人热度获取+40%，社交正面效果-40%",
                triggers: { contentTypes: ['heat_gain'], actionTypes: ['social'] },
                modifiers: { heat_gain: 1.4, social_positive: 0.6 }
            }
        }
    ],
    roles: [
        {
            txt: "社畜",
            base: { money: 3000, time: 2 },
            periodic: {
                name: "工资日",
                desc: "每月+800金钱，但-10体力",
                interval: 4,
                effect: { money: 800, stamina: -10 }
            }
        },
        {
            txt: "学生",
            base: { money: 500, time: 4 },
            periodic: {
                name: "校园生活",
                desc: "每月社交+5，考试周(第3月)SAN-15",
                interval: 4,
                effect: { social: 5 },
                special: { examWeek: { month: 3, effect: { san: -15 } } }
            }
        },
        {
            txt: "家里蹲",
            base: { money: 100, time: 6 },
            periodic: {
                name: "时间自由",
                desc: "每周体力自然恢复+5",
                interval: 1,
                effect: { stamina: 5 }
            }
        },
        {
            txt: "富二代",
            base: { money: 8000, time: 6 },
            periodic: {
                name: "零花钱",
                desc: "每月+2000金钱",
                interval: 4,
                effect: { money: 2000 }
            }
        },
        {
            txt: "猫奴",
            base: { money: 1800, time: 5 },
            periodic: {
                name: "猫咪治愈",
                desc: "每周SAN+3，偶尔猫生病-500金钱",
                interval: 1,
                effect: { san: 3 },
                special: { sickChance: 0.05, sickEffect: { money: -500, san: -10 } }
            }
        },
        {
            txt: "自由职业",
            base: { money: 1500, time: 5 },
            periodic: {
                name: "灵活收入",
                desc: "创作成功时额外+300金钱",
                interval: 0,
                onCreateSuccess: { money: 300 }
            }
        }
    ],

    // --- 核心：事件池 ---
    events: {
        // 1. 打工/现充事件池
        work: [
            { title: "加班地狱", text: "老板让你连夜改PPT，你错过了晚上的{cp}群语音。", effect: { money: 800, san: -10, passion: -5 }, tags: { sentiment: 'negative', contentTypes: ['money_gain', 'san_loss'] } },
            { title: "掉马危机", text: "同事看到了你的屏保，问：'这是同性恋漫画吗？' 你吓出一身冷汗。", effect: { san: -15, social: -5 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'social_loss'] } },
            { title: "发奖金了", text: "项目结款！你立刻把钱换成了{cp}的谷子（周边）。", effect: { money: 2000, love: 10 }, tags: { sentiment: 'positive', contentTypes: ['money_gain', 'purchase'] } },
            { title: "遇到同好", text: "新来的实习生居然也是{cp}姐！世界真小。", effect: { social: 15, san: 10, passion: 10 }, tags: { sentiment: 'positive', contentTypes: ['social_gain', 'san_gain', 'cp_sweet'] } },
            { title: "社死瞬间", text: "开会投屏忘关浏览器，全公司都看到了你写的{cp}《强制爱》大纲，HR建议你注意心理健康。", effect: { social: -20, san: -20, money: 200 }, tags: { sentiment: 'negative', contentTypes: ['social_loss', 'san_loss'] } },
            { title: "虚伪的现充", text: "同事问你周末去哪浪，你笑着说在家躺平，其实坐了5小时高铁去漫展只为给{cp}摊主塞一封信。", effect: { money: -500, passion: 30, social: 5 }, tags: { sentiment: 'positive', contentTypes: ['money_loss', 'cp_sweet'] } },
            { title: "加班发疯", text: "凌晨三点还在改PPT，刷到{rival}家太太还在激情产粮。你感叹：原来不用上班的人才配搞同人。", effect: { san: -15, money: 600, passion: -5 }, tags: { sentiment: 'negative', contentTypes: ['money_gain', 'san_loss', 'rival_pain'] } },
            { title: "团建噩梦", text: "公司团建去KTV，领导非要让你点歌。你点了一首{cp}角色的角色歌，全场寂静，没人听过。", effect: { social: -10, san: -5 }, tags: { sentiment: 'negative', contentTypes: ['social_loss'] } },
            { title: "带薪搞黄", text: "趁着老板出差，你在工位上偷偷用手机写了一段{cp}两千字的豪车，这种背德感让你文思泉涌，效率极高。", effect: { money: 200, passion: 20, stamina: -5 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'cp_sweet'] } },
            { title: "快递社死", text: "公司的前台帮你签收了快递，大声喊道：'谁的{cp}本子？' 包装盒上大大的R18标识让你想当场离职。", effect: { social: -30, san: -30 }, tags: { sentiment: 'negative', contentTypes: ['social_loss', 'san_loss'] } },
            { title: "现充的误解", text: "同事看你在画{cp}，凑过来说：'这俩男/女的也是兄弟/闺蜜情吗？' 你露出尴尬又不失礼貌的微笑：'是啊，社会主义友情。'", effect: { social: -5, san: -10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "为了谷子", text: "为了买那个溢价三倍的{cp}场贩限定吧唧，你主动申请了周末加班。老板夸你上进，你只想让他闭嘴给钱。", effect: { money: 600, san: -15, love: 5 }, tags: { sentiment: 'neutral', contentTypes: ['money_gain', 'purchase'] } },
            // 新增：基于真实故事
            { title: "实习生名场面", text: "实习期间偷偷在工位看{cp}漫画，同事凑过来问：'看什么呢？' 还提到了魔道祖师和陈情令。你的汗当场就下来了。", effect: { san: -25, social: -10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'social_loss'] } },
            { title: "午休惊魂", text: "午休时间戴着耳机听{cp}广播剧，听到激动处没忍住笑出声，抬头发现全办公室都在看你。", effect: { san: -15, social: -5 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "微信头像盘问", text: "领导突然问你微信头像是谁，你说是'一个游戏角色'。领导追问：'怎么两个人贴那么近？' 你恨不得原地消失。", effect: { san: -20, social: -8 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "公司Wi-Fi翻车", text: "用公司Wi-Fi刷{cp}同人，IT居然发邮件提醒你'注意网络使用规范'。他们是不是看到了什么？", effect: { san: -30, social: -15 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'social_loss'] } },
            { title: "年会才艺", text: "公司年会被逼表演才艺，你唱了一首{cp}的角色曲。没人听懂歌词，但你唱得声泪俱下，同事们面面相觑。", effect: { social: -5, san: -10, passion: 15 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } }
        ],

        // 2. 产粮/创作事件池
        create: [
            { title: "手感火热", text: "为{cp}文思泉涌，下笔如有神，这篇绝对是神作！", effect: { tech: 15, myHeat: 20, works: 0.5 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'heat_gain', 'cp_sweet'] } },
            { title: "遭遇瓶颈", text: "卡文了，坐在电脑前三个小时只写了三百字的{cp}。", effect: { san: -10, stamina: -20, works: 0.1 }, tags: { sentiment: 'negative', contentTypes: ['creation', 'san_loss'] } },
            { title: "忘记保存", text: "软件崩溃了...你写的{cp}万字长文，心也碎了。", effect: { san: -30, passion: -10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "被大V转了", text: "你的{cp}产出被圈内大手转发，通知栏炸了！", effect: { myHeat: 50, passion: 20, love: 5 }, tags: { sentiment: 'positive', contentTypes: ['heat_gain', 'cp_sweet'] } },
            { title: "查资料黑洞", text: "本想写个{cp}考据向正剧，结果查阅资料查了整整一通宵，正文一个字没动。", effect: { tech: 20, stamina: -20, works: 0 }, tags: { sentiment: 'neutral', contentTypes: ['creation'] } },
            { title: "冷圈自萌", text: "{cp}这真的太冷了，全网只有你在产粮。你既是作者又是读者，自己割大腿肉喂自己，含泪吃下。", effect: { san: -10, passion: 30, myHeat: 5 }, tags: { sentiment: 'negative', contentTypes: ['creation', 'cp_sweet'] } },
            { title: "经典永流传", text: "试图给{cp}搞点新花样，但最后还是忍不住写了最经典的ABO设定，信息素交融的描写让你自己都脸红心跳。", effect: { tech: 10, passion: 15, works: 0.5 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'cp_sweet'] } },
            { title: "战损美学", text: "画了一张{cp}的战损图，特意细化了伤口和血迹的质感，这种破碎感和张力让首页的同好们集体发疯。", effect: { tech: 15, myHeat: 25, works: 1 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'heat_gain', 'cp_sweet'] } },
            { title: "清水也是肉", text: "虽然{cp}全程连手都没牵，但你通过眼神拉丝和暧昧的指尖接触，写出了比R18还要色气的张力，评论区一片狼嚎。", effect: { tech: 20, myHeat: 15, works: 0.5 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'heat_gain', 'cp_sweet'] } },
            { title: "甚至过度", text: "画人体练习时逐渐走偏，最后变成了一张尺度惊人的{cp}车图。你犹豫再三，打满厚码发到了小号上。", effect: { passion: 20, san: -5, myHeat: 30 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'heat_gain', 'cp_sweet'] } },
            { title: "先婚后爱", text: "写了一个{cp}土得掉渣的'先婚后爱'带球跑剧本，虽然剧情狗血，但这种古早味的酸爽感让数据出奇的好。", effect: { myHeat: 40, social: 10, works: 0.5 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'heat_gain', 'cp_sweet'] } },
            { title: "互攻万岁", text: "写腻了单向攻受，你尝试给{cp}写了一篇互攻（里板）。两人在床上争夺主导权，从床头打架到床尾，这种势均力敌的性张力太香了。", effect: { tech: 15, myHeat: 20, works: 0.5 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'heat_gain', 'cp_sweet'] } },
            { title: "百合车文", text: "深夜灵感爆发，为{cp}写了一篇关于'手指'和'湿润'的R18G。虽然没有真的器官描写，但那种湿漉漉的氛围感让你自己写完都脸红。", effect: { passion: 25, san: -5, works: 0.5 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'cp_sweet'] } },
            { title: "日常甜饼", text: "不想搞虐的，给{cp}写了个同居三十题。比如'帮对方吹头发'、'穿对方的衬衫'。这种平淡的幸福感让读者在评论区直呼想结婚。", effect: { san: 10, myHeat: 15, works: 0.5 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'san_gain', 'cp_sweet'] } },
            { title: "校园考据", text: "为了写好{cp}校园文，你专门查了日本女子高中的课程表和制服构造。写出来的'在更衣室互相整理领结'的情节细节满满，被夸严谨。", effect: { tech: 15, stamina: -10, works: 0.5 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'cp_sweet'] } },
            { title: "百合构图", text: "尝试画了{cp}经典的'磨豆腐'构图（虽然会被屏蔽），两人肢体交缠，大腿和小腿的线条交错，你画腿画得欲罢不能。", effect: { tech: 20, passion: 20, works: 1 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'cp_sweet'] } },
            { title: "光影练习", text: "画了一张{cp}夕阳下的接吻剪影。重点刻画了两人发丝纠缠的细节，这种朦胧的唯美感比直接画脸更有意境。", effect: { tech: 15, myHeat: 15, works: 1 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'heat_gain', 'cp_sweet'] } },
            { title: "表情差分", text: "画了一组{cp}表情包：A在狂笑，B在翻白眼；A在撒娇，B在脸红。这组图迅速在群里传开了，大家都在用。", effect: { social: 15, myHeat: 20, works: 1 }, tags: { sentiment: 'positive', contentTypes: ['creation', 'heat_gain', 'social_gain', 'cp_sweet'] } }
        ],

        // 3. 嗑糖/消费事件池
        consume: [
            { title: "神仙太太", text: "在AO3读到一篇{cp}绝世好文，哭得稀里哗啦。", effect: { love: 20, passion: 10, san: 10 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'san_gain'] } },
            { title: "OOC警告", text: "读到一篇文，不仅逆了你的{cp}，还把你推写成了恋爱脑。我想吐。", effect: { san: -20, passion: -5 }, tags: { sentiment: 'negative', contentTypes: ['rival_pain', 'san_loss'] } },
            { title: "官方发糖", text: "最新一集动画里{cp}牵手了。", effect: { love: 15, san: 5 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'san_gain'] } },
            { title: "海鲜市场", text: "在闲鱼高价收到了{cp}梦情谷子！收到货打开一看，快递暴力运输，那个绝美镭射票折角了，你的心也折了。", effect: { money: -300, san: -20, love: 5 }, tags: { sentiment: 'negative', contentTypes: ['purchase', 'money_loss', 'san_loss'] } },
            { title: "对家骑脸", text: "刷推特看到{rival}大手发了张神图，虽然很不想承认，但那张图的光影和构图真的该死的好看。", effect: { san: -10, tech: 5, passion: -5 }, tags: { sentiment: 'negative', contentTypes: ['rival_pain'] } },
            { title: "塌房预警", text: "你嗑的{cp}坑被爆出丑闻。你看着满屋子的周边陷入沉思：是现在出二手止损，还是装死继续爱？", effect: { san: -50, money: 0, love: -50 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "绝美切页", text: "高价收到了几年前{cp}的绝版杂志切页，看着图上两个人哪怕站在画面边缘也在对视，你确信他们是真的。", effect: { love: 25, money: -100, san: 10 }, tags: { sentiment: 'positive', contentTypes: ['purchase', 'money_loss', 'cp_sweet', 'san_gain'] } },
            { title: "广播剧糖", text: "官方广播剧的边角料里，{cp}互相调侃了一句'笨蛋'。你戴着耳机反复听了五十遍，嘴角根本压不下来。", effect: { love: 20, passion: 15, san: 5 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'san_gain'] } },
            { title: "痛包出街", text: "耗时三天扎了一个{cp}超完美的痛包，带去漫展被集邮了无数次，痛层里的他们闪闪发光，你是全场最靓的崽。", effect: { love: 20, social: 15, money: -200 }, tags: { sentiment: 'positive', contentTypes: ['purchase', 'money_loss', 'social_gain', 'cp_sweet'] } },
            { title: "手办灰模", text: "官方终于公布了{cp}的手办企划！虽然还在监修中，但你看那个底座的设计，分明就是要把他们摆在一起卖！", effect: { love: 15, passion: 10, money: 0 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet'] } },
            { title: "视觉污染", text: "首页误刷到一张{rival}的高热度神图，虽然画技无可挑剔，但看到那两个人的脸凑在一起，你的生理性厌恶达到顶峰。", effect: { san: -25, passion: -10 }, tags: { sentiment: 'negative', contentTypes: ['rival_pain', 'san_loss'] } },
            { title: "泥塑地狱", text: "搜索{cp}的tag，结果全是把你的攻变成娇弱受的泥塑文学，甚至还有生子情节。你气得手抖，立刻写了避雷指南。", effect: { san: -30, combat: 10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "官方背刺", text: "官方新活动剧情里，你推居然和{rival}角色的互动比和{cp}还多！{rival}家在狂欢，你眼前一黑，感觉天塌了。", effect: { san: -50, love: -20, passion: -20 }, tags: { sentiment: 'negative', contentTypes: ['rival_pain', 'san_loss'] } },
            { title: "ABO反差萌", text: "刷到一篇{cp}ABO文，平日雷厉风行的御姐Alpha易感期发作，把头埋在软妹Omega颈窝里红着眼眶求'再给一点信息素'，这种反差让你当场昏迷。", effect: { love: 25, passion: 15, san: 10 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'san_gain'] } },
            { title: "死对头文学", text: "看了一篇{cp}死对头变情人，两人在暴雨夜的教室里吵架，吵着吵着突然不管不顾地接吻，那句'我讨厌你'被吞没在唇齿间，张力拉满。", effect: { love: 20, san: 5, passion: 10 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'san_gain'] } },
            { title: "指尖温存", text: "这篇{cp}清水文写得太好了，没有大尺度的描写，只写A帮B吹头发时手指穿过发丝触碰头皮的酥麻感，你却看得脸红心跳。", effect: { love: 15, passion: 20, san: 5 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'san_gain'] } },
            { title: "病娇囚禁", text: "点开一篇{cp}Dark向文，平日温柔的学姐笑着给学妹带上项圈：'这样你就哪也去不了了哦'。虽然三观炸裂，但你诚实地收藏了。", effect: { san: -10, passion: 25, love: 10 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet'] } },
            { title: "修仙互补", text: "看了篇{cp}文：合欢宗妖女x正道大师姐。妖女为了乱师姐道心故意撩拨，结果被师姐按在榻上哑声说'既然要乱，就乱到底'，你直呼好攻！", effect: { love: 30, passion: 10, san: 5 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'san_gain'] } },
            { title: "哨向神交", text: "这篇{cp}哨向文绝了，精神体是雪豹和垂耳兔。兔子在精神图景里把雪豹蹬了一脚，现实中两人的互动也是这种又凶又宠的调调。", effect: { love: 20, passion: 15 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet'] } },
            { title: "破镜重圆", text: "{cp}分手五年后在同学会重逢，她在桌下偷偷勾住了她的脚踝，面上却还在和别人谈笑风生。这隐秘的背德感让你头皮发麻。", effect: { love: 25, san: -5, passion: 20 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet'] } },
            { title: "体格差神图", text: "刷到一张{cp}神图，身材高大的1单手抱起娇小的0，0的双腿紧紧盘在1腰间，这个体型差让你瞬间嘶哈。", effect: { love: 30, passion: 20 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet'] } },
            { title: "浴室湿身", text: "首页飘过一张{cp}浴室图，水蒸气缭绕中，她隔着湿透的白衬衫帮她扣扣子，眼神却盯着锁骨上的咬痕。这光影简直是艺术品！", effect: { love: 25, passion: 25, san: 5 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'san_gain'] } },
            { title: "手书大作", text: "B站刷到一个{cp}播放量百万的手书《Magnet》，画面切到两人手指十指相扣、蝴蝶耳机纠缠的瞬间，配合那个旋律，你泪目了。", effect: { love: 35, passion: 20 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet'] } },
            { title: "Cosplay", text: "看到一组{cp}漫展场照，两个Coser还原了原作里的经典壁咚名场面，那个眼神拉丝简直和原著一模一样，评论区都在按头。", effect: { social: 10, love: 20 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'social_gain'] } },
            // 新增：基于真实故事
            { title: "谷子碎了", text: "期待已久的{cp}亚克力立牌到货了，拆快递时手滑摔在地上，裂成了两半。你看着地上的碎片，眼泪不争气地流下来。", effect: { san: -35, money: -80, love: 5 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'money_loss'] } },
            { title: "直播名场面", text: "在看{cp}官方直播时，两位声优/演员互动超甜，弹幕全在刷'真的在一起了吧'。你激动得截了三十张图。", effect: { love: 30, passion: 25, san: 10 }, tags: { sentiment: 'positive', contentTypes: ['cp_sweet', 'san_gain'] } },
            { title: "限定秒没", text: "{cp}联动限定开售，你定了五个闹钟准时开抢，结果0.5秒售罄。看着'已售完'三个字，你想砸手机。", effect: { san: -25, passion: -10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "黄牛溢价", text: "抢不到的{cp}限定谷子在闲鱼上已经炒到原价五倍了。你咬咬牙下单，钱包在滴血，但谷子必须要。", effect: { money: -400, love: 15, san: -10 }, tags: { sentiment: 'negative', contentTypes: ['money_loss', 'purchase'] } },
            { title: "官宣BE", text: "{cp}官方剧情走向BE了。你看着屏幕上的结局字幕，内心毫无波动，因为同人世界里他们永远HE。", effect: { san: -15, passion: 10, love: 5 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "翻车鉴定", text: "高价收的{cp}绝版周边被群里姐妹鉴定为盗版。你看着那个几乎以假乱真的吧唧，陷入了沉默。", effect: { san: -40, money: -200, social: 10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'money_loss'] } }
        ],

        // 4. 社交/扩列事件池
        social: [
            { title: "由于太现充", text: "{cp}群里在聊CP，你在聊今晚吃什么，被冷落了。", effect: { social: 10, myHeat: -5 }, tags: { sentiment: 'neutral', contentTypes: ['social_gain', 'heat_loss'] } },
            { title: "小团体撕逼", text: "{cp}群主和管理吵起来了，你被要求站队。", effect: { san: -20, social: -10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'social_loss'] } },
            { title: "扩列成功", text: "在微博勾搭到了一个同城{cp}同好，相谈甚欢。", effect: { social: 15, passion: 10 }, tags: { sentiment: 'positive', contentTypes: ['social_gain', 'cp_sweet'] } },
            { title: "挂人贴", text: "你在广场吐槽{rival}了一句，被对家截图挂了。", effect: { myHeat: 30, san: -30, toxic: true }, tags: { sentiment: 'negative', contentTypes: ['heat_gain', 'san_loss', 'rival_pain'] } },
            { title: "无效扩列", text: "加了一个{cp}'只吃甜饼不吃刀'的互暖群，结果群主半夜发了几千字的BE虐文，还说这是糖。", effect: { san: -15, social: 5 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'social_gain'] } },
            { title: "赛博背刺", text: "和你聊{cp}聊得最好的亲友突然退群了，私聊才发现她们拉了一个没有你的新群，正在吐槽你的文风太古早。", effect: { san: -50, myHeat: 10, toxic: true }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "漫展无料", text: "为了{cp}漫展准备了50份免费物料（无料），结果遇到一群特别有礼貌的小粉丝，听着她们喊'妈咪'，你心里暖暖的。", effect: { social: 20, passion: 15, money: -100 }, tags: { sentiment: 'positive', contentTypes: ['social_gain', 'money_loss', 'cp_sweet'] } },
            { title: "连麦修罗场", text: "深夜{cp}群语音，两个麦霸因为'谁是上面的'争论了三个小时，你在旁边瑟瑟发抖，最后被迫当了裁判。", effect: { social: 10, san: -15 }, tags: { sentiment: 'negative', contentTypes: ['social_gain', 'san_loss'] } },
            { title: "约稿翻车", text: "花大价钱约了圈内知名画手画{cp}，结果对方拖稿两个月，最后交出来的图人体崩坏，还不如你自己画的草稿。", effect: { money: -500, san: -20, social: -5 }, tags: { sentiment: 'negative', contentTypes: ['money_loss', 'san_loss', 'social_loss'] } },
            { title: "匿名树洞", text: "有人在匿名墙投稿吐槽你的{cp}文风太矫情，评论区居然还有人附和。你一气之下把那个树洞号拉黑了。", effect: { san: -15, myHeat: 5, toxic: true }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "only展", text: "去参加了{cp}Only漫展，现场氛围好到爆炸，没有乱七八糟的人员，大家都在疯狂贴贴，你买本子买得停不下来。", effect: { social: 30, money: -500, passion: 20 }, tags: { sentiment: 'positive', contentTypes: ['social_gain', 'money_loss', 'purchase', 'cp_sweet'] } },
            { title: "一眼顶针", text: "{cp}群里混进了一个{rival}视奸号，发言没破绽，但从qq标签被你一眼识破。你带头把他挂了出来，群友纷纷称赞你火眼金睛，守护了这一方净土。", effect: { social: 15, combat: 20, san: 5 }, tags: { sentiment: 'positive', contentTypes: ['social_gain', 'san_gain', 'rival_pain'] } },
            { title: "互推好文", text: "和一个{cp}同好互推粮单，结果发现彼此的XP惊人的一致！从ABO到Futa设定都能聊，你们相见恨晚，聊了个通宵。", effect: { social: 20, passion: 20, stamina: -20 }, tags: { sentiment: 'positive', contentTypes: ['social_gain', 'cp_sweet'] } },
            // 新增：基于真实故事
            { title: "演唱会大战", text: "{cp}圈偶像开演唱会，嘉宾阵容引发CP粉大战。你看着曾经并肩作战的姐妹互相拉黑，感觉天塌了。", effect: { san: -35, social: -20, passion: -15 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'social_loss'] } },
            { title: "脱粉回踩", text: "有人在超话发了长文宣布脱粉，还把你当初安利她入坑的聊天记录截图挂了出来，说你'洗脑'她。", effect: { san: -40, social: -15, myHeat: 15 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'social_loss'] } },
            { title: "被家人发现", text: "姐姐闲着没事翻了你的手机，看到了你写的{cp}同人文。她问：'这个...是你写的？' 你恨不得钻进地缝里。", effect: { san: -45, social: -10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "妈妈的疑问", text: "妈妈打扫你房间时翻到了{cp}本子，晚饭时她欲言又止，最后问：'你是不是有什么想告诉我的？' 你差点呛死。", effect: { san: -50, stamina: -10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "小红书安利成功", text: "在小红书发了一篇{cp}安利帖，没想到火了！评论区涌入一堆新人问'入坑推荐'，你成了传教士。", effect: { social: 25, myHeat: 35, passion: 20 }, tags: { sentiment: 'positive', contentTypes: ['social_gain', 'heat_gain'] } },
            { title: "微博抽奖连中", text: "参加{cp}太太的转发抽奖，居然连续中了两次！群里姐妹说你是'欧皇本皇'，太太还亲自私信祝贺。", effect: { san: 20, social: 15, love: 10 }, tags: { sentiment: 'positive', contentTypes: ['san_gain', 'social_gain'] } },
            { title: "CP粉内战", text: "{cp}圈因为左右位吵起来了，你默默退出了三个群，把五个人拉进了黑名单。这个圈子，累了。", effect: { san: -30, social: -25, passion: -10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss', 'social_loss'] } }
        ],

        // 5. 休息/退网事件池
        rest: [
            { title: "深度睡眠", text: "梦里什么都有，梦里你的{cp}结婚了。", effect: { stamina: 40, san: 20 }, tags: { sentiment: 'positive', contentTypes: ['san_gain', 'cp_sweet'] } },
            { title: "断网保平安", text: "不看SNS的一天，远离{cp}和{rival}的战场，世界如此美好。", effect: { san: 15, passion: -5 }, tags: { sentiment: 'positive', contentTypes: ['san_gain'] } },
            { title: "生病了", text: "熬夜磕{cp}太多抵抗力下降，不得不去医院。", effect: { money: -200, stamina: 20 }, tags: { sentiment: 'negative', contentTypes: ['money_loss'] } },
            { title: "电子阳痿", text: "突然对什么都提不起劲。不想看{cp}文，不想打游戏，不想刷推。只想躺在床上盯着天花板发呆。", effect: { stamina: 30, passion: -20, love: -10 }, tags: { sentiment: 'negative', contentTypes: [] } },
            { title: "腱鞘炎犯了", text: "长时间画{cp}导致手腕剧痛，医生警告你必须休息。你看着未完成的稿子，含泪给读者发了请假条。", effect: { stamina: -10, san: -10, works: 0 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "岁月静好", text: "收拾了一下乱成猪窝的房间，把{cp}谷子整整齐齐摆进展示柜。看着痛柜，你觉得这破世界还是值得活的。", effect: { san: 30, stamina: -10, love: 20 }, tags: { sentiment: 'positive', contentTypes: ['san_gain', 'cp_sweet'] } },
            { title: "现充体验", text: "强迫自己出门去公园走了两万步，暂时忘记了{cp}。没有网络信号，只有花草树木，你感觉自己体内的毒素被净化了。", effect: { stamina: 20, san: 15, passion: -10 }, tags: { sentiment: 'positive', contentTypes: ['san_gain'] } },
            // 新增：基于真实故事
            { title: "翻旧物破防", text: "整理房间时翻出了三年前买的{cp}周边，那时候还在热恋期，现在CP都塌了。你对着一堆吧唧发呆了半小时。", effect: { san: -15, stamina: 20, love: 10 }, tags: { sentiment: 'negative', contentTypes: ['san_loss'] } },
            { title: "和室友出柜", text: "鼓起勇气向室友坦白了自己是{cp}姐的事实，没想到她说：'我也是！' 你们连夜开始了联合嗑糖。", effect: { san: 25, social: 20, passion: 15 }, tags: { sentiment: 'positive', contentTypes: ['san_gain', 'social_gain'] } },
            { title: "父母的和解", text: "妈妈终于接受了你'喜欢看两个人谈恋爱'的爱好，虽然她还是不太理解为什么'不能是男女'。", effect: { san: 35, stamina: 15 }, tags: { sentiment: 'positive', contentTypes: ['san_gain'] } },
            { title: "同人文治愈", text: "心情低落的时候翻出收藏夹里最爱的那篇{cp}甜饼，读着读着眼泪就下来了，但是是幸福的眼泪。", effect: { san: 25, stamina: 25, love: 15 }, tags: { sentiment: 'positive', contentTypes: ['san_gain', 'cp_sweet'] } },
            { title: "清空黑历史", text: "花了一整天把早期写的那些OOC{cp}文全删了，虽然有点心疼，但看着干净的主页，你感觉人生重新开始了。", effect: { san: 20, stamina: -15, myHeat: -10 }, tags: { sentiment: 'positive', contentTypes: ['san_gain'] } }
        ]
    },

    // --- 触发器：属性判定特殊事件 ---
    triggers: [
        // ========== CP热度触发器（冷圈 → 烫门） ==========
        // 极冷圈：cpHeat < 5
        {
            condition: (s) => s.cpHeat < 5,
            event: {
                title: "极地求生",
                text: "你的CP实在是太冷了，冷到Tag里上一条微博还是你半个月前发的。你在超话里大喊一声，只有回音。",
                effect: { passion: -10, san: -5, myHeat: -2 }
            }
        },
        // 冷圈：cpHeat < 15
        {
            condition: (s) => s.cpHeat < 15 && s.cpHeat >= 5 && s.turn % 4 === 0,
            event: {
                title: "圈地自萌",
                text: "虽然是个冷圈，但仅有的几个亲友都很温暖。大家抱团取暖，一点点粮渣都能嚼半天。",
                effect: { san: 10, love: 5, social: 2 }
            }
        },
        // 冷圈惊喜：cpHeat < 20 稀有正向
        {
            condition: (s) => s.cpHeat < 20 && Math.random() < 0.08,
            event: {
                title: "冷圈奇迹",
                text: "有个新人因为补档入坑了你的CP！她激动地艾特你说一切都是因为看了你的文，你感觉自己的坚持有了意义。",
                effect: { passion: 25, san: 15, social: 10, love: 10 }
            }
        },
        // 中等热度：cpHeat 40-60 官方偶尔互动
        {
            condition: (s) => s.cpHeat >= 40 && s.cpHeat <= 60 && Math.random() < 0.15,
            event: {
                title: "官方小饼干",
                text: "官方今天发了一张合照，虽然不是什么大糖，但你硬是嗑出了三千字小作文。",
                effect: { love: 10, passion: 8 }
            }
        },
        // 高热度：cpHeat > 60 官方频繁发糖
        {
            condition: (s) => s.cpHeat > 60 && s.cpHeat <= 80 && Math.random() < 0.2,
            event: {
                title: "官方营业",
                text: "最近官方活动频繁，动画里的互动、联名周边...你的钱包在燃烧，但心里甜滋滋的。",
                effect: { love: 15, passion: 10, money: -200 }
            }
        },
        // 大热门：cpHeat > 80 同人本热销
        {
            condition: (s) => s.cpHeat > 80 && Math.random() < 0.15,
            event: {
                title: "流量红利",
                text: '因为CP正当红，你随手画的一个鱼摸居然有几千热度！大量的点赞提示音让你产生了一种这就是"大手"的错觉。',
                effect: { myHeat: 50, passion: 10, tech: 2 }
            }
        },
        {
            condition: (s) => s.cpHeat > 80 && s.tech > 30 && Math.random() < 0.12,
            event: {
                title: "本子大卖",
                text: "趁着CP热度，你开了预售！订单量超出预期，印厂加急，你既开心又忙得脚不沾地。",
                effect: { money: 800, myHeat: 30, stamina: -15 }
            }
        },
        // 顶流：cpHeat > 100 是非多
        {
            condition: (s) => s.cpHeat > 100 && Math.random() < 0.2,
            event: {
                title: "烫门是非多",
                text: "因为你的CP太火，广场上每天都在吵架。今天是因为攻受左右位，明天是因为OOC，你看着满屏的戾气，感到心累。",
                effect: { san: -20, passion: -5 }
            }
        },
        {
            condition: (s) => s.cpHeat > 100 && Math.random() < 0.1,
            event: {
                title: "拆家入侵",
                text: "你的CP热度太高，引来了一群专职拆CP的黑子。他们到处刷'官方没说是爱情'、'你们在做梦'，搅得圈内乌烟瘴气。",
                effect: { san: -25, passion: -10, cpHeat: -15 }
            }
        },

        // ========== 个人热度触发器（小透明 → 大手） ==========
        // 小透明：myHeat < 20
        {
            condition: (s) => s.myHeat < 20 && Math.random() < 0.15,
            event: {
                title: "小透明日常",
                text: "发了条微博，三天了还是只有自己点的那个赞。你安慰自己：圈地自萌最快乐。",
                effect: { passion: -5, san: -3 }
            }
        },
        {
            condition: (s) => s.myHeat < 10 && s.love > 60 && Math.random() < 0.1,
            event: {
                title: "被遗忘的神作",
                text: "你写了一篇自认为神作的万字长文，结果石沉大海。但你知道，有些好东西是需要时间被发现的。",
                effect: { san: -10, passion: 5, tech: 3 }
            }
        },
        // 新人期：myHeat 20-50
        {
            condition: (s) => s.myHeat >= 20 && s.myHeat <= 50 && Math.random() < 0.12,
            event: {
                title: "初次被转发",
                text: "一个粉丝数比你多的太太转发了你的图，评价是'很有潜力'。虽然是八百年前的客套话，但你还是开心了一整天。",
                effect: { passion: 15, myHeat: 10, san: 5 }
            }
        },
        // 中V期：myHeat 50-100
        {
            condition: (s) => s.myHeat >= 50 && s.myHeat <= 100 && Math.random() < 0.1,
            event: {
                title: "约稿邀请",
                text: "有人私信问你接不接约稿！虽然报价不高，但这代表你的作品被认可了。",
                effect: { money: 300, passion: 10, tech: 5 }
            }
        },
        {
            condition: (s) => s.myHeat >= 70 && s.myHeat <= 120 && Math.random() < 0.08,
            event: {
                title: "首页安利",
                text: "你的作品被列入了'本周神作推荐'！评论区涌入一堆新面孔，你一边回复评论一边傻笑。",
                effect: { myHeat: 40, social: 15, passion: 15 }
            }
        },
        // 大V期：myHeat > 100
        {
            condition: (s) => s.myHeat > 100 && s.myHeat <= 150 && Math.random() < 0.1,
            event: {
                title: "同行嫉妒",
                text: "有人在匿名区阴阳怪气地说你'热度都是刷的'。你气得够呛，但又没法反驳，毕竟跳脚就输了。",
                effect: { san: -15, passion: -5 }
            }
        },
        {
            condition: (s) => s.myHeat > 120 && Math.random() < 0.08,
            event: {
                title: "商业邀约",
                text: "一个游戏公司私信你问是否有兴趣画立绘！虽然价格压得很低，但这是正经甲方啊！",
                effect: { money: 500, passion: 20, stamina: -10 }
            }
        },
        // 顶流：myHeat > 150
        {
            condition: (s) => s.myHeat > 150 && Math.random() < 0.12,
            event: {
                title: "私生困扰",
                text: "有个粉丝开始频繁给你发私信，从表白到质问'为什么不回复'，甚至开始挖你的真实信息。你感到一阵恶寒。",
                effect: { san: -30, social: -10 }
            }
        },
        {
            condition: (s) => s.myHeat > 150 && Math.random() < 0.1,
            event: {
                title: "被挂了",
                text: "因为你说了一句中立的话，被截图挂到了广场上。支持你的和反对你的吵成一团，你这才意识到人红是非多。",
                effect: { san: -25, myHeat: 20 }
            }
        },
        {
            condition: (s) => s.myHeat > 200 && !s.goddess,
            event: { title: "加冕时刻", text: "你的粉丝数突破了临界点，现在你说话就是圈内风向标。恭喜你成为了圈内的顶流大手！", effect: { goddess: true, passion: 50 } }
        },

        // ========== 热度联动触发器 ==========
        // CP热 + 个人热 = 爆发
        {
            condition: (s) => s.cpHeat > 80 && s.myHeat > 100 && Math.random() < 0.08,
            event: {
                title: "天时地利",
                text: "CP正热+你也正红，你发的每条内容都能引爆首页！接下来的创作会事半功倍。",
                effect: { passion: 30, myHeat: 30, love: 10 }
            }
        },
        // CP冷 + 个人热 = 拉动效应
        {
            condition: (s) => s.cpHeat < 30 && s.myHeat > 80 && Math.random() < 0.1,
            event: {
                title: "一人成军",
                text: "虽然CP没什么热度，但因为你的影响力，越来越多人开始关注这对CP了。你就是这个冷圈的太阳！",
                effect: { cpHeat: 20, passion: 20, love: 15 }
            }
        },

        // ========== 原有属性触发器 ==========
        {
            condition: (s) => s.san < 20,
            event: { title: "发疯文学", text: "你的精神状态已岌岌可危，在微博连发50条乱码，吓跑了粉丝。", effect: { myHeat: -20, social: -10 } }
        },
        {
            condition: (s) => s.money < 100,
            event: { title: "吃土警告", text: "余额不足，你不得不卖掉一部分{cp}吧唧回血。", effect: { money: 500, love: -10 } }
        },

        // ========== 属性倾向触发器 ==========
        {
            condition: (s) => State.alignment && State.alignment.toxic > 80 && Math.random() < 0.15,
            event: {
                title: "毒唯之魂",
                text: "你发现自己已经完全无法接受{cp}以外的任何配对了。看到{rival}就想举报。",
                effect: { san: -10, combat: 20 },
                alignmentChange: { toxic: 5 }
            }
        },
        {
            condition: (s) => State.alignment && State.alignment.purity > 80 && Math.random() < 0.12,
            event: {
                title: "洁癖发作",
                text: "刷到一篇{cp}擦边球文案，你不仅点了举报，还截图发到了维护群里号召大家一起维权。",
                effect: { san: -5, social: 10, combat: 15 },
                alignmentChange: { purity: 3 }
            }
        },
        {
            condition: (s) => State.alignment && State.alignment.omnivory > 80 && Math.random() < 0.1,
            event: {
                title: "杂食快乐",
                text: "今天嗑{cp}，明天嗑{rival}，你发现自己什么都能吃。有人说你墙头草，但你觉得这叫博爱。",
                effect: { san: 10, passion: 15, love: -5 },
                alignmentChange: { omnivory: 3, toxic: -10 }
            }
        },
        {
            condition: (s) => State.alignment && State.alignment.gong > 75 && Math.random() < 0.1,
            event: {
                title: "攻党胜利",
                text: "新发的官方物料里，{cp}的攻完全占据C位！你激动地发了三十条推文庆祝。",
                effect: { passion: 20, love: 15 },
                alignmentChange: { gong: 5 }
            }
        },
        {
            condition: (s) => State.alignment && State.alignment.ma > 75 && Math.random() < 0.1,
            event: {
                title: "受党欢呼",
                text: "新发的官方物料里，{cp}的受可爱到犯规！你疯狂存图发到群里安利。",
                effect: { passion: 20, love: 15 },
                alignmentChange: { ma: 5 }
            }
        }
    ],

    // --- 成就系统定义 ---
    achievements: [
        // 里程碑成就
        { id: 'first_work', name: '初出茅庐', desc: '完成第一份作品', icon: '📝', condition: (s) => State.progress.works >= 1, unlocked: false },
        { id: 'heat_50', name: '崭露头角', desc: '个人热度达到50', icon: '🌟', condition: (s) => s.myHeat >= 50, unlocked: false },
        { id: 'heat_100', name: '小有名气', desc: '个人热度达到100', icon: '⭐', condition: (s) => s.myHeat >= 100, unlocked: false },
        { id: 'heat_200', name: '圈内名人', desc: '个人热度达到200', icon: '🌠', condition: (s) => s.myHeat >= 200, unlocked: false },
        { id: 'money_5000', name: '小康生活', desc: '存款达到5000', icon: '💰', condition: (s) => s.money >= 5000, unlocked: false },
        { id: 'love_80', name: '真爱粉', desc: '厨力达到80', icon: '💖', condition: (s) => s.love >= 80, unlocked: false },

        // 挑战成就
        { id: 'prolific', name: '高产似母猪', desc: '完成10份作品', icon: '📚', condition: (s) => State.progress.works >= 10, unlocked: false },
        { id: 'rich', name: '钞能力者', desc: '存款超过8000', icon: '💎', condition: (s) => s.money >= 8000, unlocked: false },
        { id: 'socialite', name: '社交达人', desc: '社交值达到80', icon: '👥', condition: (s) => s.social >= 80, unlocked: false },
        { id: 'tech_master', name: '技术大佬', desc: '技术达到80', icon: '🎨', condition: (s) => s.tech >= 80, unlocked: false },

        // 隐藏成就
        { id: 'whale', name: '氪金鲸鱼', desc: '总消费超过10000', icon: '🐋', hidden: true, condition: (s) => State.totalSpent >= 10000, unlocked: false },
        { id: 'toxic_master', name: '毒唯之王', desc: '毒唯倾向达到100', icon: '☠️', hidden: true, condition: (s) => State.alignment && State.alignment.toxic >= 100, unlocked: false },
        { id: 'phoenix', name: '浴火重生', desc: 'SAN从20以下恢复到80以上', icon: '🔥', hidden: true, condition: (s) => State.flags.phoenixEligible && s.san >= 80, unlocked: false },
        { id: 'survivor', name: '精神钢铁', desc: '游戏结束时SAN仍在70以上', icon: '🧠', hidden: true, condition: (s) => State.turn > 48 && s.san >= 70, unlocked: false },
        {
            id: 'balanced', name: '中庸之道', desc: '所有属性倾向都在40-60之间', icon: '☯️', hidden: true, condition: (s) => {
                if (!State.alignment) return false;
                const keys = ['gong', 'ma', 'ttk', 'mmr', 'toxic', 'purity', 'omnivory'];
                return keys.every(k => State.alignment[k] >= 40 && State.alignment[k] <= 60);
            }, unlocked: false
        }
    ],

    // --- 结局定义 (扩展版) ---
    endings: [
        // 正面结局
        { id: 'legend', title: '🌟 镇圈大手', desc: '你成为了圈内公认的神仙太太，一举一动都是风向标。无数粉丝追随，你的{cp}产出被奉为圭臬。', condition: (s) => s.myHeat > 150 && s.tech > 60 && State.progress.works >= 8 },
        { id: 'whale', title: '💎 氪金大佬', desc: '虽然没怎么产粮，但你用钱支撑了整个{cp}圈的生态。太太们都叫你"金主爸爸"。', condition: (s) => s.money > 5000 && s.love > 50 },
        { id: 'passion', title: '🔥 为爱发电之神', desc: '穷，但是幸福。你的{cp}作品是这个圈子最宝贵的财富，大家都记得你的名字。', condition: (s) => State.progress.works >= 10 && s.money < 800 },
        { id: 'lowkey', title: '📚 低调の神', desc: '你默默耕耘，不求名利。虽然热度不高，但每一份作品都是精品，被真正懂的人珍藏。', condition: (s) => s.myHeat < 40 && s.tech > 50 && State.progress.works >= 5 },
        { id: 'social_king', title: '🎭 万人迷社交花', desc: '圈内谁都认识你，每个群你都有好友。你是{cp}圈的社交中心，人脉就是你的财富。', condition: (s) => s.social > 70 && s.myHeat > 80 },
        { id: 'creator', title: '👑 圈子缔造者', desc: '在你的努力下，{cp}从冷门变成了热门。你亲手见证并参与了一个圈子的崛起。', condition: (s) => State.stats.cpHeat > 80 && s.myHeat > 100 && State.initialCpHeat < 30 },

        // 中性结局
        { id: 'happy_fish', title: '🐟 快乐咸鱼', desc: '低调嗑糖，悄悄幸福。你是{cp}圈最快乐的小透明。', condition: (s) => s.san > 70 && s.love > 60 && s.myHeat < 40 },
        { id: 'normal', title: '📖 平凡的一年', desc: '不算轰轰烈烈，但你在{cp}坑里坚持了365天。这就是真爱吧？', condition: () => true },
        { id: 'irl', title: '🌈 上岸现充', desc: '不知不觉间，你和现实世界的联系越来越多了。{cp}还在心里，但生活已经向前。', condition: (s) => s.social > 70 && s.passion < 40 },
        { id: 'watcher', title: '🎪 吃瓜群众', desc: '比起亲自下场，你更喜欢在群里围观。{cp}圈的八卦，你了如指掌。', condition: (s) => State.progress.works < 2 && s.social > 50 },

        // 负面结局 (提前结束)
        { id: 'breakdown', title: '💀 破防退网', desc: '互联网太恶意了，围绕{cp}的纷争让你的精神彻底崩溃。你删号跑路，再也不想回来。', condition: (s) => s.san <= 0 },
        { id: 'bored', title: '😶 淡坑退圈', desc: '爱会消失，对吗？你对{cp}的热情耗尽了，变成了普通的现充。', condition: (s) => s.passion <= 0 },
        { id: 'broke', title: '💸 信用破产', desc: '为了{cp}欠下巨款，花呗白条全部逾期，电话被打爆了。', condition: (s) => s.money <= -300 },
        { id: 'cancelled', title: '🔥 被圈内开除', desc: '你的毒唯行为惹怒了太多人，被大范围挂人。现在你的名字就是一个梗。', condition: (s) => State.alignment && State.alignment.toxic > 95 && s.san < 30 },

        // 特殊结局
        { id: 'mad', title: '🔮 深渊疯批', desc: '精神虽然不太稳定，但对{cp}的爱从未动摇。你在疯狂的边缘起舞。', condition: (s) => s.san < 30 && s.passion > 60 }
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
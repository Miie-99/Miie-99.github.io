// ==========================================
// MODULE: CommentPools (script/commentPools.js)
// 分层评论池系统 - 主楼评论 + 楼中楼回复
// ==========================================

const CommentPools = {
    // App 语言配置（语言: 权重）
    appLanguageConfig: {
        weibo: { zh: 95, jp: 5 },
        lofter: { zh: 90, jp: 10 },
        bilibili: { zh: 100 },
        ao3: { en: 70, zh: 20, jp: 10 },
        xianyu: { zh: 100 },
        twitter: { jp: 60, en: 30, zh: 10 },
        instagram: { en: 50, jp: 30, zh: 20 }
    },

    // === 主楼评论池 ===
    // 每条评论带属性: lang(语言), sentiment(情感), contentType(适用内容类型)
    comments: [
        // ====== 中文评论 (zh) ======
        // 夸赞类 (praise)
        { text: '神仙产出太太我跪了！！', lang: 'zh', sentiment: 'praise', contentType: 'any' },
        { text: '细节处理得太好了吧', lang: 'zh', sentiment: 'praise', contentType: 'any' },
        { text: '太太好厉害，我愿称之为神作', lang: 'zh', sentiment: 'praise', contentType: 'any' },
        { text: '这个构图绝了，收藏了', lang: 'zh', sentiment: 'praise', contentType: 'image' },
        { text: '文笔太好了呜呜呜', lang: 'zh', sentiment: 'praise', contentType: 'text' },
        { text: '剪辑节奏感太强了！', lang: 'zh', sentiment: 'praise', contentType: 'video' },
        { text: '太太请收下我的膝盖', lang: 'zh', sentiment: 'praise', contentType: 'any' },
        { text: '这氛围感拿捏得死死的', lang: 'zh', sentiment: 'praise', contentType: 'image' },
        { text: '神仙文笔是我吹一万年的程度', lang: 'zh', sentiment: 'praise', contentType: 'text' },
        { text: '踩点太舒服了爽到', lang: 'zh', sentiment: 'praise', contentType: 'video' },
        { text: '这产出质量太高了救命', lang: 'zh', sentiment: 'praise', contentType: 'any' },
        { text: '太太下凡了吧这是', lang: 'zh', sentiment: 'praise', contentType: 'any' },
        { text: '古希腊掌管产出的神', lang: 'zh', sentiment: 'praise', contentType: 'any' },
        { text: '这水平真的city', lang: 'zh', sentiment: 'praise', contentType: 'any' },
        { text: '就这么水灵灵地神了', lang: 'zh', sentiment: 'praise', contentType: 'any' },

        // 激动类 (excited)
        { text: '啊啊啊啊啊啊啊啊啊', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '救命这也太甜了！！！', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '我死了我没了我升天了', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '呜呜呜呜呜我的眼泪不值钱', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '什么神仙产出让我看看', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '磕到了磕到了！发癫', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '啊啊啊我不行了谁来救我', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '太好了太好了太好了', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '姐妹们快来看神', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '我要疯了这什么绝世糖', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '完蛋了心脏承受不住', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '原地去世.jpg', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '接接接！接一个这样的产出', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '被硬控了整整一分钟', lang: 'zh', sentiment: 'excited', contentType: 'video' },
        { text: '无理无理无理 太甜了！', lang: 'zh', sentiment: 'excited', contentType: 'any' },
        { text: '尊死了呜呜呜', lang: 'zh', sentiment: 'excited', contentType: 'any' },

        // 阴阳类 (sarcasm)
        { text: '某些人真的别磕了谢谢', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '这都能洗？圈子真是大开眼界', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '呵呵，懂的都懂', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '有些人是真敢说啊', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '笑死，又开始了', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '建议某些人照照镜子', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '哦是吗，那挺厉害的', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '我看不懂但我大受震撼', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '这也太草台班子了', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '班味收一收好吗', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '偷感很重嗷', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },
        { text: '红温了属于是', lang: 'zh', sentiment: 'sarcasm', contentType: 'any' },

        // 提问类 (question)
        { text: '这是什么梗啊求科普', lang: 'zh', sentiment: 'question', contentType: 'any' },
        { text: '有人能解释一下吗', lang: 'zh', sentiment: 'question', contentType: 'any' },
        { text: '请问这个出处是哪里', lang: 'zh', sentiment: 'question', contentType: 'any' },
        { text: '等等这剧情是我想的那样吗', lang: 'zh', sentiment: 'question', contentType: 'any' },
        { text: '所以这是HE还是BE啊', lang: 'zh', sentiment: 'question', contentType: 'text' },
        { text: '太太这用的什么滤镜求分享', lang: 'zh', sentiment: 'question', contentType: 'image' },
        { text: '请问bgm是什么', lang: 'zh', sentiment: 'question', contentType: 'video' },
        { text: '姐妹们这个合集链接有吗', lang: 'zh', sentiment: 'question', contentType: 'any' },
        { text: '这个谷子哪里买的啊', lang: 'zh', sentiment: 'question', contentType: 'image' },
        { text: '求问这个是官方还是同人', lang: 'zh', sentiment: 'question', contentType: 'any' },

        // 分享类 (share)
        { text: '我也磕这对！握手', lang: 'zh', sentiment: 'share', contentType: 'any' },
        { text: '这个设定跟我脑补的一模一样', lang: 'zh', sentiment: 'share', contentType: 'any' },
        { text: '想起我入坑的时候了', lang: 'zh', sentiment: 'share', contentType: 'any' },
        { text: '我之前也画过类似的', lang: 'zh', sentiment: 'share', contentType: 'image' },
        { text: '感同身受了家人们', lang: 'zh', sentiment: 'share', contentType: 'any' },
        { text: '这让我想到之前那篇..', lang: 'zh', sentiment: 'share', contentType: 'text' },
        { text: '买谷子把我掏空了', lang: 'zh', sentiment: 'share', contentType: 'any' },
        { text: '我的痛包也有这个！', lang: 'zh', sentiment: 'share', contentType: 'image' },

        // 玩梗类 (meme) - 2024-2025热梗大更新
        { text: '我直接好家伙', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '芜湖起飞', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '一整个大的震撼住', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '我裂开了', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '就这？就这？？', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '绝绝子', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '人麻了', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '笑死根本不是', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '不愧是你', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '完全大丈夫', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        // 2024-2025 新热梗
        { text: '接！', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '接接接接接', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '硬控我三分钟', lang: 'zh', sentiment: 'meme', contentType: 'video' },
        { text: '这也太抽象了', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '搞抽象是吧', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '草台班子罢了', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '偷感很重', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '班味十足', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '那咋了', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '包的', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: 'city不city', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '太city了', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '水灵灵地发出来', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '古希腊掌管XX的神', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '因为他善', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '不是哥们', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '已购买小孩爱吃', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '勇敢小羊，不怕困难', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '活人感好强', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '从从容容游刃有余', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '匆匆忙忙连滚带爬', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '红温警告', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '我是e人我先说', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: 'i人沉默了', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '社交牛杂症发作', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '你是懂嘴替的', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '谷子战士报到', lang: 'zh', sentiment: 'meme', contentType: 'image' },
        { text: '赛博对账.jpg', lang: 'zh', sentiment: 'meme', contentType: 'any' },
        { text: '韧性拉满', lang: 'zh', sentiment: 'meme', contentType: 'any' },

        // ====== 日文评论 (jp) ======
        { text: '神絵師さん！！', lang: 'jp', sentiment: 'praise', contentType: 'image' },
        { text: 'めっちゃ好き', lang: 'jp', sentiment: 'praise', contentType: 'any' },
        { text: '尊い…', lang: 'jp', sentiment: 'excited', contentType: 'any' },
        { text: 'ありがとうございます！！', lang: 'jp', sentiment: 'excited', contentType: 'any' },
        { text: '最高すぎる', lang: 'jp', sentiment: 'praise', contentType: 'any' },
        { text: '天才かよ', lang: 'jp', sentiment: 'praise', contentType: 'any' },
        { text: '無理無理無理', lang: 'jp', sentiment: 'excited', contentType: 'any' },
        { text: '死んだ', lang: 'jp', sentiment: 'excited', contentType: 'any' },
        { text: 'これはエモい', lang: 'jp', sentiment: 'praise', contentType: 'any' },
        { text: 'わかりみが深い', lang: 'jp', sentiment: 'share', contentType: 'any' },
        { text: 'それな', lang: 'jp', sentiment: 'meme', contentType: 'any' },
        { text: '草', lang: 'jp', sentiment: 'meme', contentType: 'any' },
        { text: '猫ミーム最高', lang: 'jp', sentiment: 'meme', contentType: 'video' },
        { text: 'ぬいぐるみ可愛すぎ', lang: 'jp', sentiment: 'excited', contentType: 'image' },
        { text: '推しが尊い', lang: 'jp', sentiment: 'excited', contentType: 'any' },
        { text: '解釈一致', lang: 'jp', sentiment: 'share', contentType: 'any' },

        // ====== 英文评论 (en) ======
        { text: 'OMG this is amazing!!!', lang: 'en', sentiment: 'excited', contentType: 'any' },
        { text: 'The details are incredible', lang: 'en', sentiment: 'praise', contentType: 'any' },
        { text: 'I\'m literally crying rn', lang: 'en', sentiment: 'excited', contentType: 'any' },
        { text: 'This is so wholesome', lang: 'en', sentiment: 'praise', contentType: 'any' },
        { text: 'Can someone explain?', lang: 'en', sentiment: 'question', contentType: 'any' },
        { text: 'I feel attacked lol', lang: 'en', sentiment: 'share', contentType: 'any' },
        { text: 'My heart 💔', lang: 'en', sentiment: 'excited', contentType: 'any' },
        { text: 'I ship them so hard', lang: 'en', sentiment: 'share', contentType: 'any' },
        { text: 'Take my kudos!', lang: 'en', sentiment: 'praise', contentType: 'any' },
        { text: 'dead 💀', lang: 'en', sentiment: 'meme', contentType: 'any' },
        { text: 'Same tbh', lang: 'en', sentiment: 'share', contentType: 'any' },
        { text: 'This is everything', lang: 'en', sentiment: 'praise', contentType: 'any' },
        { text: 'slay', lang: 'en', sentiment: 'meme', contentType: 'any' },
        { text: 'no bc this is so real', lang: 'en', sentiment: 'share', contentType: 'any' },
        { text: 'rent free in my head', lang: 'en', sentiment: 'excited', contentType: 'any' },
        { text: 'core memory unlocked', lang: 'en', sentiment: 'share', contentType: 'any' }
    ],

    // === 楼中楼回复池 ===
    // 根据主楼情感类型匹配逻辑相关的回复
    replies: {
        // 回复夸赞类主楼
        toPraise: [
            { text: '附议！', lang: 'zh', type: 'agree' },
            { text: '+1', lang: 'zh', type: 'agree' },
            { text: '疯狂点头', lang: 'zh', type: 'agree' },
            { text: '就是说！太太永远的神', lang: 'zh', type: 'agree' },
            { text: '还有那个XX也很绝', lang: 'zh', type: 'expand' },
            { text: '你们看到那个细节了吗', lang: 'zh', type: 'expand' },
            { text: '酸了酸了', lang: 'zh', type: 'jealous' },
            { text: '救命我酸成柠檬精了', lang: 'zh', type: 'jealous' },
            { text: 'same here', lang: 'en', type: 'agree' },
            { text: 'ikr!!', lang: 'en', type: 'agree' },
            { text: 'それな！', lang: 'jp', type: 'agree' },
            { text: '本当にそう', lang: 'jp', type: 'agree' }
        ],

        // 回复激动类主楼
        toExcited: [
            { text: '啊啊啊我也是！！', lang: 'zh', type: 'join' },
            { text: '一起发癫！', lang: 'zh', type: 'join' },
            { text: '姐妹冷静点（虽然我也不冷静', lang: 'zh', type: 'tease' },
            { text: '楼主还好吗哈哈哈', lang: 'zh', type: 'tease' },
            { text: '氧气瓶递给你', lang: 'zh', type: 'tease' },
            { text: '理解理解太理解了', lang: 'zh', type: 'join' },
            { text: 'SAME OMG', lang: 'en', type: 'join' },
            { text: 'RIP us', lang: 'en', type: 'join' },
            { text: '分かる😭', lang: 'jp', type: 'join' }
        ],

        // 回复阴阳类主楼
        toSarcasm: [
            { text: '阴阳人能不能闭嘴', lang: 'zh', type: 'defend' },
            { text: '你说的对，你最厉害', lang: 'zh', type: 'sarcasm_back' },
            { text: '大家冷静一下...', lang: 'zh', type: 'mediate' },
            { text: '算了懒得吵', lang: 'zh', type: 'mediate' },
            { text: '又开始了是吧', lang: 'zh', type: 'tired' },
            { text: '吃瓜.jpg', lang: 'zh', type: 'watch' }
        ],

        // 回复提问类主楼
        toQuestion: [
            { text: '这个梗是指...（解释）', lang: 'zh', type: 'answer' },
            { text: '我也想知道！蹲一个', lang: 'zh', type: 'wait' },
            { text: '楼上说的对', lang: 'zh', type: 'confirm' },
            { text: '建议去看看原作', lang: 'zh', type: 'redirect' },
            { text: '科普一下：其实是...', lang: 'zh', type: 'answer' },
            { text: 'Same question lol', lang: 'en', type: 'wait' }
        ],

        // 回复分享类主楼
        toShare: [
            { text: '我也是！握手', lang: 'zh', type: 'relate' },
            { text: '同好姐妹！', lang: 'zh', type: 'relate' },
            { text: '抱抱楼主', lang: 'zh', type: 'encourage' },
            { text: '这不巧了嘛', lang: 'zh', type: 'relate' },
            { text: '建议多产出（暗示）', lang: 'zh', type: 'encourage' },
            { text: 'relatable af', lang: 'en', type: 'relate' }
        ],

        // 回复玩梗类主楼
        toMeme: [
            { text: '笑死', lang: 'zh', type: 'laugh' },
            { text: '哈哈哈哈哈', lang: 'zh', type: 'laugh' },
            { text: '懂的都懂', lang: 'zh', type: 'get_it' },
            { text: '这个必须顶', lang: 'zh', type: 'support' },
            { text: 'lmaooo', lang: 'en', type: 'laugh' },
            { text: '草', lang: 'jp', type: 'laugh' }
        ]
    },

    // === 工具函数 ===

    // 根据权重随机选择语言
    getRandomLang(appId) {
        const config = this.appLanguageConfig[appId] || { zh: 100 };
        const total = Object.values(config).reduce((a, b) => a + b, 0);
        let rand = Math.random() * total;
        for (const [lang, weight] of Object.entries(config)) {
            rand -= weight;
            if (rand <= 0) return lang;
        }
        return 'zh';
    },

    // 获取符合条件的评论
    getComments(options = {}) {
        const { lang, sentiment, contentType } = options;
        return this.comments.filter(c => {
            if (lang && c.lang !== lang) return false;
            if (sentiment && c.sentiment !== sentiment) return false;
            if (contentType && c.contentType !== 'any' && c.contentType !== contentType) return false;
            return true;
        });
    },

    // 获取随机主楼评论
    getRandomComment(appId, contentType = 'any') {
        const lang = this.getRandomLang(appId);
        let pool = this.getComments({ lang, contentType });
        // 如果没有匹配的，放宽条件
        if (pool.length === 0) {
            pool = this.getComments({ lang });
        }
        if (pool.length === 0) {
            pool = this.comments;
        }
        return pool[Math.floor(Math.random() * pool.length)];
    },

    // 根据主楼情感获取楼中楼回复池key
    getReplyPoolKey(sentiment) {
        const map = {
            praise: 'toPraise',
            excited: 'toExcited',
            sarcasm: 'toSarcasm',
            question: 'toQuestion',
            share: 'toShare',
            meme: 'toMeme'
        };
        return map[sentiment] || 'toPraise';
    },

    // 获取逻辑关联的楼中楼回复
    getReplies(mainComment, count = 2) {
        const poolKey = this.getReplyPoolKey(mainComment.sentiment);
        const pool = this.replies[poolKey] || this.replies.toPraise;

        // 随机选取count条不重复的回复
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    // 生成完整评论列表（主楼+楼中楼）
    generateCommentList(appId, contentType = 'any', count = 3) {
        const result = [];
        for (let i = 0; i < count; i++) {
            const mainComment = this.getRandomComment(appId, contentType);
            const replies = Math.random() > 0.5 ? this.getReplies(mainComment, Math.floor(Math.random() * 3) + 1) : [];

            result.push({
                name: Apps.getRandomUsername(appId),
                text: mainComment.text,
                time: this.getRandomTime(),
                likes: Math.floor(Math.random() * 100),
                avatarColor: this.getRandomColor(),
                sentiment: mainComment.sentiment,
                replies: replies.map(r => ({
                    name: Apps.getRandomUsername(appId),
                    text: r.text,
                    time: this.getRandomTime(),
                    likes: Math.floor(Math.random() * 30)
                }))
            });
        }
        return result;
    },

    // 辅助函数
    getRandomTime() {
        const times = ['刚刚', '1分钟前', '5分钟前', '10分钟前', '30分钟前', '1小时前', '2小时前', '昨天'];
        return times[Math.floor(Math.random() * times.length)];
    },

    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

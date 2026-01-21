// ==========================================
// MODULE: Apps (script/apps.js)
// 悬浮App菜单 - 社交媒体模拟 v3.0
// 热度分级 + 同人女ID + 完整中文化
// ==========================================

const Apps = {
    // SVG图标库（镂空线条风格）
    icons: {
        like: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>`,
        likeFilled: `<svg class="icon-filled" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>`,
        comment: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>`,
        share: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/>
        </svg>`,
        bookmark: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
        </svg>`,
        back: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>`,
        search: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>`,
        menu: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>`,
        play: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>`,
        image: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
        </svg>`,
        send: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>`,
        expand: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
        </svg>`,
        collapse: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"/>
        </svg>`,
        fire: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2c0 4-4 6-4 10a4 4 0 108 0c0-4-4-6-4-10z"/>
        </svg>`,
        reply: `<svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/>
        </svg>`
    },

    // 热度等级定义
    heatLevels: {
        arctic: { name: '北极圈', min: 0, max: 10, likes: [3, 20], comments: [0, 5], views: [50, 300] },
        cold: { name: '冷圈', min: 11, max: 25, likes: [20, 80], comments: [5, 20], views: [300, 1000] },
        coolWarm: { name: '温冷', min: 26, max: 40, likes: [80, 250], comments: [20, 60], views: [1000, 5000] },
        warm: { name: '温', min: 41, max: 55, likes: [250, 800], comments: [60, 150], views: [5000, 20000] },
        warmHot: { name: '温热', min: 56, max: 70, likes: [800, 2500], comments: [150, 400], views: [20000, 80000] },
        hot: { name: '热', min: 71, max: 85, likes: [2500, 8000], comments: [400, 1200], views: [80000, 300000] },
        burning: { name: '烫圈', min: 86, max: 100, likes: [8000, 30000], comments: [1200, 5000], views: [300000, 1000000] }
    },

    // 真实同人女/命苦ID库（来自用户提供的示例）
    usernames: {
        mingku: [
            '所有人上跑道', '后三排往前坐', '你给俺个说法', '视奸手滑点赞', '买完立刻降价',
            '拉屎天天窜稀', '尿急没有厕所', '毕业等于失业', '论文忘记保存', '你一周干啥了',
            '创新点在哪里', '拼好饭被偷吃', '前男友谈富婆', '把妹王没有把', '常灌好了攻呢',
            '人在德国上学', '补考还是挂科', '作业一字未动', '明天即将返校', '拉黑还推对家',
            '吃饭还打厨子', '嗯嗯继续打我', '买饭忘记领券', '老公在外做鸭', '大风吹走裤衩',
            '好饭无人来拼', '也曾大喊来财', '四级差点及格', '睡觉遇见蟑螂', '现在进展如何',
            '答辩没过延毕', '法考差一分过', '骂我真会爽到', '神券膨至两块', '摔倒误食鸡屎',
            '耍帅被偷高低', '命苦ID征集', '一周六天早八', '神券无法膨胀', '黄焖鸡是土豆',
            '后三排不坐人', '补考交四百块', '神券献给胖猫', '吃屎呛到了', '老公在外做零',
            '一笑就滴尿', '这节课收手机', '恁咋不早说', '周末加到凌晨', '月初加到月末',
            '明天又要上学', '明天又要上班', '神券不能膨胀', '好饭已被拼走', '买拼好饭被偷',
            '期末没过六十', '下雨鞋里进水', '到家忘拿快递', '无早八忘关铃', '翘早八被点名',
            '不要退货退款', '已读不回拉黑', '外卖忘用神券', '出门忘带钥匙', '科二三次没过',
            '老公为爱当零', '每逢经期窜稀', '吃我兵线作甚', '还我中路血包', '每天连跪百把',
            '实验做不出来', '导师叫你来下', '上班又迟到了', '大招框住不上', '拉屎忘记带纸',
            '我外卖被偷了', '请假理由不当', '小组作业抓紧', '拉屎扣破手纸', '指甲缝里有屎',
            '论文写完被删', '凑满减没付钱', '刚好错过地铁', '一周7天早八', '离家双非学医',
            '怎么又周一了', '假期离开我了', '加班到半夜', '打车没补贴', '上课憋笑崩屁',
            '刚逃课就签到', '加班没工资', '打工取钱被抢', '工作摸鱼被开', '抖腿被记玩脚',
            '客户要第一版', '还是要第一版', '下周一开学', '论文打回重写'
        ],
        weibo: [
            '冷雨下玫瑰', '阮棠', '浅诉', '休止符', '茉莉降雪', '绿木', '碎玻璃心', '夏令时',
            '杰约是种美德', '觅元素', '一碗元宵鱼', 'の訫澪学妹_🍀', '温良de主角嬷',
            '梦违科学世纪', '太中四万了', 'Pinnxier-20th', '反线面', '于矿洞遇见你那湛蓝的眼眸',
            '怪我星衍主义ovo', '爆汁蟑螂冰镇黄油煤气罐', '旧难一点', '碳氧循环', '冰岛大虾🍤',
            '放射性尘埃', '绝望的女公10086', '独自一人走进旷野', '狡いカラス', '产品奴',
            '家耀祖最严厉的母亲', '雪桃菓子', '弥儿心总如水', '精神状态十分美丽yyyy'
        ],
        lofter: [
            '乱溪朝歌', '重楼引', '烟水迢迢共轻舟', '檀钰控', '光祈奴', '安帕就酱',
            '重度依赖患者', '孤舟蓑笠翁', '落花时节又', '执笔绘长安', '素手调朱砂',
            '琉璃月下魂', '清灯古卷旁', '彧行', '山佳十九见', '南隰有杨zh',
            '乱絮飞花送行舟', '蓄力吃抛春恨', '昨夜秋雨兼风', '暗杀误触烹饪'
        ],
        bilibili: [
            '混剪小能手', '手书画到秃', '鬼畜调教师', '由于太冷自割腿肉', '白奶的起头',
            '由于磕到昏厥申请去世', '弹幕护卫中心', '硬币投手', '充电侠女装',
            '追番到凌晨', '补档考古人', '耶咻大惊失色地', '难全弈星不出传说不改名',
            'Freestyle', '歪比巴卜', '三连求求了', '下次一定更'
        ],
        ao3: [
            'midnight_writer', 'dream_weaver', 'starlight_ink', 'words_in_dark',
            'silent_observer', 'coffee_and_keys', 'sleepless_muse', 'momo',
            'rockbounce', 'Everglowww', 'Blessing', 'Bloodgarment'
        ],
        xianyu: [
            '谷子回血中', '出坑大甩卖', '周边清仓啦', '吃土也要买', '血亏出周边',
            '掌上咪猪', '豆浆一杯', '南梦雪', '糕手', '好困', '福满', '小小情愿'
        ],
        twitter: [
            '夜行猫又', '星屑収集家', '月下の絵師', 'ペン先の魔法', '物語纺ぎ手',
            '孤独な蒐集家', '深夜創作人', '静かな观察者', '夜明けの读者'
        ],
        instagram: [
            'itabag_life', 'event_hunter', '拍照废人', 'Hanaum杉夏', '芝士分子',
            'cos_planet', 'merch_heaven', 'daily_fandom', '痛包晒一晒'
        ]
    },

    // CP相关ID模板
    cpIdTemplates: [
        '参赛者💞{cp}加油', '{cp}最严厉的司仪', '{cp}入{c0}来', '{cp}入{c1}来',
        '全网最尊重{cp}的账号', '{cp}之女', '{cp}教忠诚孝女', '看{cp}草壁',
        '{cp}力挺女友{c1}', '{cp}到底好甜ovo', '怪我{cp}主义', '家猫{cp}',
        '神不磕{cp}我磕', '{cp}奴', '绝望的{cp}姐', '爱吃{cp}糖', '卖{cp}佛',
        '{cp}武魂融合技', '{cp}啥时候结婚', '{cp}重度依赖', '{cp}全肯定bot',
        '爱你{cp}明天见', '你爸妈是假的{cp}都是真的', '{cp}瘾', '{cp}癖',
        '高举{cp}大旗', '{cp}唯爱{c0}', '{cp}携批夜袭{c1}'
    ],

    // App定义列表
    list: [
        { id: 'weibo', name: '围脖', icon: 'fire', unlocked: true, color: '#e6162d' },
        { id: 'lofter', name: '老福特', icon: 'bookmark', unlocked: true, color: '#2d5a88' },
        { id: 'bilibili', name: '小破站', icon: 'play', unlocked: true, color: '#fb7299' },
        { id: 'ao3', name: '3OA', icon: 'bookmark', unlocked: false, color: '#990000', unlockDesc: '技术≥50 或 完成3篇作品' },
        { id: 'xianyu', name: '咸鱼', icon: 'bookmark', unlocked: false, color: '#ffcd00', unlockDesc: '消费≥15次 或 金钱≥5000' },
        { id: 'twitter', name: '蓝鸟', icon: 'send', unlocked: false, color: '#1da1f2', unlockDesc: '社交≥60 且 热度≥80' },
        { id: 'instagram', name: 'SNI', icon: 'image', unlocked: false, color: '#c13584', unlockDesc: '个人热度≥60' }
    ],

    // 状态
    menuOpen: false,
    currentApp: null,
    userComments: {},
    likedItems: new Set(),

    // 获取当前热度等级
    getHeatLevel() {
        const cpHeat = State.stats?.cpHeat || 0;
        for (const [key, level] of Object.entries(this.heatLevels)) {
            if (cpHeat >= level.min && cpHeat <= level.max) {
                return { key, ...level };
            }
        }
        return { key: 'arctic', ...this.heatLevels.arctic };
    },

    randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    calcStats() {
        const level = this.getHeatLevel();
        return {
            likes: this.randomInRange(level.likes[0], level.likes[1]),
            comments: this.randomInRange(level.comments[0], level.comments[1]),
            views: this.randomInRange(level.views[0], level.views[1]),
            reposts: Math.floor(this.randomInRange(level.likes[0], level.likes[1]) * 0.3),
            levelName: level.name
        };
    },

    getRandomUsername(platform) {
        const cp = State.cp || 'AB';
        const roll = Math.random();
        if (roll < 0.3) {
            const mingkuIds = this.usernames.mingku;
            return mingkuIds[Math.floor(Math.random() * mingkuIds.length)];
        } else if (roll < 0.5) {
            const templates = this.cpIdTemplates;
            const template = templates[Math.floor(Math.random() * templates.length)];
            let name = template.replace('{cp}', cp);
            name = name.replace('{c0}', cp[0] || 'A');
            name = name.replace('{c1}', cp[1] || 'B');
            return name;
        } else {
            const names = this.usernames[platform] || this.usernames.weibo;
            return names[Math.floor(Math.random() * names.length)];
        }
    },

    init() {
        this.createFloatingButton();
        this.createMenuPanel();
        this.createAppViewer();
        this.createToast();
        this.updateUnlockStatus();
    },

    updateUnlockStatus() {
        this.list.forEach(app => {
            switch (app.id) {
                case 'weibo':
                case 'lofter':
                case 'bilibili':
                    app.unlocked = true;
                    break;
                case 'ao3':
                    app.unlocked = (State.stats.tech >= 50) || (State.progress.works >= 3);
                    break;
                case 'xianyu':
                    app.unlocked = ((State.actionCounts?.consume || 0) >= 15) || (State.stats.money >= 5000);
                    break;
                case 'twitter':
                    app.unlocked = (State.stats.social >= 60) && (State.stats.myHeat >= 80);
                    break;
                case 'instagram':
                    app.unlocked = (State.stats.myHeat >= 60);
                    break;
            }
        });
    },

    createFloatingButton() {
        if (document.getElementById('app-fab')) return;
        const btn = document.createElement('div');
        btn.id = 'app-fab';
        btn.className = 'app-fab';
        btn.innerHTML = this.icons.menu;
        btn.onclick = () => this.toggleMenu();
        document.body.appendChild(btn);
    },

    createMenuPanel() {
        if (document.getElementById('app-menu')) return;
        const panel = document.createElement('div');
        panel.id = 'app-menu';
        panel.className = 'app-menu hidden';
        panel.innerHTML = `
            <div class="app-menu-header">
                <span>我的App</span>
                <span class="app-menu-close" onclick="Apps.toggleMenu()">&times;</span>
            </div>
            <div class="app-menu-grid" id="app-menu-grid"></div>
        `;
        document.body.appendChild(panel);
        this.renderMenuGrid();
    },

    renderMenuGrid() {
        const grid = document.getElementById('app-menu-grid');
        if (!grid) return;
        this.updateUnlockStatus();
        grid.innerHTML = this.list.map(app => `
            <div class="app-menu-item ${app.unlocked ? '' : 'locked'}" 
                 onclick="${app.unlocked ? `Apps.openApp('${app.id}')` : ''}"
                 title="${app.unlocked ? app.name : app.unlockDesc || '未解锁'}">
                <div class="app-icon" style="background: ${app.unlocked ? app.color : '#444'}">
                    ${app.unlocked ? this.icons[app.icon] : this.icons.bookmark}
                </div>
                <div class="app-name">${app.name}</div>
            </div>
        `).join('');
    },

    createAppViewer() {
        if (document.getElementById('app-viewer')) return;
        const viewer = document.createElement('div');
        viewer.id = 'app-viewer';
        viewer.className = 'app-viewer hidden';
        viewer.innerHTML = `<div class="app-viewer-content" id="app-viewer-content"></div>`;
        document.body.appendChild(viewer);
    },

    createToast() {
        if (document.getElementById('app-toast')) return;
        const toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.className = 'app-toast hidden';
        document.body.appendChild(toast);
    },

    showToast(msg) {
        const toast = document.getElementById('app-toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2000);
    },

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        const menu = document.getElementById('app-menu');
        const fab = document.getElementById('app-fab');
        if (this.menuOpen) {
            this.renderMenuGrid();
            menu.classList.remove('hidden');
            fab.classList.add('active');
        } else {
            menu.classList.add('hidden');
            fab.classList.remove('active');
        }
    },

    openApp(appId) {
        const app = this.list.find(a => a.id === appId);
        if (!app || !app.unlocked) return;
        this.currentApp = app;
        this.toggleMenu();
        const viewer = document.getElementById('app-viewer');
        const content = document.getElementById('app-viewer-content');
        content.innerHTML = this.renderAppContent(app);
        viewer.classList.remove('hidden');
        this.bindAppEvents();
    },

    closeApp() {
        const viewer = document.getElementById('app-viewer');
        viewer.classList.add('hidden');
        this.currentApp = null;
    },

    bindAppEvents() {
        document.querySelectorAll('.action-like').forEach(btn => {
            btn.onclick = (e) => this.handleLike(e.currentTarget);
        });
        document.querySelectorAll('.toggle-replies').forEach(btn => {
            btn.onclick = (e) => this.toggleReplies(e.currentTarget);
        });
        document.querySelectorAll('.comment-submit').forEach(btn => {
            btn.onclick = (e) => this.submitComment(e.currentTarget);
        });
        document.querySelectorAll('.action-share').forEach(btn => {
            btn.onclick = () => this.handleShare();
        });
    },

    handleLike(btn) {
        const itemId = btn.dataset.id;
        const countEl = btn.querySelector('.like-count');
        const iconEl = btn.querySelector('svg');
        if (this.likedItems.has(itemId)) {
            this.likedItems.delete(itemId);
            if (countEl) countEl.textContent = parseInt(countEl.textContent) - 1;
            iconEl.outerHTML = this.icons.like;
            btn.classList.remove('liked');
        } else {
            this.likedItems.add(itemId);
            if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
            iconEl.outerHTML = this.icons.likeFilled;
            btn.classList.add('liked');
            this.showToast('已点赞');
        }
    },

    toggleReplies(btn) {
        const container = btn.closest('.comment-item');
        const replies = container.querySelector('.comment-replies');
        const icon = btn.querySelector('svg');
        if (replies.classList.contains('collapsed')) {
            replies.classList.remove('collapsed');
            icon.outerHTML = this.icons.collapse;
            btn.querySelector('.toggle-text').textContent = '收起回复';
        } else {
            replies.classList.add('collapsed');
            icon.outerHTML = this.icons.expand;
            btn.querySelector('.toggle-text').textContent = '展开回复';
        }
    },

    submitComment(btn) {
        const container = btn.closest('.comment-input-area');
        const input = container.querySelector('input');
        const text = input.value.trim();
        if (!text) return;
        const postId = container.dataset.postId || 'default';
        if (!this.userComments[postId]) this.userComments[postId] = [];
        this.userComments[postId].push({ name: '我', text, time: '刚刚', likes: 0 });
        const commentsList = container.previousElementSibling;
        if (commentsList) {
            const newComment = document.createElement('div');
            newComment.className = 'comment-item user-comment';
            newComment.innerHTML = `
                <div class="comment-avatar" style="background: var(--primary-400)"></div>
                <div class="comment-body">
                    <span class="comment-name">我</span>
                    <span class="comment-text">${text}</span>
                    <div class="comment-meta">
                        <span>刚刚</span>
                        <button class="action-like mini" data-id="user-${Date.now()}">
                            ${this.icons.like}<span class="like-count">0</span>
                        </button>
                    </div>
                </div>
            `;
            commentsList.appendChild(newComment);
            newComment.querySelector('.action-like').onclick = (e) => this.handleLike(e.currentTarget);
        }
        input.value = '';
        this.showToast('评论已发布');
    },

    handleShare() {
        this.showToast('已转发到我的主页');
    },

    getCurrentMonth() {
        return Math.ceil((State.turn || 1) / 4);
    },

    formatNumber(num) {
        if (num >= 10000) return (num / 10000).toFixed(1) + '万';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    },

    renderAppContent(app) {
        const month = this.getCurrentMonth();
        const cp = State.cp || 'AB';
        const rival = State.rival || 'BA';
        switch (app.id) {
            case 'weibo': return this.renderWeibo(month, cp, rival);
            case 'lofter': return this.renderLofter(month, cp, rival);
            case 'bilibili': return this.renderBilibili(month, cp, rival);
            case 'ao3': return this.renderAO3(month, cp, rival);
            case 'xianyu': return this.renderXianyu(month, cp, rival);
            case 'twitter': return this.renderTwitter(month, cp, rival);
            case 'instagram': return this.renderInstagram(month, cp, rival);
            default: return '<div class="p-4">内容加载中...</div>';
        }
    },

    renderPost(post, postId) {
        return `
            <div class="post-card" data-id="${postId}">
                <div class="post-header">
                    <div class="post-avatar" style="background: ${post.avatarColor}"></div>
                    <div class="post-user-info">
                        <div class="post-name">${post.name}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                ${post.media ? `
                <div class="media-placeholder">
                    <div class="media-icon">${this.icons.image}</div>
                    <div class="media-desc">[${post.media}]</div>
                </div>
                ` : ''}
                <div class="post-actions">
                    <button class="action-btn action-like" data-id="${postId}">
                        ${this.icons.like}<span class="like-count">${post.likes}</span>
                    </button>
                    <button class="action-btn action-comment">
                        ${this.icons.comment}<span>${post.comments}</span>
                    </button>
                    <button class="action-btn action-share">
                        ${this.icons.share}<span>${post.reposts}</span>
                    </button>
                </div>
                <div class="comments-section">
                    <div class="comments-list">
                        ${(post.commentList || []).map((c, i) => this.renderComment(c, `${postId}-c${i}`)).join('')}
                    </div>
                    <div class="comment-input-area" data-post-id="${postId}">
                        <input type="text" placeholder="写评论..." class="comment-input">
                        <button class="comment-submit">${this.icons.send}</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderComment(comment, commentId) {
        const hasReplies = comment.replies && comment.replies.length > 0;
        return `
            <div class="comment-item" data-id="${commentId}">
                <div class="comment-avatar" style="background: ${comment.avatarColor || '#999'}"></div>
                <div class="comment-body">
                    <span class="comment-name">${comment.name}</span>
                    <span class="comment-text">${comment.text}</span>
                    <div class="comment-meta">
                        <span>${comment.time}</span>
                        <button class="action-like mini" data-id="${commentId}">
                            ${this.icons.like}<span class="like-count">${comment.likes || 0}</span>
                        </button>
                        <button class="action-reply">${this.icons.reply}</button>
                    </div>
                    ${hasReplies ? `
                    <div class="comment-replies collapsed">
                        ${comment.replies.map((r, i) => `
                            <div class="reply-item">
                                <span class="reply-name">${r.name}</span>
                                <span class="reply-to">回复 @${r.replyTo || comment.name}</span>
                                <span class="reply-text">${r.text}</span>
                                <div class="reply-meta">
                                    <span>${r.time}</span>
                                    <button class="action-like mini" data-id="${commentId}-r${i}">
                                        ${this.icons.like}<span class="like-count">${r.likes || 0}</span>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="toggle-replies">
                        ${this.icons.expand}
                        <span class="toggle-text">展开${comment.replies.length}条回复</span>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    renderWeibo(month, cp, rival) {
        const level = this.getHeatLevel();
        const posts = this.getWeiboPosts(cp, level);
        return `
            <div class="app-weibo">
                <div class="app-header weibo-header">
                    <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                    <span class="header-title">围脖</span>
                    <span class="header-action">${this.icons.search}</span>
                </div>
                <div class="hot-section">
                    <div class="section-title">${this.icons.fire} 围脖热搜 <span class="heat-badge">${level.name}</span></div>
                    <div class="hot-list">
                        ${this.getWeiboHotSearches(cp, level).map((item, i) => `
                            <div class="hot-item">
                                <span class="hot-rank ${i < 3 ? 'top' : ''}">${i + 1}</span>
                                <span class="hot-text">${item.text}</span>
                                ${item.tag ? `<span class="hot-tag ${item.tag}">${item.tagText}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="feed-section">
                    <div class="section-title">#${cp}超话#</div>
                    ${posts.map((post, idx) => this.renderPost(post, `weibo-${idx}`)).join('')}
                </div>
            </div>
        `;
    },

    renderLofter(month, cp, rival) {
        const works = this.getLofterWorks(cp);
        const level = this.getHeatLevel();
        return `
            <div class="app-lofter">
                <div class="app-header lofter-header">
                    <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                    <span class="header-title">老福特</span>
                    <span class="header-action">${this.icons.menu}</span>
                </div>
                <div class="tags-bar">
                    <span class="tag-item active">#${cp}#</span>
                    <span class="tag-item">#同人文#</span>
                    <span class="tag-item">#同人图#</span>
                    <span class="heat-badge">${level.name}</span>
                </div>
                <div class="feed-section">
                    ${works.map((work, idx) => `
                    <div class="lofter-card" data-id="lofter-${idx}">
                        <div class="media-placeholder large">
                            <div class="media-icon">${this.icons.image}</div>
                            <div class="media-desc">[${work.mediaDesc}]</div>
                        </div>
                        <div class="card-info">
                            <div class="card-title">${work.title}</div>
                            <div class="card-author">
                                <span class="author-avatar" style="background: ${work.avatarColor}"></span>
                                <span class="author-name">${work.author}</span>
                            </div>
                            <div class="card-actions">
                                <button class="action-like" data-id="lofter-${idx}">
                                    ${this.icons.like}<span class="like-count">${work.likes}</span>
                                </button>
                                <span class="action-btn">${this.icons.comment}<span>${work.comments}</span></span>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderBilibili(month, cp, rival) {
        const videos = this.getBilibiliVideos(cp);
        const level = this.getHeatLevel();
        return `
            <div class="app-bilibili">
                <div class="app-header bili-header">
                    <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                    <div class="bili-search">${this.icons.search} 搜索${cp}相关</div>
                </div>
                <div class="tabs-bar">
                    <span class="tab-item active">推荐</span>
                    <span class="tab-item">动态</span>
                    <span class="tab-item">热门</span>
                    <span class="heat-badge">${level.name}</span>
                </div>
                <div class="feed-section">
                    ${videos.map((v, idx) => `
                    <div class="bili-card" data-id="bili-${idx}">
                        <div class="bili-cover">
                            <div class="media-placeholder horizontal">
                                <div class="media-icon">${this.icons.play}</div>
                                <div class="media-desc">[${v.coverDesc}]</div>
                            </div>
                            <span class="bili-duration">${v.duration}</span>
                        </div>
                        <div class="bili-info">
                            <div class="bili-title">${v.title}</div>
                            <div class="bili-meta">
                                <span class="bili-up">${v.up}</span>
                                <span>${this.icons.play} ${v.views}</span>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderAO3(month, cp, rival) {
        const works = this.getAO3Works(cp);
        return `
            <div class="app-ao3">
                <div class="app-header ao3-header">
                    <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                    <span class="header-title">Archive of Our Own</span>
                </div>
                <div class="ao3-search-info">
                    <div>${cp} 相关作品</div>
                    <div class="ao3-filter">筛选 · 按好评排序</div>
                </div>
                <div class="feed-section">
                    ${works.map((w, idx) => `
                    <div class="ao3-work" data-id="ao3-${idx}">
                        <div class="ao3-title">${w.title}</div>
                        <div class="ao3-author">作者：${w.author}</div>
                        <div class="ao3-tags">
                            ${w.tags.map(t => `<span class="ao3-tag">${t}</span>`).join('')}
                        </div>
                        <div class="ao3-summary">${w.summary}</div>
                        <div class="ao3-stats">
                            <span>字数：${w.words}</span>
                            <span>好评：${w.kudos}</span>
                            <span class="action-like" data-id="ao3-${idx}">${this.icons.like}</span>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderXianyu(month, cp, rival) {
        const items = this.getXianyuItems(cp);
        return `
            <div class="app-xianyu">
                <div class="app-header xianyu-header">
                    <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                    <div class="xianyu-search">${this.icons.search} ${cp} 周边</div>
                </div>
                <div class="xianyu-grid">
                    ${items.map((item, idx) => `
                    <div class="xianyu-item" data-id="xianyu-${idx}">
                        <div class="media-placeholder square">
                            <div class="media-icon">${this.icons.image}</div>
                            <div class="media-desc">[${item.imgDesc}]</div>
                        </div>
                        <div class="xianyu-info">
                            <div class="xianyu-title">${item.title}</div>
                            <div class="xianyu-price">¥${item.price}</div>
                            <div class="xianyu-seller">${item.seller}</div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderTwitter(month, cp, rival) {
        const tweets = this.getTwitterPosts(cp);
        return `
            <div class="app-twitter">
                <div class="app-header twitter-header">
                    <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                    <span class="header-title">蓝鸟</span>
                </div>
                <div class="feed-section">
                    ${tweets.map((tweet, idx) => `
                    <div class="tweet-card" data-id="twitter-${idx}">
                        <div class="post-header">
                            <div class="post-avatar" style="background: ${tweet.avatarColor}"></div>
                            <div class="post-name">${tweet.name}</div>
                        </div>
                        <div class="post-content">${tweet.content}</div>
                        ${tweet.media ? `
                        <div class="media-placeholder">
                            <div class="media-icon">${this.icons.image}</div>
                            <div class="media-desc">[${tweet.media}]</div>
                        </div>
                        ` : ''}
                        <div class="post-actions">
                            <span>${this.icons.comment} ${tweet.comments}</span>
                            <span>${this.icons.share} ${tweet.reposts}</span>
                            <span class="action-like" data-id="twitter-${idx}">${this.icons.like} ${tweet.likes}</span>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderInstagram(month, cp, rival) {
        const posts = this.getInstagramPosts(cp);
        return `
            <div class="app-instagram">
                <div class="app-header ins-header">
                    <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                    <span class="header-title">SNI</span>
                </div>
                <div class="ins-feed">
                    ${posts.map((post, idx) => `
                    <div class="ins-card" data-id="ins-${idx}">
                        <div class="ins-header">
                            <div class="ins-avatar" style="background: ${post.avatarColor}"></div>
                            <span class="ins-username">${post.username}</span>
                        </div>
                        <div class="media-placeholder square">
                            <div class="media-icon">${this.icons.image}</div>
                            <div class="media-desc">[${post.imgDesc}]</div>
                        </div>
                        <div class="ins-actions">
                            <span class="action-like" data-id="ins-${idx}">${this.icons.like}</span>
                            ${this.icons.comment} ${this.icons.share}
                        </div>
                        <div class="ins-likes">${post.likes} 次赞</div>
                        <div class="ins-caption"><b>${post.username}</b> ${post.caption}</div>
                    </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // ========== 数据生成 ==========
    getWeiboHotSearches(cp, level) {
        const tagText = level.key === 'burning' ? '爆' : (level.key === 'hot' ? '热' : (level.key === 'warmHot' ? '沸' : ''));
        return [
            { text: `#${cp}官方发糖#`, tag: tagText ? 'hot' : '', tagText },
            { text: `#${cp}同人推荐#`, tag: 'new', tagText: '新' },
            { text: `#${cp}互动名场面#`, tag: '', tagText: '' },
            { text: `#同人女日常产出#`, tag: '', tagText: '' },
            { text: `#今日份甜饼#`, tag: '', tagText: '' },
            { text: `#原作党狂喜#`, tag: '', tagText: '' },
            { text: `#${cp}BE美学#`, tag: 'hot', tagText: '热' },
            { text: `#那些年我们追过的${cp}#`, tag: '', tagText: '' },
            { text: `#同人女现状调查#`, tag: '', tagText: '' },
            { text: `#${cp}瑞思拜#`, tag: '', tagText: '' }
        ];
    },

    getWeiboPosts(cp, level) {
        const templates = [
            { content: `${cp}太甜了救命！！！原作互动我直接原地去世`, media: `${cp}原作同框截图，两人眼神交汇` },
            { content: `新产出！${cp}咖啡店AU 日常小甜饼~`, media: `${cp}插画，现代AU咖啡店背景` },
            { content: `啊啊啊刚看完${cp}的BE结局我整个人裂开了`, media: `${cp}虐向同人图，雨中诀别` },
            { content: `产出预警！${cp}双向暗恋梗 破镜重圆 HE`, media: `${cp}手绘漫画封面，两人背靠背` },
            { content: `${cp}的病娇梗真的太绝了 黑化后更香`, media: `${cp}暗黑系同人图，A拥抱B` },
            { content: `如果有平行世界，希望${cp}一定要幸福啊`, media: `${cp}同框合影，樱花树下` },
            { content: `我宣布${cp}就是坠吊的！无人反驳！`, media: `${cp}原作动态截图` },
            { content: `救命...这个眼神...${cp}是真的在谈吧？`, media: `${cp}细节放大图` },
            { content: `冷圈产粮自割腿肉，求同担！#${cp}#`, media: `${cp}手稿草图` },
            { content: `大半夜被${cp}刀傻了，为什么要这样对他俩呜呜`, media: `${cp}玻璃渣预警插图` },
            { content: `这是什么绝美爱情...${cp}给我锁死！`, media: `${cp}同人Q版图` },
            { content: `原作终于更新了！${cp}同框了整整三秒！`, media: `${cp}新番截图` }
        ];
        return templates.map((t, i) => ({
            ...t,
            name: this.getRandomUsername('weibo'),
            time: (i + 1) + '小时前',
            avatarColor: i % 2 === 0 ? '#ff6b9d' : '#6b9dff',
            ...this.calcStats(),
            commentList: [
                { name: this.getRandomUsername('weibo'), text: '啊啊啊我也觉得！是真的！', time: '10分钟前', likes: 20 },
                { name: this.getRandomUsername('weibo'), text: '太太神仙产出，已关注', time: '5分钟前', likes: 15 }
            ]
        }));
    },

    getLofterWorks(cp) {
        const works = [
            { title: `「${cp}」日常小甜饼`, mediaDesc: `${cp}温馨同居画面` },
            { title: `「${cp}」破镜重圆`, mediaDesc: `人海中相望的两人` },
            { title: `「${cp}」双向暗恋`, mediaDesc: `A发现B日记本的秘密` },
            { title: `「${cp}」年龄差AU`, mediaDesc: `少年A与成年B的邂逅` },
            { title: `「${cp}」HE结局重写`, mediaDesc: `改变命运的那一个瞬间` },
            { title: `「${cp}」BE美学`, mediaDesc: `绝美刀子告别场景` },
            { title: `「${cp}」校园AU`, mediaDesc: `放学后的图书馆对视` },
            { title: `「${cp}」哨向设定`, mediaDesc: `精神体互相依偎` },
            { title: `「${cp}」如果你不曾离开`, mediaDesc: `IF线，平淡生活的剪影` },
            { title: `「${cp}」abo/年下/强制爱`, mediaDesc: `充满张力的同人封面` },
            { title: `「${cp}」神说要有光`, mediaDesc: `西幻AU，祭司与骑士` },
            { title: `「${cp}」赛博朋克下的吻`, mediaDesc: `霓虹灯火中的拥抱` }
        ];
        return works.map(w => ({
            ...w,
            author: this.getRandomUsername('lofter'),
            avatarColor: '#e8d5c4',
            ...this.calcStats()
        }));
    },

    getBilibiliVideos(cp) {
        const videos = [
            { title: `【${cp}】高甜混剪！心动警告！`, coverDesc: `${cp}原作名场面混剪` },
            { title: `【手书】${cp}的故事`, coverDesc: `手绘动画封面` },
            { title: `【AMV】虐向预警！刀死我了`, coverDesc: `黑白灰滤镜剪辑` },
            { title: `【${cp}】全员向/踩点剪辑`, coverDesc: `快节奏动感视频封面` },
            { title: `【考古】原作第一季其实早就有糖了`, coverDesc: `细节分析PPT风格封面` },
            { title: `【手办开箱】${cp}限定立牌太美了`, coverDesc: `实物拍摄展示图` },
            { title: `【MMD】${cp}一起跳舞吧`, coverDesc: `3D建模模型渲染图` },
            { title: `【配音剧】${cp}同人广播剧第一期`, coverDesc: `精美海报插画` },
            { title: `【冷梗科普】关于${cp}你不知道的细节`, coverDesc: `文字排版风格封面` },
            { title: `【绘画过程】${cp}同人图绘制分享`, coverDesc: `画师作画过程快进视频` },
            { title: `【翻唱/原创曲】给${cp}写的角色歌`, coverDesc: `曲绘美文封面` },
            { title: `【生肉剪贴】外网太太的${cp}神级剪辑`, coverDesc: `外语字幕视频封面` }
        ];
        return videos.map(v => ({
            ...v,
            up: this.getRandomUsername('bilibili'),
            duration: '03:45',
            views: '1.2万'
        }));
    },

    getAO3Works(cp) {
        const works = [
            { title: 'The Way We Were', tags: ['Modern AU', 'Happy Ending'], summary: 'If things hadn\'t changed, maybe they\'d be like this.' },
            { title: 'Silent Night', tags: ['Angst', 'Major Character Death'], summary: 'One final goodbye in the cold winter air.' },
            { title: 'Butterflies', tags: ['First Love', 'Fluff'], summary: 'That feeling when their hands first touched.' },
            { title: 'Rewrite the Stars', tags: ['Fantasy', 'Soulmates'], summary: 'Even the gods couldn\'t keep them apart.' },
            { title: 'The Long Run', tags: ['Slice of Life'], summary: 'Just another ordinary day in their lives together.' },
            { title: 'Fallen Leaves', tags: ['Missing Scene'], summary: 'What happened after that sunset conversation.' },
            { title: 'Endless Summer', tags: ['Beach AU'], summary: 'Sun, sand, and a promise that would last forever.' },
            { title: 'Broken Mirror', tags: ['Identity Crisis', 'Drama'], summary: 'A looking at the pieces that remain.' },
            { title: 'Velvet Ribbon', tags: ['Historical AU'], summary: 'Letters hidden in the library of a crumbling estate.' },
            { title: 'Neon Lights', tags: ['Cyberpunk'], summary: 'In a world of chrome, their love was the only thing real.' }
        ];
        const stats = this.calcStats();
        return works.map(w => ({
            ...w,
            author: this.getRandomUsername('ao3'),
            words: this.randomInRange(2000, 50000).toLocaleString(),
            kudos: this.randomInRange(50, 2000)
        }));
    },

    getXianyuItems(cp) {
        const items = [
            { title: `${cp}官方立牌 全新`, imgDesc: `原画版立牌，未拆封` },
            { title: `${cp}同人志 特典齐全`, imgDesc: `画师签绘版同人本` },
            { title: `${cp}亚克力挂件 绝版`, imgDesc: `限定场贩挂件` },
            { title: `${cp}抱枕套 特殊柄`, imgDesc: `双面印花抱枕` },
            { title: `${cp}应援手幅`, imgDesc: `演唱会现场派发款` },
            { title: `${cp}吧唧 镭射款`, imgDesc: `闪闪发光的吧唧` },
            { title: `${cp}官方场刊`, imgDesc: `剧场版限定手册` },
            { title: `${cp}棉花美娃 20cm`, imgDesc: `一对小可爱的棉花娃娃` },
            { title: `${cp}色纸 签绘版`, imgDesc: `精美原画色纸` },
            { title: `${cp}透明书历`, imgDesc: `非常有质感的周边` }
        ];
        return items.map(item => ({
            ...item,
            price: this.randomInRange(30, 300),
            seller: this.getRandomUsername('xianyu')
        }));
    },

    getTwitterPosts(cp) {
        const templates = [
            { content: `${cp}の新刊描き上がりました！`, media: `${cp}同人誌表紙イラスト` },
            { content: `${cp}推しと繋がりたい`, media: `${cp}デジタルイラスト` },
            { content: `今日の${cp}も最高でしたね...`, media: `${cp}落書き漫画` },
            { content: `${cp}の尊さを叫びたい`, media: `${cp}イメージイラスト` },
            { content: `コミケの新刊サンプルです #${cp}`, media: `${cp}誌面サンプル` },
            { content: `朝から${cp}のことしか考えてない`, media: `${cp}らくがき图` },
            { content: `${cp}が好きすぎてつらい`, media: `${cp}深夜のテンション絵` },
            { content: `ワンドロの${cp}です`, media: `${cp}60分一本勝負作品` },
            { content: `やっと${cp}ぬいが届いた！`, media: `${cp}ぬいぐるみ写真` },
            { content: `${cp}結婚して...`, media: `${cp}婚姻届風イラスト` }
        ];
        return templates.map(t => ({
            name: this.getRandomUsername('twitter'),
            avatarColor: '#1da1f2',
            ...t,
            ...this.calcStats()
        }));
    },

    getInstagramPosts(cp) {
        const templates = [
            { caption: `Finally finished! #${cp}`, imgDesc: `${cp} Cosplay photography` },
            { caption: `New merch arrived~`, imgDesc: `${cp} Merchandise collection` },
            { caption: `My fanart for ${cp}`, imgDesc: `${cp} Digital art display` },
            { caption: `Happy birthday ${cp}!`, imgDesc: `${cp} Birthday celebration layout` },
            { caption: `Itabag in progress...`, imgDesc: `${cp} Dedicated itabag` },
            { caption: `The cafe date AU ❤️`, imgDesc: `${cp} Fanart in a cafe setting` },
            { caption: `Missing them so much`, imgDesc: `${cp} Scene redraw` },
            { caption: `Look at this cutie!`, imgDesc: `${cp} Chibi art` },
            { caption: `Our local fan meet!`, imgDesc: `${cp} Group photo with posters` },
            { caption: `Details of the original manga`, imgDesc: `${cp} Close-up of manga pages` }
        ];
        return templates.map(t => ({
            username: this.getRandomUsername('instagram'),
            avatarColor: '#c13584',
            ...t,
            likes: this.randomInRange(100, 5000)
        }));
    }
};

function initApps() {
    if (typeof Apps !== 'undefined') {
        Apps.init();
    }
}

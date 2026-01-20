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

    // 同人女风格ID库
    usernames: {
        weibo: [
            '今天也在磕糖', '深夜产粮机器', '追更到天亮', '本命锁死', '冷圈自娱自乐',
            '熬夜画图人', '日更三千字', '摸鱼摸出海', '只吃不产', '太太的小跟班',
            '半夜爬墙党', '沙雕粉头', '肝完这章就睡', '氪金战士', '谷子收纳盒',
            '催更专业户', '坑底蹲守人', '混圈老油条', '退圈预备役', '圈地自萌中'
        ],
        lofter: [
            '月下听风眠', '星河入梦来', '墨染青衫客', '浮生若梦吟', '临窗小憩人',
            '孤舟蓑笠翁', '落花时节又', '清风徐来处', '半盏流年瘦', '烟雨江南客',
            '执笔绘长安', '素手调朱砂', '琉璃月下魂', '长歌当酒饮', '青灯古卷旁'
        ],
        bilibili: [
            '肝帝本帝', '咕咕咕鸽王', '三连求求了', '下次一定更', '混剪小能手',
            '手书画到秃', '鬼畜调教师', '弹幕护卫队', '硬币投手', '充电侠女装',
            '追番到凌晨', '补档考古人', '冷门安利王', '整活儿达人', '素材搬运工'
        ],
        ao3: [
            'midnightwriter', 'dreamweaver_cn', 'starlight_ink', 'moonlit_pages',
            'silent_observer', 'words_in_dark', 'coffee_and_keys', 'sleepless_muse'
        ],
        xianyu: [
            '谷子回血中', '出坑大甩卖', '周边清仓啦', '理性消费人', '吃土也要买',
            '求收留谷子', '血亏出周边', '二手本子铺', '挂件清理中', '再买剁手'
        ],
        twitter: [
            '夜行猫又', '星屑収集家', '月下の絵師', '夢見る文字書き', '静かな観察者',
            '深夜創作人', '孤独な蒐集家', 'ペン先の魔法', '物語紡ぎ手', '夜明けの読者'
        ],
        instagram: [
            'cos_planet', 'merch_heaven', 'daily_fandom', 'itabag_life', 'event_hunter',
            '谷圈快乐人', 'JK制服控', '痛包晒一晒', '展子选手', '拍照废人'
        ]
    },

    // App定义列表（提高解锁门槛）
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

    // 根据热度等级生成随机数据
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

    // 随机获取用户名
    getRandomUsername(platform) {
        const names = this.usernames[platform] || this.usernames.weibo;
        return names[Math.floor(Math.random() * names.length)];
    },

    // 初始化
    init() {
        this.createFloatingButton();
        this.createMenuPanel();
        this.createAppViewer();
        this.createToast();
        this.updateUnlockStatus();
    },

    // 检查解锁状态（提高门槛）
    updateUnlockStatus() {
        this.list.forEach(app => {
            switch (app.id) {
                case 'weibo':
                case 'lofter':
                case 'bilibili':
                    app.unlocked = true;
                    break;
                case 'ao3':
                    // 技术≥50 或 完成3篇作品
                    app.unlocked = (State.stats.tech >= 50) || (State.progress.works >= 3);
                    break;
                case 'xianyu':
                    // 消费≥15次 或 金钱≥5000
                    app.unlocked = ((State.actionCounts?.consume || 0) >= 15) || (State.stats.money >= 5000);
                    break;
                case 'twitter':
                    // 社交≥60 且 热度≥80
                    app.unlocked = (State.stats.social >= 60) && (State.stats.myHeat >= 80);
                    break;
                case 'instagram':
                    // 个人热度≥60
                    app.unlocked = (State.stats.myHeat >= 60);
                    break;
            }
        });
    },

    // 创建悬浮按钮
    createFloatingButton() {
        if (document.getElementById('app-fab')) return;
        const btn = document.createElement('div');
        btn.id = 'app-fab';
        btn.className = 'app-fab';
        btn.innerHTML = this.icons.menu;
        btn.onclick = () => this.toggleMenu();
        document.body.appendChild(btn);
    },

    // 创建菜单面板
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

    // ========== 围脖 ==========
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

    // ========== 老福特 ==========
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

    // ========== 小破站 ==========
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

    // ========== 3OA ==========
    renderAO3(month, cp, rival) {
        const works = this.getAO3Works(cp);

        return `
        <div class="app-ao3">
            <div class="app-header ao3-header">
                <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                <span class="header-title">我们自己的档案馆</span>
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

    // ========== 咸鱼 ==========
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

    // ========== 蓝鸟 ==========
    renderTwitter(month, cp, rival) {
        const tweets = this.getTwitterPosts(cp);

        return `
        <div class="app-twitter">
            <div class="app-header twitter-header">
                <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                <span class="header-title">蓝鸟</span>
            </div>
            
            <div class="tabs-bar dark">
                <span class="tab-item active">おすすめ</span>
                <span class="tab-item">フォロー中</span>
            </div>
            
            <div class="feed-section dark">
                ${tweets.map((t, idx) => this.renderPost({
            ...t,
            avatarColor: t.avatarColor,
            commentList: t.replies || []
        }, `twitter-${idx}`)).join('')}
            </div>
        </div>
        `;
    },

    // ========== SNI ==========
    renderInstagram(month, cp, rival) {
        const posts = this.getInstagramPosts(cp);

        return `
        <div class="app-instagram">
            <div class="app-header insta-header">
                <span class="header-back" onclick="Apps.closeApp()">${this.icons.back}</span>
                <span class="header-title insta-logo">SNI</span>
                <span class="header-actions">${this.icons.like} ${this.icons.send}</span>
            </div>
            
            <div class="stories-bar">
                <div class="story-item"><div class="story-ring"></div><span>私</span></div>
                <div class="story-item"><div class="story-ring"></div><span>絵師A</span></div>
                <div class="story-item"><div class="story-ring"></div><span>絵師B</span></div>
            </div>
            
            <div class="feed-section dark">
                ${posts.map((p, idx) => `
                <div class="insta-post" data-id="insta-${idx}">
                    <div class="post-header dark">
                        <div class="post-avatar" style="background: ${p.avatarColor}"></div>
                        <span class="post-name">${p.username}</span>
                    </div>
                    <div class="media-placeholder full-width">
                        <div class="media-icon">${this.icons.image}</div>
                        <div class="media-desc">[${p.imgDesc}]</div>
                    </div>
                    <div class="post-actions dark">
                        <button class="action-like" data-id="insta-${idx}">${this.icons.like}<span class="like-count">${p.likes}</span></button>
                        <button class="action-btn">${this.icons.comment}</button>
                        <button class="action-share">${this.icons.share}</button>
                        <button class="action-bookmark">${this.icons.bookmark}</button>
                    </div>
                    <div class="insta-caption">
                        <span class="cap-user">${p.username}</span> ${p.caption}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        `;
    },

    // ========== 数据生成（二次元IP同人） ==========
    getWeiboHotSearches(cp, level) {
        const tagText = level.key === 'burning' ? '爆' : (level.key === 'hot' ? '热' : (level.key === 'warmHot' ? '沸' : ''));
        return [
            { text: `#${cp}官方发糖#`, tag: tagText ? 'hot' : '', tagText },
            { text: `#${cp}同人推荐#`, tag: 'new', tagText: '新' },
            { text: `#${cp}互动名场面#`, tag: '', tagText: '' },
            { text: `#同人女日常产出#`, tag: '', tagText: '' },
            { text: `#今日份甜饼#`, tag: '', tagText: '' }
        ];
    },

    getWeiboPosts(cp, level) {
        const stats1 = this.calcStats();
        const stats2 = this.calcStats();
        // 同人经典梗内容
        const contentTemplates = [
            { content: `${cp}太甜了救命！！！原作互动我直接原地去世`, media: `${cp}原作同框截图，两人眼神交汇那一幕` },
            { content: `新产出！${cp}咖啡店AU 日常小甜饼~甜到掉牙那种`, media: `${cp}同人插画，现代AU咖啡店场景，A在给B系围裙` },
            { content: `啊啊啊刚看完${cp}的BE结局我整个人裂开了`, media: `${cp}虐向同人图，雨中诀别场景` },
            { content: `产出预警！${cp}双向暗恋梗 破镜重圆 HE结局`, media: `${cp}手绘漫画封面，两人背靠背站立` },
            { content: `${cp}的病娇梗真的太绝了 黑化后更香`, media: `${cp}暗黑系同人图，A紧紧拥抱着B` }
        ];
        const template1 = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
        const template2 = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];

        return [
            {
                name: this.getRandomUsername('weibo'),
                time: '刚刚',
                avatarColor: '#ff6b9d',
                content: template1.content,
                media: template1.media,
                likes: stats1.likes,
                comments: stats1.comments,
                reposts: stats1.reposts,
                commentList: [
                    {
                        name: this.getRandomUsername('weibo'),
                        text: '啊啊啊啊我也觉得好甜！原作党狂喜！',
                        time: '5分钟前',
                        avatarColor: '#6b9dff',
                        likes: this.randomInRange(level.comments[0], level.comments[1]),
                        replies: [
                            { name: this.getRandomUsername('weibo'), text: '疯狂点头！这对永远的白月光', time: '3分钟前', likes: this.randomInRange(1, 10) },
                            { name: this.getRandomUsername('weibo'), text: '锁死锁死！', time: '2分钟前', likes: this.randomInRange(1, 5) }
                        ]
                    },
                    { name: this.getRandomUsername('weibo'), text: '太太产粮了！我哭着收藏', time: '10分钟前', avatarColor: '#9dff6b', likes: this.randomInRange(5, 30) }
                ]
            },
            {
                name: this.getRandomUsername('weibo'),
                time: '10分钟前',
                avatarColor: '#6b9dff',
                content: template2.content,
                media: template2.media,
                likes: stats2.likes,
                comments: stats2.comments,
                reposts: stats2.reposts,
                commentList: [
                    { name: this.getRandomUsername('weibo'), text: '太太神仙产出！已关注已收藏', time: '8分钟前', avatarColor: '#ff9d6b', likes: this.randomInRange(10, 50) }
                ]
            }
        ];
    },

    getLofterWorks(cp) {
        const stats1 = this.calcStats();
        const stats2 = this.calcStats();
        // 二次元同人经典题材
        const works = [
            { title: `「${cp}」日常小甜饼`, mediaDesc: `${cp}同居日常，一起做饭的温馨画面` },
            { title: `「${cp}」破镜重圆`, mediaDesc: `多年后重逢，两人隔着人海相望` },
            { title: `「${cp}」双向暗恋`, mediaDesc: `A发现B的日记本里写满了自己的名字` },
            { title: `「${cp}」年龄差AU`, mediaDesc: `青涩的少年时期的A遇见成年后的B` },
            { title: `「${cp}」HE结局重写`, mediaDesc: `如果那时候选择了另一条路` },
            { title: `「${cp}」BE美学`, mediaDesc: `绝美刀子，最后的告别场景` },
            { title: `「${cp}」校园AU`, mediaDesc: `放学后的图书馆，两人隔着书架对视` }
        ];
        const w1 = works[Math.floor(Math.random() * works.length)];
        const w2 = works[Math.floor(Math.random() * works.length)];
        return [
            {
                title: w1.title,
                author: this.getRandomUsername('lofter'),
                avatarColor: '#e8d5c4',
                mediaDesc: w1.mediaDesc,
                likes: stats1.likes,
                comments: stats1.comments
            },
            {
                title: w2.title,
                author: this.getRandomUsername('lofter'),
                avatarColor: '#c4d5e8',
                mediaDesc: w2.mediaDesc,
                likes: stats2.likes,
                comments: stats2.comments
            }
        ];
    },

    getBilibiliVideos(cp) {
        const stats1 = this.calcStats();
        const stats2 = this.calcStats();
        const videos = [
            { title: `【${cp}】高甜混剪！心动警告！`, coverDesc: `${cp}原作名场面混剪封面，播放键特效` },
            { title: `【手书】${cp}的故事`, coverDesc: `手绘动画封面，${cp}并肩站立` },
            { title: `【${cp}】这对真的锁死了！双向奔赴`, coverDesc: `${cp}互动细节考据合集` },
            { title: `【AMV】${cp} - 刀向心动`, coverDesc: `虐向剪辑封面，暗色调` },
            { title: `【${cp}】冷知识科普 你不知道的细节`, coverDesc: `${cp}粉必看设定考据` }
        ];
        const v1 = videos[Math.floor(Math.random() * videos.length)];
        const v2 = videos[Math.floor(Math.random() * videos.length)];
        return [
            {
                title: v1.title,
                up: this.getRandomUsername('bilibili'),
                coverDesc: v1.coverDesc,
                duration: '03:42',
                views: this.formatNumber(stats1.views)
            },
            {
                title: v2.title,
                up: this.getRandomUsername('bilibili'),
                coverDesc: v2.coverDesc,
                duration: '02:15',
                views: this.formatNumber(stats2.views)
            }
        ];
    },

    getAO3Works(cp) {
        const stats1 = this.calcStats();
        const stats2 = this.calcStats();
        // AO3经典tag
        const works = [
            { title: '星河入梦来', tags: [cp, '甜文', '双向暗恋', 'HE'], summary: '你是我没说出口的秘密，是我夜夜梦见的星光...' },
            { title: '破镜重圆', tags: [cp, '重逢', '年下', 'HE'], summary: '三年后的机场，我以为再也不会见到你...' },
            { title: '月光落在肩头', tags: [cp, '暗恋', '日久生情', 'HE'], summary: '每天都在偷偷看你，却不敢让你发现...' },
            { title: '深海的鱼', tags: [cp, 'BE', '虐', '意难平'], summary: '我爱你，但我们注定是两个世界的人...' },
            { title: '咖啡馆的下午', tags: [cp, '现代AU', '甜文'], summary: '那个每天点美式的客人，今天终于问了我的名字...' }
        ];
        const w1 = works[Math.floor(Math.random() * works.length)];
        const w2 = works[Math.floor(Math.random() * works.length)];
        return [
            {
                title: w1.title,
                author: this.getRandomUsername('ao3'),
                tags: w1.tags,
                summary: w1.summary,
                words: (Math.floor(Math.random() * 20) + 3) + ',234',
                kudos: stats1.likes
            },
            {
                title: w2.title,
                author: this.getRandomUsername('ao3'),
                tags: w2.tags,
                summary: w2.summary,
                words: (Math.floor(Math.random() * 30) + 5) + ',890',
                kudos: stats2.likes
            }
        ];
    },

    getXianyuItems(cp) {
        // 二次元周边类型
        const items = [
            { title: `${cp}官方周边 立牌`, imgDesc: `${cp}官方立牌，全新未拆封` },
            { title: `${cp}同人本 全新特典版`, imgDesc: `${cp}同人志封面，彩印精装本` },
            { title: `${cp}亚克力挂件 整套`, imgDesc: `${cp}Q版亚克力挂件一套` },
            { title: `${cp}定制抱枕套`, imgDesc: `${cp}双面印花抱枕套` },
            { title: `${cp}手幅 场贩限定`, imgDesc: `${cp}应援手幅，现场限定款` },
            { title: `${cp}海报 B2尺寸`, imgDesc: `${cp}高清海报，官方图柄` }
        ];
        return items.slice(0, 4).map(item => ({
            ...item,
            price: this.randomInRange(28, 168),
            seller: this.getRandomUsername('xianyu')
        }));
    },

    getTwitterPosts(cp) {
        const stats = this.calcStats();
        const contents = [
            { content: `${cp}の新作イラスト完成！三日かかったけど満足です`, media: `${cp}同人イラスト、ロマンチックな夕暮れシーン` },
            { content: `${cp}のファンアート描きました！いいねくれると嬉しい`, media: `${cp}デジタル絵、ふたりで本を読む場面` },
            { content: `${cp}について考えすぎて眠れない...好きすぎる`, media: `${cp}落書き、ちびキャラ版` }
        ];
        const c = contents[Math.floor(Math.random() * contents.length)];
        return [
            {
                name: this.getRandomUsername('twitter'),
                time: '2時間前',
                avatarColor: '#1da1f2',
                content: c.content,
                media: c.media,
                likes: stats.likes,
                comments: stats.comments,
                reposts: stats.reposts
            }
        ];
    },

    getInstagramPosts(cp) {
        const stats1 = this.calcStats();
        const stats2 = this.calcStats();
        const posts = [
            { imgDesc: `${cp}コスプレ撮影、再現度高い二人組`, caption: `ついにコス完成！#${cp.replace(/\s/g, '')} #コスプレ` },
            { imgDesc: `${cp}グッズ開封、机いっぱいの宝物`, caption: '新しいグッズ届いた！嬉しい' },
            { imgDesc: `${cp}同人誌の表紙、美しい装丁`, caption: '新刊できました！' }
        ];
        const p1 = posts[Math.floor(Math.random() * posts.length)];
        const p2 = posts[Math.floor(Math.random() * posts.length)];
        return [
            {
                username: this.getRandomUsername('instagram'),
                avatarColor: '#c13584',
                imgDesc: p1.imgDesc,
                likes: stats1.likes,
                caption: p1.caption
            },
            {
                username: this.getRandomUsername('instagram'),
                avatarColor: '#6b9dff',
                imgDesc: p2.imgDesc,
                likes: stats2.likes,
                caption: p2.caption
            }
        ];
    }
};

function initApps() {
    if (typeof Apps !== 'undefined') {
        Apps.init();
    }
}

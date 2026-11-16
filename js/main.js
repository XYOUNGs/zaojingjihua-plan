/* ========== 造境计划 公共交互脚本 ========== */

/* ---------- 主题切换：深色 / 浅色 / 跟随系统 ---------- */
const THEME_KEY = 'zaojing-theme';
const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function getMode() {
    return localStorage.getItem(THEME_KEY) || 'system';
}

function applyTheme() {
    const mode = getMode();
    let resolved = mode;
    if (mode === 'system') {
        resolved = systemDark.matches ? 'dark' : 'light';
    }
    root.dataset.theme = resolved;
    updateThemeButton(mode);
}

function cycleTheme() {
    const mode = getMode();
    const next = mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme();
}

const themeIcons = {
    dark: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>',
    light: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    system: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>'
};

function updateThemeButton(mode) {
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
        btn.innerHTML = themeIcons[mode];
        btn.setAttribute('aria-label', '当前主题：' + ({ dark: '深色', light: '浅色', system: '跟随系统' })[mode]);
    });
}

document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', cycleTheme);
});
systemDark.addEventListener('change', () => { if (getMode() === 'system') applyTheme(); });
applyTheme();

/* ---------- 滚动显现动画 ---------- */
const revealElements = document.querySelectorAll('.scroll-reveal');
function revealIfVisible(el) {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('active');
}
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    revealElements.forEach((el) => observer.observe(el));
} else {
    revealElements.forEach((el) => el.classList.add('active'));
}
// 脚本就绪即判一次视口内元素；滚动时再自行补判，避免只依赖观察器回调
revealElements.forEach(revealIfVisible);
function onRevealScroll() { revealElements.forEach(revealIfVisible); }
window.addEventListener('scroll', onRevealScroll, { passive: true });

// 首屏淡入元素兜底：不依赖动画是否播放完成
document.querySelectorAll('.fade-in-up').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
});
window.addEventListener('load', () => {
    revealElements.forEach(revealIfVisible);
    document.querySelectorAll('.fade-in-up').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
});

/* ---------- 导航栏滚动毛玻璃 ---------- */
const navbar = document.getElementById('navbar');
function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', onScroll);
onScroll();

/* ---------- 移动端菜单 ---------- */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
}

/* ---------- 作品案例分类筛选 ---------- */
const filterButtons = document.querySelectorAll('[data-filter]');
const workItems = document.querySelectorAll('[data-category]');
filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterButtons.forEach((b) => { b.style.borderColor = ''; b.style.color = ''; });
        btn.style.borderColor = 'var(--gold)';
        btn.style.color = 'var(--gold)';
        workItems.forEach((item) => {
            const cat = item.getAttribute('data-category');
            item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
        });
    });
});

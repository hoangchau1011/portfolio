import { projects } from './data.js';

import { loadRepos } from './repos.js';

const state = document.querySelector('#repos-state');
const list = document.querySelector('#repo-list');

function repoCard(r) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = r.url;
    a.textContent = r.name;
    const p = document.createElement('p');
    p.textContent = `★ ${r.stars} · ${r.desc}`;
    li.append(a, p);
    return li;
}

const ul = document.querySelector(
    '#project-list');
const tpl = document.querySelector(
    '#project-card');

function render(data) {
    ul.textContent = '';

    if (data.length === 0) {
        ul.textContent = 'Không có dự án phù hợp';
        return;
    }

    for (const p of data) {
        const li = tpl.content.cloneNode(true);
        li.querySelector('h3').textContent = p.title;
        li.querySelector('.tags').textContent = p.tags.join(', ');
        ul.append(li);
    }
}
// console.log("I am hereeeeeeeeeee")
render(projects);

const uniqueTags = [...new Set(projects.flatMap(project => project.tags))];
const filterContainer = document.querySelector('#filters');

filterContainer.innerHTML = '';

const allTagsToRender = ['all', ...uniqueTags];

for (const tag of allTagsToRender) {
    const button = document.createElement('button');

    button.classList.add('button');
    button.textContent = tag === 'all' ? 'Tất cả' : tag;
    button.dataset.tag = tag;

    filterContainer.append(button);
}

const tags = [...new Set(
    projects.flatMap((p) => p.tags),
)];
const bar = document.querySelector(
    '#filters');


bar.addEventListener('click', (e) => {
    const tag = e.target.dataset.tag;
    if (!tag) return;

    const filtered = tag === 'all'
        ? projects
        : projects.filter((p) =>
            p.tags.includes(tag));


    render(filtered);
});

const search = document.querySelector('#search');
search.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const filtered = projects.filter((p) =>
        p.title.toLowerCase().includes(search));
    render(filtered);
});

const toggle = document.querySelector('#theme-toggle');
const root = document.documentElement;

const updateToggleIcon = (isDark) => {
    toggle.innerHTML = isDark
        ? '<span>☀️️</span> Đổi nền'
        : '<span>🌙</span> Đổi nền';
};

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    root.classList.add('dark');
    updateToggleIcon(true);
} else {
    updateToggleIcon(false);
}

toggle.addEventListener('click', () => {
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateToggleIcon(isDark);
});

const contactForm = document.querySelector('#contact form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.querySelector('#email');
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const oldMessage = contactForm.querySelector('.form-message');
    if (oldMessage) {
        oldMessage.remove();
    }

    const messageEl = document.createElement('p');
    messageEl.classList.add('form-message');
    messageEl.style.marginTop = '1rem';
    messageEl.style.fontWeight = 'bold';

    if (!emailRegex.test(emailValue)) {
        messageEl.textContent = '❌ Email không hợp lệ. Vui lòng kiểm tra lại!';
        messageEl.style.color = '#ef4444';
    } else {
        messageEl.textContent = '✅ Gửi liên hệ thành công! Cảm ơn bạn.';
        messageEl.style.color = '#10b981';
        contactForm.reset();
    }

    contactForm.appendChild(messageEl);
});

async function showRepos(user) {
    state.textContent = 'Đang tải…';
    list.textContent = '';
    try {
        const repos = await loadRepos(user);
        state.textContent = repos.length ? ''
            : 'Chưa có repo công khai.';
        repos.forEach((r) => list.append(repoCard(r)));
    } catch (err) {
        state.textContent = 'Không tải được: ' + err.message;
        const again = document.createElement('button');
        again.textContent = 'Thử lại';
        again.onclick = () => showRepos(user);
        state.append(again);
    }
}
showRepos('hoangchau1011');

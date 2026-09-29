import { projects } from './data.js';

const ul = document.querySelector(
    '#project-list');
const tpl = document.querySelector(
    '#project-card');

function render(list) {
    ul.textContent = '';
    for (const p of list) {
        const li = tpl.content
            .cloneNode(true);
        li.querySelector('h3')
            .textContent = p.title;
        li.querySelector('.project-tags')
            .textContent = p.tags.join(', ');
        ul.append(li);
    }
}
console.log("I am hereeeeeeeeeee")
render(projects);
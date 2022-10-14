/* eslint-disable no-undef */

import { create } from "./create.js";

document.querySelector('#close').addEventListener('click', () => {
    window.close();
});

mermaid.mermaidAPI.initialize({
    startOnLoad: false,
});

const diagram = document.querySelector('#diagram');

/**
 * @param {string} graphDefinition
 */
function render(graphDefinition) {
    mermaid.mermaidAPI.render('svg', graphDefinition, function (svgString) {
        diagram.innerHTML = svgString;
    });
}

const KEY = 'state-diagram-input';

const string = localStorage.getItem(KEY);

if (string == null) {
    const a = document.createElement('a');
    a.href = '../../index.html';
    a.textContent = 'APGsembly Emulator';
    diagram.textContent = '';
    const span = document.createElement('span');
    span.textContent = 'Go To ';
    span.style.marginRight = '4px';
    diagram.append(span);
    diagram.append(a);
} else {
    render(create(string));
    localStorage.removeItem(KEY);
}

// const input = document.querySelector('#input');

// input.addEventListener('input', () => {
//     try {
//         const graphDefinition = create(input.value);
//         render(graphDefinition);
//         input.classList.remove('is-invalid');
//     } catch (error) {
//         input.classList.add('is-invalid');
//     }
// });

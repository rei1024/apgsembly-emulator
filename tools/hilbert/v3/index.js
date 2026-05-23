// import { generateInfiniteHilbertPureLoop } from "./hilbert.js";

// import { generateInfiniteHilbert } from "./hilbert_rec.js";

import { generateInfiniteHilbertCorrect } from "./hilbert_bit.js";

/** @type {HTMLCanvasElement} */
const $canvas = document.querySelector("#canvas");
const ctx = $canvas.getContext("2d");

let x = 0;
let y = 0;

function draw() {
    ctx.fillStyle = "black";
    const cell = 32;
    ctx.fillRect(x * cell, y * cell, cell, cell);
}

function xPlus() {
    draw();
    x++;
    draw();
    x++;
}
function yPlus() {
    draw();
    y++;
    draw();
    y++;
}
function xMinus() {
    draw();
    x--;
    draw();
    x--;
}
function yMinus() {
    draw();
    y--;
    draw();
    y--;
}

const hilbertGen = generateInfiniteHilbertCorrect();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
let currentDirection = 0;
function move(c) {
    switch (c) {
        case "+": {
            currentDirection = (currentDirection + 1) % 4;
            break;
        }

        case "-": {
            currentDirection = (currentDirection + 3) % 4;
            break;
        }

        case "F": {
            const [dx, dy] = direction[currentDirection];
            x += dx;
            y += dy;
            draw();
            x += dx;
            y += dy;
            draw();
            break;
        }
    }
}

const chars = [];
let interval = 1; // 128;
async function main() {
    for (let i = 0; i < (4 ** Infinity) - 1; i++) {
        await delay(interval);
        const c = hilbertGen.next().value;
        chars.push(c);
        move(c);
    }
}

main();

let scale = 1;

const $scaleDown = document.querySelector("#scale-down");
$scaleDown.addEventListener("click", () => {
    scale = scale / 2;
    interval = interval / 16;
    fixRender();
    if (scale < 1 / 16) {
        $scaleDown.disabled = true;
    }
});

function fixRender() {
    ctx.reset();
    ctx.scale(scale, scale);
    const tempX = x;
    const tempY = y;
    x = 0;
    y = 0;
    for (const c of chars) {
        move(c);
    }
    x = tempX;
    y = tempY;
}

import { infiniteHilbertWordGenerator } from "./hilbert.js";

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

const hilbertGen = infiniteHilbertWordGenerator();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function move(c) {
    switch (c) {
        case "u": {
            yPlus();
            break;
        }
        case "d": {
            yMinus();
            break;
        }
        case "l": {
            xMinus();
            break;
        }
        case "r": {
            xPlus();
            break;
        }
    }
}

let chars = [];
let interval = 128;
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
    let tempX = x;
    let tempY = y;
    x = 0;
    y = 0;
    for (const c of chars) {
        move(c);
    }
    x = tempX;
    y = tempY;
}

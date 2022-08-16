// @ts-check

import { Machine } from "../src/Machine.js";
import { Program } from "../src/Program.js";
import { piCalculator } from "./pi_calculator.js";

// deno run --allow-hrtime test/benchmark.js
// node test/benchmark.js

const N = 1000000;

const program = Program.parse(piCalculator);
if (typeof program === 'string') {
    throw Error('error');
}

function run() {
    const machine = new Machine(program);
    for (let i = 0; i < N; i++) {
        try {
            const res = machine.execCommand();
            if (res === -1) {
                break;
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    const exp = '3.141';
    const act = machine.actionExecutor.output.getString();
    if (exp !== act) {
        throw Error('error' + act);
    }
}

Deno.bench('pi', () => {
    run();
});

// const obj = { x: { y: 1 }, y: { y: 1 }, z: { y: 1 } };
// const map = new Map([[1, { y: 1 } ], [2, { y: 1 } ], [3, { y: 1 } ]]);
// Deno.bench({
//     name: 'object',
//     fn() {
//         obj.x.y++;
//     },
//     group: 'test'
// });

// Deno.bench({
//     name: 'map',
//     fn() {
//         // @ts-ignore
//         map.get(1).y++;
//     },
//     group: 'test'
// });
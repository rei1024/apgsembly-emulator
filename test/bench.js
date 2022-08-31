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

// class X {
//     constructor() {
//         this.value = 0;
//     }
//     x() {
//         switch (this.value) {
//             case 0: {
//                 this.value = 1;
//                 break;
//             }
//             case 1: {
//                 this.value = 0;
//                 break;
//             }
//         }
//     }

//     y() {
//         switch (this.value) {
//             case 0: {
//                 this._do1();
//                 break;
//             }
//             case 1: {
//                 this._do2();
//                 break;
//             }
//         }
//     }

//     _do1() {
//         this.value = 1;
//     }

//     _do2() {
//         this.value = 0;
//     }
// }

// const o1 = new X();
// Deno.bench({
//     name: 'inline',
//     fn() {
//         o1.x();
//     },
//     group: 'test'
// });

// const o2 = new X();
// Deno.bench({
//     name: 'non-inline',
//     fn() {
//         o2.y();
//     },
//     group: 'test'
// });

// ---------
// const len = 130;
// const rep = 10000;
// const objectArray = Array(len).fill(0).map(() => ({ z: 0, nz: 0 }));
// const array = Array(len * 2).fill(0).map(() => 0);
// const uint32Array = new Uint32Array(len * 2);

// Deno.bench({
//     name: 'objectArray',
//     fn() {
//         for (let j = 0; j < rep; j++) {
//             for (let i = 0; i < len; i++) {
//                 objectArray[i].z++;
//             }
//             for (let i = 0; i < len; i++) {
//                 objectArray[i].nz++;
//             }
//         }
//     },
//     group: 'test'
// });

// Deno.bench({
//     name: 'array',
//     fn() {
//         for (let j = 0; j < rep; j++) {
//             for (let i = 0; i < len; i++) {
//                 array[i * 2]++;
//             }
//             for (let i = 0; i < len; i++) {
//                 array[i * 2 + 1]++;
//             }
//         }
//     },
//     group: 'test'
// });

// Deno.bench({
//     name: 'typed',
//     fn() {
//         for (let j = 0; j < rep; j++) {
//             for (let i = 0; i < len; i++) {
//                 uint32Array[i * 2]++;
//                 uint32Array[i * 2 + 1]++;
//             }
//         }
//     },
//     group: 'test'
// });

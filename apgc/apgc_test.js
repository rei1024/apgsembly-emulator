import { assertEquals } from "../test/deps.js";
import { main } from "./apgc.js";

/**
 * 
 * @param {string} name 
 * @param {() => void} fn 
 */
function test(name, fn) {
    Deno.test(name, fn);
}

test('apgc main output("1");', () => {
    assertEquals(main(`output("1");`), 
`INITIAL; *; STATE_1; OUTPUT 1, NOP
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main', () => {
    assertEquals(main(``), 
`INITIAL; *; INITIAL; HALT_OUT`);
});

test('apgc main output("1"); output("2")', () => {
    assertEquals(main(`output("1"); output("2");`), 
`INITIAL; *; STATE_1; OUTPUT 1, NOP
STATE_1; *; STATE_2; OUTPUT 2, NOP
STATE_2; *; STATE_2; HALT_OUT`);
});

test('apgc main inc_u(0)', () => {
    assertEquals(main(`inc_u(0);`),
`INITIAL; *; STATE_1; INC U0, NOP
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main if_zero tdec_u', () => {
    const input = `
    if_zero(tdec_u(0)) {
        output("1");
    } else {
        output("2");
    }`
    const output = `INITIAL; *; STATE_1; TDEC U0
STATE_1; Z; STATE_2; NOP
STATE_1; NZ; STATE_3; NOP
STATE_2; *; STATE_4; OUTPUT 1, NOP
STATE_3; *; STATE_5; OUTPUT 2, NOP
STATE_4; *; STATE_6; NOP
STATE_5; *; STATE_6; NOP
STATE_6; *; STATE_6; HALT_OUT`
    assertEquals(main(input), output);
});

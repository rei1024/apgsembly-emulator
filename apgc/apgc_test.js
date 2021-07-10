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

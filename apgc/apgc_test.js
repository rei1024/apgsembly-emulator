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

test('apgc main empty', () => {
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

test('apgc main tdec_u(0)', () => {
    assertEquals(main(`tdec_u(0);`),
`INITIAL; *; STATE_1; TDEC U0
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main inc_b(0)', () => {
    assertEquals(main(`inc_b(0);`),
`INITIAL; *; STATE_1; INC B0, NOP
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main tdec_b(0)', () => {
    assertEquals(main(`tdec_b(0);`),
`INITIAL; *; STATE_1; TDEC B0
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main read_b(0)', () => {
    assertEquals(main(`read_b(0);`),
`INITIAL; *; STATE_1; READ B0
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main set_b(0)', () => {
    assertEquals(main(`set_b(0);`),
`INITIAL; *; STATE_1; SET B0, NOP
STATE_1; *; STATE_1; HALT_OUT`);
});


test('apgc main inc_b2dx()', () => {
    assertEquals(main(`inc_b2dx();`),
`INITIAL; *; STATE_1; INC B2DX, NOP
STATE_1; *; STATE_1; HALT_OUT`);
});


test('apgc main inc_b2dy()', () => {
    assertEquals(main(`inc_b2dy();`),
`INITIAL; *; STATE_1; INC B2DY, NOP
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main tdec_b2dx()', () => {
    assertEquals(main(`tdec_b2dx();`),
`INITIAL; *; STATE_1; TDEC B2DX
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main tdec_b2dy()', () => {
    assertEquals(main(`tdec_b2dy();`),
`INITIAL; *; STATE_1; TDEC B2DY
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main read_b2d()', () => {
    assertEquals(main(`read_b2d();`),
`INITIAL; *; STATE_1; READ B2D
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main set_b2d()', () => {
    assertEquals(main(`set_b2d();`),
`INITIAL; *; STATE_1; SET B2D, NOP
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main add_a1()', () => {
    assertEquals(main(`add_a1();`),
`INITIAL; *; STATE_1; ADD A1, NOP
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main add_b0()', () => {
    assertEquals(main(`add_b0();`),
`INITIAL; *; STATE_1; ADD B0
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main add_b1()', () => {
    assertEquals(main(`add_b1();`),
`INITIAL; *; STATE_1; ADD B1
STATE_1; *; STATE_1; HALT_OUT`);
});

test('apgc main sub_a1()', () => {
    assertEquals(main(`sub_a1();`),
`INITIAL; *; STATE_1; SUB A1, NOP
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

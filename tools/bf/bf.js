// @ts-check

// BF interpreter
// # Registers
// B0: Code
// B1: Input
// B2: Data
//
// # Code Format
// 0000: End of Code
// 1000: '>'
// 1001: '<'
// 1010: '+'
// 1011: '-'
// 1100: '.'
// 1101: ','
// 1110: '['
// 1111: ']'
//
// # Input format
// 8 bits array
//
// # Data format
// 8 bits array

const BYTE = 8;

/**
 * @param {string} code
 */
function generateCodeRegister(code) {
  const chars = [...code];
  const nums = [];
  for (const char of chars) {
    switch (char) {
      case ">":
        nums.push(0b1000);
        break;
      case "<":
        nums.push(0b1001);
        break;
      case "+":
        nums.push(0b1010);
        break;
      case "-":
        nums.push(0b1011);
        break;
      case ".":
        nums.push(0b1100);
        break;
      case ",":
        nums.push(0b1101);
        break;
      case "[":
        nums.push(0b1110);
        break;
      case "]":
        nums.push(0b1111);
        break;
    }
  }

  const bitStrs = nums.map((num) => num.toString(2).padStart(4, "0"));

  return bitStrs.join("");
}

/**
 * @param {{ code: string, input: string }} param0
 * @returns
 */
export function generateBFCode({
  code,
}) {
  /**
   * @type {string[]}
   */
  const lines = [];
  /**
   * @param {string} line
   */
  function pushLine(line) {
    lines.push(line);
  }

  {
    pushLine(`# Code`);
    const codeLines = code.split("\n");
    for (const [i, codeLine] of codeLines.entries()) {
      pushLine(`# ${codeLine}`);
    }
    pushLine(`# End of Code`);
  }

  pushLine(`#COMPONENTS B0,B2`);
  pushLine(`#REGISTERS { "B0": [0, "${generateCodeRegister(code)}"] }`);
  pushLine(`INITIAL; ZZ; SWITCH_CODE; NOP`);
  pushLine(`SWITCH_CODE; *;    SWITCH_CODE_BIT; READ B0`);
  pushLine(`SWITCH_CODE_BIT; Z; SWITCH_CODE_BIT; HALT`); // End of Code
  pushLine(`SWITCH_CODE_BIT; NZ;     SWITCH_CODE_BIT_1_SET; SET B0, NOP`);
  pushLine(`SWITCH_CODE_BIT_1_SET; ZZ;     SWITCH_CODE_BIT_1; INC B0, NOP`);

  /**
   * @param {string} bitStr
   * @param {{ isOperation?: boolean}} [options]
   */
  function pushByBitStr(bitStr, { isOperation = false } = {}) {
    const next = isOperation ? "OP" : "READ";
    pushLine(
      `SWITCH_CODE_BIT_${bitStr}_READ; ZZ; SWITCH_CODE_BIT_${bitStr}; READ B0`,
    );
    pushLine(
      `SWITCH_CODE_BIT_${bitStr}; Z;  SWITCH_CODE_BIT_${bitStr}0_${next}; INC B0, NOP`,
    );
    pushLine(
      `SWITCH_CODE_BIT_${bitStr}; NZ; SWITCH_CODE_BIT_${bitStr}1_SET; SET B0, NOP`,
    );
    pushLine(
      `SWITCH_CODE_BIT_${bitStr}1_SET; ZZ; SWITCH_CODE_BIT_${bitStr}1_${next}; INC B0, NOP`,
    );
  }

  const bitStr = `1`;
  pushByBitStr(bitStr);
  for (let b1 = 0; b1 < 2; b1++) {
    const bitStr = `1${b1}`;
    pushByBitStr(bitStr);
    for (let b2 = 0; b2 < 2; b2++) {
      const bitStr = `1${b1}${b2}`;
      pushByBitStr(bitStr, { isOperation: true });
    }
  }

  // '>' operation
  pushLine(`\n# '>' operation`);
  pushLine(`SWITCH_CODE_BIT_1000_OP; ZZ; OP_POINTER_NEXT_0; INC B2, NOP`); // '>'
  // move 8 bits
  for (let i = 0; i < BYTE - 1; i++) {
    pushLine(
      `OP_POINTER_NEXT_${i}; ZZ; ${
        i === BYTE - 2 ? `SWITCH_CODE` : `OP_POINTER_NEXT_${i + 1}`
      }; INC B2, NOP`,
    );
  }

  // '<' operation
  pushLine(`\n# '<' operation`);
  pushLine(`SWITCH_CODE_BIT_1001_OP; ZZ; OP_POINTER_PREV_0; TDEC B2`); // '<'
  // move 8 bits
  for (let i = 0; i < BYTE - 1; i++) {
    pushLine(
      `OP_POINTER_PREV_${i}; *; ${
        i === BYTE - 2 ? `SWITCH_CODE` : `OP_POINTER_PREV_${i + 1}`
      }; TDEC B2`,
    );
  }

  // mock
  pushLine(`SWITCH_CODE_BIT_1010_OP; ZZ; SWITCH_CODE_BIT_1010_OP; NOP`);
  pushLine(`SWITCH_CODE_BIT_1011_OP; ZZ; SWITCH_CODE_BIT_1011_OP; NOP`);
  pushLine(`SWITCH_CODE_BIT_1100_OP; ZZ; SWITCH_CODE_BIT_1100_OP; NOP`);
  pushLine(`SWITCH_CODE_BIT_1101_OP; ZZ; SWITCH_CODE_BIT_1101_OP; NOP`);
  pushLine(`SWITCH_CODE_BIT_1110_OP; ZZ; SWITCH_CODE_BIT_1110_OP; NOP`);
  pushLine(`SWITCH_CODE_BIT_1111_OP; ZZ; SWITCH_CODE_BIT_1111_OP; NOP`);

  return lines.join("\n");
}

console.log(generateBFCode({ code: `>>>><<>>`, input: `` }));

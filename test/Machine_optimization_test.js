// @ts-check

/* eslint-disable camelcase */

// deno test test/Machine_optimization_test.js

import { Machine } from "../src/Machine.js";
import { Program } from "../src/Program.js";
import { assertEquals, test } from "./deps.js";

test("Machine Binary Optimization", () => {
    const program = Program.parse(`
#REGISTERS { "U1": 1, "U7": 10, "B1": [0, "001"] }
INITIAL;  ZZ;  MULA16; TDEC U1

MULA16;  Z;  MULA20; TDEC B3
MULA16;  NZ; MULA17; READ B3
MULA17;  Z;  MULA18; READ B1
MULA17;  NZ; MULA18; READ B1, SET B3, ADD A1
MULA18;  Z;  MULA19; ADD B0
MULA18;  NZ; MULA19; ADD B1
MULA19;  Z;  MULA16; TDEC U7, INC B1, INC B3
MULA19;  NZ; MULA19; SET B1, NOP

MULA20; *; FINAL; NOP
FINAL; *; FINAL2; INC U7, NOP
FINAL2; *; FINAL; HALT_OUT
`);
    if (!(program instanceof Program)) {
        throw Error("parse error: " + program);
    }

    /**
     * @param {number} index
     * @param {Machine} machine
     */
    function getStats(index, machine) {
        return {
            index,
            stepCount: machine.stepCount,
            currentState: machine.getNextCommand().command.pretty(),
            prevOutput: machine.prevOutput,
            // FIXME: if large causes out of memory
            // stateStats: machine.getStateStats(),
            b01Bits: machine.actionExecutor.getBReg(1)?.getBits().slice(),
            b1Pointer: machine.actionExecutor.getBReg(1)?.pointer,
            u7Value: machine.actionExecutor.getUReg(7)?.getValue(),
        };
    }

    const resNormal = [];
    let resExec = [];
    const N = 100;

    {
        const machine = new Machine(program);

        for (let i = 0; i < N; i++) {
            const res = machine.execCommand();
            if (res === -1) {
                break;
            }
            resNormal.push(getStats(i, machine));
        }
    }

    {
        for (let i = 0; i < N; i++) {
            const machine = new Machine(program);
            machine.exec(i + 1, false, -1, 0);
            resExec.push(getStats(i, machine));
        }
        resExec = resExec.slice(0, resNormal.length);
    }

    assertEquals(resNormal.length, resExec.length);
    //    assertEquals(resNormal, resExec);
});

// @ts-check

import { ActionExecutor } from '../src/ActionExecutor.js';
import { assertEquals, test, assertThrows } from './deps.js';

test('ActionExecutor output', () => {
    const x = new ActionExecutor({
        unaryRegisterNumbers: [],
        binaryRegisterNumbers: [],
        legacyTRegisterNumbers: [],
    });
    x.output.output('3');
    assertEquals(x.output.getString(), '3');
});

test('ActionExecutor setByRegistersInit empty', () => {
    const x = new ActionExecutor({
        unaryRegisterNumbers: [],
        binaryRegisterNumbers: [],
        legacyTRegisterNumbers: [],
    });
    x.setByRegistersInit({});
});

test('ActionExecutor setByRegistersInit', () => {
    const x = new ActionExecutor({
        unaryRegisterNumbers: [0, 1],
        binaryRegisterNumbers: [0, 1],
        legacyTRegisterNumbers: [],
    });

    assertEquals(x.uRegMap.size, 2);
    assertEquals(x.bRegMap.size, 2);

    x.setByRegistersInit({ B0: [0, '11010001'], B1: [2, '110'], U0: 8 });
    assertEquals(
        [...x.getBReg(0).toBinaryString()].reverse().join(''),
        '11010001'
    );
    assertEquals(x.getBReg(0).pointer, 0);
    assertEquals(
        [...x.getBReg(1).toBinaryString()].reverse().join(''),
        '110'
    );
    assertEquals(x.getBReg(1).pointer, 2);
    assertEquals(x.getUReg(0).getValue(), 8);

    x.getUReg(0).inc();
    assertEquals(x.getUReg(0).getValue(), 9);
});

test('ActionExecutor setByRegistersInit', () => {
    const x = new ActionExecutor({
        unaryRegisterNumbers: [0, 1],
        binaryRegisterNumbers: [0, 1],
        legacyTRegisterNumbers: [],
    });

    assertEquals(x.uRegMap.size, 2);
    assertEquals(x.bRegMap.size, 2);

    x.setByRegistersInit({ B0: 11 });
    assertEquals(
        [...x.getBReg(0).toBinaryString()].reverse().join(''),
        '1101'
    );
    assertEquals(x.getBReg(0).pointer, 0);
});

test('ActionExecutor setByRegistersInit error', () => {
    const x = new ActionExecutor({
        unaryRegisterNumbers: [0, 1],
        binaryRegisterNumbers: [0, 1],
        legacyTRegisterNumbers: [],
    });

    assertEquals(x.uRegMap.size, 2);
    assertEquals(x.bRegMap.size, 2);

    assertThrows(() => {
        x.setByRegistersInit({ U0: [0, '11'] });
    });

    assertThrows(() => {
        x.setByRegistersInit({ "U-1": 1 });
    });

    assertThrows(() => {
        // @ts-ignore
        x.setByRegistersInit({ U0: true });
    });

    assertThrows(() => {
        x.setByRegistersInit({ U0: null });
    });

    assertThrows(() => {
        // @ts-ignore
        x.setByRegistersInit({ U0: "11" });
    });

    assertThrows(() => {
        // @ts-ignore
        x.setByRegistersInit({ B0: [0, 5] });
    });

    assertThrows(() => {
        // @ts-ignore
        x.setByRegistersInit({ B0: ['3', '11'] });
    });
});

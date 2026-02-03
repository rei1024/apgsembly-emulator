// @ts-check

import { assertEquals, assertThrows, test } from "../../test/deps.js";
import { parseComponentsHeader } from "./parseComponentsHeader.js";

/**
 * @param {string} str
 */
function parse(str) {
    return { components: parseComponentsHeader(str) };
}

test("parseComponentsHeader", () => {
    assertEquals(
        parse("B0-5, U0-5, U8-9, ADD, SUB, MUL, OUTPUT, PRINTER"),
        {
            components: [
                "B0",
                "B1",
                "B2",
                "B3",
                "B4",
                "B5",
                "U0",
                "U1",
                "U2",
                "U3",
                "U4",
                "U5",
                "U8",
                "U9",
                "ADD",
                "SUB",
                "MUL",
                "OUTPUT",
                "PRINTER",
            ],
        },
    );
});

test("parseComponentsHeader CLOCK", () => {
    assertEquals(
        parse("CLOCK2^20"),
        {
            components: [],
        },
    );
});

test("parseComponentsHeader Error B", () => {
    assertThrows(() => {
        parse("B");
    });

    assertThrows(() => {
        parse("B2-");
    });

    assertThrows(() => {
        parse("B-3");
    });
});

test("parseComponentsHeader Error large range value", () => {
    assertThrows(() => {
        parse("B100-102");
    });

    assertThrows(() => {
        parse("B98-102");
    });

    assertThrows(() => {
        parse("U100-102");
    });
});

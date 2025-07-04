// @ts-check

import { ADD_A1 } from "../../src/action_consts/Add_consts.js";
import { AddAction } from "../../src/actions/AddAction.js";
import { ADD } from "../../src/components/ADD.js";
import { assertEquals, test, throwError } from "../deps.js";

test("ADD a1", () => {
    const x = new ADD();
    assertEquals(x.a1(), undefined);
    assertEquals(x.getValue(), 1);
});

test("ADD a1 toString", () => {
    const x = new ADD();
    assertEquals(x.a1(), undefined);
    assertEquals(x.toString(), "01");
});

test("ADD a1 toStringDetail", () => {
    const x = new ADD();
    assertEquals(x.a1(), undefined);
    assertEquals(x.toStringDetail(), "01");
});

test("ADD a1 twice", () => {
    const x = new ADD();
    x.a1();
    x.a1();
    assertEquals(x.getValue(), 2);
});

test("ADD b0", () => {
    const x = new ADD();
    assertEquals(x.b0(), 0);
    assertEquals(x.getValue(), 0);
});

test("ADD b1", () => {
    const x = new ADD();
    assertEquals(x.b1(), 1);
    assertEquals(x.getValue(), 0);
});

test("ADD complex", () => {
    const x = new ADD();
    x.a1();
    assertEquals(x.getValue(), 1);
    x.b1();
    x.a1();
    assertEquals(x.getValue(), 2);
});

// action
test("ADD action", () => {
    const x = new ADD();
    const act = AddAction.parse("ADD A1");
    if (act === undefined) {
        throw Error("Parse Error AddAction");
    }
    assertEquals(act.pretty(), "ADD A1");
    assertEquals(act.op, ADD_A1);
    assertEquals(x.getValue(), 0);

    x.action(act);

    assertEquals(x.getValue(), 1);
    x.action(AddAction.parse("ADD B1") ?? throwError());
    x.action(AddAction.parse("ADD A1") ?? throwError());

    assertEquals(x.getValue(), 2);
});

test("ADD test", () => {
    const x = new ADD();
    x.a1();
    assertEquals(x.getValue(), 1);
    x.b0();
    assertEquals(x.getValue(), 0);
    x.b1();
    assertEquals(x.getValue(), 0);
    x.a1();
    assertEquals(x.getValue(), 1);
    x.a1();
    assertEquals(x.getValue(), 2);
    x.a1();
    assertEquals(x.getValue(), 3);
    x.b1();
    assertEquals(x.getValue(), 0);
    x.a1();
    assertEquals(x.getValue(), 1);
    x.a1();
    assertEquals(x.getValue(), 2);
});

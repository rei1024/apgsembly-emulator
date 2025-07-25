// @ts-check

import { B2DAction } from "../../src/actions/B2DAction.js";
import { B2D } from "../../src/components/B2D.js";
import { assertEquals, assertThrows, test, throwError } from "../deps.js";

test("B2D constructor", () => {
    const x = new B2D();
    assertEquals(x.getArray(), [[0]]);
    assertEquals(x.x, 0);
    assertEquals(x.y, 0);
});

test("B2D read initial", () => {
    const x = new B2D();
    assertEquals(x.read(), 0);
});

test("B2D set read", () => {
    const x = new B2D();
    x.set();
    assertEquals(x.read(), 1);
});

test("B2D set read twice", () => {
    const x = new B2D();
    x.set();
    assertEquals(x.read(), 1);
    assertEquals(x.read(), 0);
});

test("B2D incB2DX", () => {
    const x = new B2D();
    assertEquals(x.incB2DX(), undefined);
    assertEquals(x.x, 1);
    assertEquals(x.y, 0);

    assertEquals(x.getArray(), [[0, 0]]);
});

test("B2D incB2DY", () => {
    const x = new B2D();
    assertEquals(x.getMaxX(), 0);
    assertEquals(x.getMaxY(), 0);
    assertEquals(x.incB2DY(), undefined);
    assertEquals(x.x, 0);
    assertEquals(x.y, 1);
    assertEquals(x.getMaxX(), 0);
    assertEquals(x.getMaxY(), 1);
    assertEquals(x.getArray(), [[0], [0]]);
});

test("B2D tdec X", () => {
    const x = new B2D();
    assertEquals(x.incB2DX(), undefined);
    assertEquals(x.x, 1);
    assertEquals(x.y, 0);
    assertEquals(x.getMaxX(), 1);

    assertEquals(x.tdecB2DX(), 1);
    assertEquals(x.x, 0);
    assertEquals(x.y, 0);
    assertEquals(x.getMaxX(), 1);
});

test("B2D tdec Y", () => {
    const x = new B2D();
    assertEquals(x.incB2DY(), undefined);
    assertEquals(x.x, 0);
    assertEquals(x.y, 1);
    assertEquals(x.tdecB2DY(), 1);
    assertEquals(x.x, 0);
    assertEquals(x.y, 0);
});

test("B2D tdec 0", () => {
    const x = new B2D();
    assertEquals(x.tdecB2DX(), 0);
    assertEquals(x.tdecB2DY(), 0);
    assertEquals(x.x, 0);
    assertEquals(x.y, 0);
});

test("B2D incB2DX set", () => {
    const x = new B2D();
    assertEquals(x.incB2DX(), undefined);
    assertEquals(x.x, 1);
    assertEquals(x.y, 0);
    x.set();
    assertEquals(x.read(), 1);
});

test("B2D incB2DX read", () => {
    const x = new B2D();
    assertEquals(x.incB2DX(), undefined);
    assertEquals(x.x, 1);
    assertEquals(x.y, 0);
    assertEquals(x.read(), 0);
});

test("B2D incB2DX read", () => {
    const x = new B2D();
    assertEquals(x.incB2DX(), undefined);
    assertEquals(x.incB2DY(), undefined);
    assertEquals(x.x, 1);
    assertEquals(x.y, 1);
    assertEquals(x.read(), 0);
});

test("B2D incB2DX read set", () => {
    const x = new B2D();
    x.incB2DX();
    x.incB2DY();
    assertEquals(x.read(), 0);
    x.set();
    assertEquals(x.read(), 1);
    assertEquals(x.read(), 0);
});

test("B2D set Error", () => {
    const x = new B2D();
    x.set();
    assertThrows(() => {
        x.set();
    });
});

// action
test("B2D action INC B2DX", () => {
    const x = new B2D();
    x.action(B2DAction.parse("INC B2DX") ?? throwError());
    assertEquals(x.x, 1);
    assertEquals(x.y, 0);
});

test("B2D action INC B2DY", () => {
    const x = new B2D();
    x.action(B2DAction.parse("INC B2DY") ?? throwError());
    assertEquals(x.x, 0);
    assertEquals(x.y, 1);
});

test("B2D action TDEC B2DX", () => {
    const x = new B2D();
    const res = x.action(B2DAction.parse("TDEC B2DX") ?? throwError());
    assertEquals(res, 0);
    const inc = B2DAction.parse("INC B2DX") ?? throwError();
    x.action(inc);
    x.action(inc);
    assertEquals(x.x, 2);
    const res2 = x.action(B2DAction.parse("TDEC B2DX") ?? throwError());
    assertEquals(res2, 1);
    assertEquals(x.x, 1);
});

test("B2D action TDEC B2DY", () => {
    const x = new B2D();
    const res = x.action(B2DAction.parse("TDEC B2DY") ?? throwError());
    assertEquals(res, 0);
});

test("B2D action READ B2D", () => {
    const x = new B2D();
    const res = x.action(B2DAction.parse("READ B2D") ?? throwError());
    assertEquals(res, 0);
});

test("B2D action SET B2D", () => {
    const x = new B2D();
    const res = x.action(B2DAction.parse("SET B2D") ?? throwError());
    assertEquals(res, undefined);
    assertEquals(x.read(), 1);
});

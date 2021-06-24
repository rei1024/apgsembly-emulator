import { UReg } from "../../src/components/UReg.js"
import { assertEquals } from "../deps.js";

Deno.test("UReg tdec", () => {
    const x = new UReg();
    assertEquals(x.getValue(), 0);
    assertEquals(x.tdec(), 0);
    assertEquals(x.getValue(), 0);
    assertEquals(x.tdec(), 0);
    assertEquals(x.getValue(), 0);
});

Deno.test("UReg inc", () => {
    const x = new UReg();
    assertEquals(x.getValue(), 0);
    x.inc();
    assertEquals(x.getValue(), 1);
    assertEquals(x.tdec(), 1);
    assertEquals(x.getValue(), 0);
    assertEquals(x.tdec(), 0);
    assertEquals(x.getValue(), 0);
});

Deno.test("UReg inc twice", () => {
    const x = new UReg();
    assertEquals(x.getValue(), 0);
    x.inc();
    assertEquals(x.getValue(), 1);
    x.inc();
    assertEquals(x.getValue(), 2);
    x.tdec();
    assertEquals(x.getValue(), 1);
});

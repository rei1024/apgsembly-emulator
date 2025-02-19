// @ts-check

import { HaltOutAction } from "../../src/actions/HaltOutAction.js";
import { assertEquals, test } from "../deps.js";

test("parse HALT_OUT", () => {
    assertEquals(HaltOutAction.parse("HALT_OUT")?.pretty(), "HALT_OUT");
});

test("parse HALT", () => {
    assertEquals(HaltOutAction.parse("HALT")?.pretty(), "HALT");
});

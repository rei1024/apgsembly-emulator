import { transpile } from "./transpile.js";
import { test, assertEquals } from "../test/deps.js";

test('transpile', () => {
    const strOrError = transpile(`#COMPONENTS U0-3,HALT_OUT
    #REGISTERS {"U0":7, "U1":5}
    # State Input Next state Actions
    # ---------------------------------------
    INITIAL; ZZ; ID1; TDEC U0

    # Loop over U0, TDECing it until it hits 0, and then halt.
    ID1; Z; ID1; HALT_OUT
    ID1; NZ; ID2; TDEC U1

    # Copy U1 into U3 while setting U1 = 0.
    ID2; Z; ID3; TDEC U3
    ID2; NZ; ID2; TDEC U1, INC U3

    # Loop over U3, adding its value to U1 (restoring it) and U2.
    ID3; Z; ID1; TDEC U0
    ID3; NZ; ID3; TDEC U3, INC U1, INC U2`);
    assertEquals(strOrError instanceof Error, false);
});

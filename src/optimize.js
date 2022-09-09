import { URegAction, U_INC, U_TDEC } from "./actions/URegAction.js";
import { Command } from "./Command.js";

/**
 *
 * @param {Command} z
 * @param {Command} nz
 */
export function isUnaryRegisterTdecCommand(z, nz) {
    if (z.input !== 'Z') {
        return null;
    }

    if (nz.input !== 'NZ') {
        return null;
    }

    if (z.state !== nz.state) {
        return null;
    }

    if (nz.nextState !== nz.state) {
        return null;
    }

    if (z.actions.length !== 1) {
        return null;
    }

    const nzActions = nz.actions;

    const nzURegActions = nzActions.flatMap(action => action instanceof URegAction ? [action] : []);
    const nzTdecActions = nzURegActions.filter(action => action.op === U_TDEC);
    // const nzIncActions = nzURegActions.filter(action => action.op === U_INC);

    if (nzTdecActions.length !== 1) {
        return null;
    }

    const zURegActions = z.actions.flatMap(action => action instanceof URegAction ? [action] : []);
    // const zTdecActions = zURegActions.filter(action => action.op === U_TDEC);
    // const zIncActions = zURegActions.filter(action => action.op === U_INC);

    const tdecUNumber = nzTdecActions[0].regNumber;
    if (zURegActions.some(a => a.regNumber === tdecUNumber)) {
        return null;
    }

    return {
        regNumber: tdecUNumber,
        zActions: z.actions,
        nzActions: nzActions.filter(!(x => x instanceof URegAction && x.regNumber === tdecUNumber))
    };
}
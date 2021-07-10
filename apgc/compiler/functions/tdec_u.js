// @ts-check
import { Command, URegAction, U_TDEC } from "../../apgc_deps.js";
import { FunctionCallStatement, NumberExpression } from "../../types/apgc_types.js";
import { APGCCompiler } from "../apgc_compiler.js";

/**
 * tdec_u(3)
 * @param {APGCCompiler} ctx 
 * @param {string} inputState
 * @param {FunctionCallStatement} statement 
 * @returns {string}
 */
export function compileTDECU(ctx, inputState, statement) {
    if (statement.args.length !== 1) {
        throw Error('tdec_u argments length is not 1');
    }
    const arg = statement.args[0];
    if (!(arg instanceof NumberExpression)) {
        throw Error('tdec_u only accepts number');
    }
    if (arg.value < 0) {
        throw Error('tdec_u argment is negtive');
    }
    const nextState = ctx.generateState();
    const command = new Command({
        state: inputState,
        input: "*",
        nextState: nextState,
        actions: [new URegAction(U_TDEC, arg.value)]
    });
    ctx.addCommand(command);
    return nextState;
}

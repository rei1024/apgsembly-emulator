// @ts-check
import { Command, URegAction, U_INC, NopAction } from "../../apgc_deps.js";
import { FunctionCallExpression, NumberExpression } from "../../types/apgc_types.js";
import { APGCCompiler } from "../apgc_compiler.js";

/**
 * inc_u(3)
 * @param {APGCCompiler} ctx 
 * @param {string} inputState
 * @param {FunctionCallExpression} callExpr 
 * @returns {string} outputState
 */
export function compileINCU(ctx, inputState, callExpr) {
    if (callExpr.args.length !== 1) {
        throw Error('inc_u argments length is not 1');
    }
    const arg = callExpr.args[0];
    if (!(arg instanceof NumberExpression)) {
        throw Error('inc_u only accepts number');
    }
    if (arg.value < 0) {
        throw Error('inc_u argment is negtive');
    }
    const nextState = ctx.generateState();
    const command = new Command({
        state: inputState,
        input: "*",
        nextState: nextState,
        actions: [new URegAction(U_INC, arg.value), new NopAction()]
    });
    ctx.addCommand(command);
    return nextState;
}

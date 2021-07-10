// @ts-check
import { Command, URegAction, U_INC, NopAction } from "../../apgc_deps.js";
import { FunctionCallStatement, NumberExpression } from "../../types/apgc_types.js";
import { APGCCompiler } from "../apgc_compiler.js";

/**
 * inc_u(3)
 * @param {APGCCompiler} ctx 
 * @param {string} inputState
 * @param {FunctionCallStatement} statement 
 * @returns {string}
 */
export function compileINCU(ctx, inputState, statement) {
    if (statement.args.length !== 1) {
        throw Error('inc_u argments length is not 1');
    }
    const arg = statement.args[0];
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

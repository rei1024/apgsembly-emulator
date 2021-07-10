// @ts-check
import { Command } from "../../../src/Command.js";
import { FunctionCallStatement, NumberExpression } from "../../types/apgc_types.js";
import { APGCCompiler } from "../apgc_compiler.js";
import { URegAction } from "../../../src/actions/URegAction.js";
import { NopAction } from "../../../src/actions/NopAction.js";

/**
 * 
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
        actions: [new URegAction("INC", arg.value), new NopAction()]
    });
    ctx.commands.push(command);
    return nextState;
}

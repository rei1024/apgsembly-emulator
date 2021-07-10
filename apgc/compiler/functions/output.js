// @ts-check

import { NopAction } from "../../../src/actions/NopAction.js";
import { OutputAction } from "../../../src/actions/OutputAction.js";
import { Command } from "../../../src/Command.js";
import { FunctionCallStatement, StringExpression } from "../../types/apgc_types.js";
import { APGCCompiler } from "../apgc_compiler.js";

/**
 * 
 * @param {APGCCompiler} ctx 
 * @param {string} inputState
 * @param {FunctionCallStatement} statement 
 * @returns {string}
 */
export function compileOutput(ctx, inputState, statement) {
    if (statement.args.length === 1) {
        const arg = statement.args[0];
        if (arg instanceof StringExpression) {
            const nextState = ctx.generateState();
            const command = new Command({
                state: inputState,
                input: "*",
                nextState: nextState,
                actions: [new OutputAction(arg.string), new NopAction()]
            });
            ctx.commands.push(command);
            return nextState;
        } else {
            throw Error('output accepts only string')
        }
    } else {
        throw Error('output argments length is not 1');
    }
}

// @ts-check
import {
    HaltOutAction,
    NopAction,
    URegAction,
    U_INC,
    U_TDEC,
    Command,
} from "../apgc_deps.js";

import {
    APGCExpressionStatement,
    APGCProgram,
    APGCStatement,
    APGCStatements,
    FunctionCallExpression,
    IfZeroStatement,
    WhileNonZeroStatement
} from "../types/apgc_types.js";
import { compileOutput } from "./functions/output.js";
import { compileSingleNumberArgmentFunction } from "./functions/single_number_argment_function.js";

export class APGCCompiler {
    /**
     * 
     * @param {APGCProgram} program 
     */
    constructor(program) {
        /**
         * @readonly
         */
        this.program = program;

        /**
         * @type {Command[]}
         */
        this.commands = [];

        this.id = 0;
    }

    /**
     * 
     * @param {Command} command 
     */
    addCommand(command) {
        this.commands.push(command);
    }

    /**
     * @returns {Command[]}
     */
    compile() {
        const inputState = "INITIAL";
        const outputState = this.compileStatements(inputState, this.program.apgcStatements);
        this.addCommand(new Command({
            state: outputState,
            nextState: outputState,
            input: "*",
            actions: [new HaltOutAction()]
        }));
        return this.commands;
    }

    /**
     * @param {string} inputState
     * @param {APGCStatements} apgcStatements 
     * @returns {string} outputState
     */
    compileStatements(inputState, apgcStatements) {
        for (const statement of apgcStatements.statements) {
            inputState = this.compileStatement(inputState, statement)
        }
        return inputState;
    }

    /**
     * 
     * @returns {string}
     */
    generateState() {
        this.id++;
        return "STATE_" + this.id;
    }

    /**
     * @param {string} inputState
     * @param {FunctionCallExpression} expr 
     * @returns {string} outputState
     */
    compileFunctionCallExpression(inputState, expr) {
        switch (expr.name) {
            case "output": return compileOutput(this, inputState, expr);
            case "inc_u": return compileSingleNumberArgmentFunction(
                this, inputState, expr, n => [new URegAction(U_INC, n), new NopAction()]
            );
            case "tdec_u": return compileSingleNumberArgmentFunction(
                this, inputState, expr, n => [new URegAction(U_TDEC, n)]
            );
        }
        throw Error(`unkown function "${expr.name}"`);
    }

    /**
     * @param {string} inputState
     * @param {APGCStatement} statement 
     * @returns {string} outputState
     */
    compileStatement(inputState, statement) {
        if (statement instanceof APGCExpressionStatement) {
            const expr = statement.expr;
            if (expr instanceof FunctionCallExpression) {
                return this.compileFunctionCallExpression(inputState, expr);
            } else {
                throw Error('only function call expression can be statement');
            }
        } else if (statement instanceof IfZeroStatement) {
            return compileIfZeroStatement(this, inputState, statement);
        } else if (statement instanceof WhileNonZeroStatement) {
            return compileWhileNonZeroStatement(this, inputState, statement);
        } else {
            throw Error('unkown statement ' + statement);
        }
    }
}

/**
 *
 * @param {APGCCompiler} ctx 
 * @param {string} inputState 
 * @param {IfZeroStatement} statement 
 * @returns {string} outputState
 */
function compileIfZeroStatement(ctx, inputState, statement) {
    const expr = statement.expr;
    if (!(expr instanceof FunctionCallExpression)) {
        throw Error('if_zero only accept function call');
    }
    const ifState = ctx.compileFunctionCallExpression(inputState, expr);

    const ifZeroState = ctx.generateState();
    const ifNonZeroState = ctx.generateState();
    const ifCommandZero = new Command({
        state: ifState,
        input: "Z",
        nextState: ifZeroState,
        actions: [new NopAction()]
    });
    ctx.addCommand(ifCommandZero)
    const ifCommandNonZero = new Command({
        state: ifState,
        input: "NZ",
        nextState: ifNonZeroState,
        actions: [new NopAction()]
    });
    ctx.addCommand(ifCommandNonZero);

    const zeroCommandOutputState = ctx.compileStatements(ifZeroState, statement.zeroStatements);
   
    const nonZeroCommandOutputState = ctx.compileStatements(ifNonZeroState, statement.nonZeroStataments);

    const finalState = ctx.generateState();

    const finalCommandZero = new Command({
        state: zeroCommandOutputState,
        input: "*",
        nextState: finalState,
        actions: [new NopAction()]
    });
    ctx.addCommand(finalCommandZero);
    const finalCommandNonZero = new Command({
        state: nonZeroCommandOutputState,
        input: "*",
        nextState: finalState,
        actions: [new NopAction()]
    });
    ctx.addCommand(finalCommandNonZero);
    return finalState;
}

/**
 * 
 * @param {APGCCompiler} ctx 
 * @param {string} inputState 
 * @param {WhileNonZeroStatement} statement 
 * @returns {string} outputState
 */
function compileWhileNonZeroStatement(ctx, inputState, statement) {
    const expr = statement.expr;
    if (!(expr instanceof FunctionCallExpression)) {
        throw Error('while_non_zero only accept function call');
    }
    const whileState = ctx.compileFunctionCallExpression(inputState, expr);

    const ifNonZeroState = ctx.generateState();
    const finalState = ctx.generateState();

    const ifCommandZero = new Command({
        state: whileState,
        input: "Z",
        nextState: finalState,
        actions: [new NopAction()]
    });
    ctx.addCommand(ifCommandZero)
    const ifCommandNonZero = new Command({
        state: whileState,
        input: "NZ",
        nextState: ifNonZeroState,
        actions: [new NopAction()]
    });
    ctx.addCommand(ifCommandNonZero);

    const statementsOutputState = ctx.compileStatements(ifNonZeroState, statement.statements);

    const continueCommand = new Command({
        state: statementsOutputState,
        input: "*",
        nextState: inputState,
        actions: [new NopAction()]
    });
    ctx.addCommand(continueCommand);
    return finalState;
}

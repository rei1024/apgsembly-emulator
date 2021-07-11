// @ts-check
import {
    Action,
    HaltOutAction,
    NopAction,
    // U
    URegAction,
    U_INC,
    U_TDEC,
    // B
    BRegAction,
    B_INC,
    B_TDEC,
    B_READ,
    B_SET,
    // B2D
    B2DAction,
    B2D_INC,
    B2D_TDEC,
    B2D_READ,
    B2D_SET,
    B2D_B2DX,
    B2D_B2DY,
    B2D_B2D,
    // ADD
    AddAction,
    ADD_A1,
    ADD_B0,
    ADD_B1,
    // SUB
    SubAction,
    SUB_A1,
    SUB_B0,
    SUB_B1,
    // MUL
    MulAction,
    MUL_0,
    MUL_1,
    Command,
} from "../apgc_deps.js";

import {
    APGCExpressionStatement,
    APGCProgram,
    APGCStatement,
    APGCStatements,
    FunctionCallExpression,
    IfZeroStatement,
    StringExpression,
    WhileNonZeroStatement
} from "../types/apgc_types.js";
import { compileOutput } from "./functions/output.js";
import { compileEmptyArgmentFunction } from "./functions/empty_argment_function.js";
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
        const apgcInitialState = "INITIAL";
        const outputState = this.compileStatements(apgcInitialState, this.program.apgcStatements);
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
        const __this__ = this;
        /**
         * 
         * @param {(_: number) => Action[]} actions 
         * @returns {string}
         */
        function single(actions) {
            return compileSingleNumberArgmentFunction(__this__, inputState, expr, actions);
        }

        /**
         * 
         * @param {Action[]} actions 
         */
        function empty(actions) {
            return compileEmptyArgmentFunction(__this__, inputState, expr, actions);
        }

        switch (expr.name) {
            case "label": return compileLabel(this, inputState, expr);
            case "goto": return compileGoto(this, inputState, expr);

            case "output": return compileOutput(this, inputState, expr);
            // U
            case "inc_u": return single(n => [new URegAction(U_INC, n), new NopAction()]);
            case "tdec_u": return single(n => [new URegAction(U_TDEC, n)]);
            // B
            case "inc_b": return single(n => [new BRegAction(B_INC, n), new NopAction()]);
            case "tdec_b": return single(n => [new BRegAction(B_TDEC, n)]);
            case "read_b": return single(n => [new BRegAction(B_READ, n)]);
            case "set_b": return single(n => [new BRegAction(B_SET, n), new NopAction()]);
            // B2D
            case "inc_b2dx": return empty([new B2DAction(B2D_INC, B2D_B2DX), new NopAction()]);
            case "inc_b2dy": return empty([new B2DAction(B2D_INC, B2D_B2DY), new NopAction()]);
            case "tdec_b2dx": return empty([new B2DAction(B2D_TDEC, B2D_B2DX)]);
            case "tdec_b2dy": return empty([new B2DAction(B2D_TDEC, B2D_B2DY)]);
            case "read_b2d": return empty([new B2DAction(B2D_READ, B2D_B2D)]);
            case "set_b2d": return empty([new B2DAction(B2D_SET, B2D_B2D), new NopAction()]);
            // ADD
            case "add_a1": return empty([new AddAction(ADD_A1), new NopAction()]);
            case "add_b0": return empty([new AddAction(ADD_B0)]);
            case "add_b1": return empty([new AddAction(ADD_B1)]);
            // SUB
            case "sub_a1": return empty([new SubAction(SUB_A1), new NopAction()]);
            case "sub_b0": return empty([new SubAction(SUB_B0)]);
            case "sub_b1": return empty([new SubAction(SUB_B1)]);
            // MUL
            case "mul_0": return empty([new MulAction(MUL_0)]);
            case "mul_1": return empty([new MulAction(MUL_1)]);
            // NOP
            case "nop": return empty([new NopAction()]);
            // HALT_OUT
            case "halt_out": return empty([new HaltOutAction()]);
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

const LABEL_PREFIX = "APGC_LABEL_";

/**
 * @param {APGCCompiler} ctx 
 * @param {string} inputState 
 * @param {FunctionCallExpression} expr 
 * @returns {string} outputState
 */
function compileLabel(ctx, inputState, expr) {
    if (expr.args.length !== 1) {
        throw Error('label argments length is not 1');
    }
    const arg = expr.args[0];
    if (!(arg instanceof StringExpression)) {
        throw Error('label argments accepts only strings');
    }
    const labelState = LABEL_PREFIX + arg.string;
    const nextState = ctx.generateState();
    ctx.addCommand(new Command({
        state: inputState,
        input: "*",
        nextState: nextState,
        actions: [new NopAction()]
    }));
    ctx.addCommand(new Command({
        state: labelState,
        input: "*",
        nextState: nextState,
        actions: [new NopAction()]
    }));
    return nextState;
}

const UNREACHABLE_PREFIX =  "APGC_UNREACHABLE_";

/**
 * @param {APGCCompiler} ctx 
 * @param {string} inputState 
 * @param {FunctionCallExpression} expr 
 * @returns {string} unreachable state
 */
function compileGoto(ctx, inputState, expr) {
    if (expr.args.length !== 1) {
        throw Error('goto argments length is not 1');
    }
    const arg = expr.args[0];
    if (!(arg instanceof StringExpression)) {
        throw Error('goto argments accepts only strings');
    }
    const nextState = LABEL_PREFIX + arg.string;
    ctx.addCommand(new Command({
        state: inputState,
        input: "*",
        nextState: nextState,
        actions: [new NopAction()]
    }));
    return UNREACHABLE_PREFIX + ctx.generateState();
}

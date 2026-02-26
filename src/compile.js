// @ts-check

import { addLineNumber, Command } from "./Command.js";
import { Action } from "./actions/Action.js";
import { AddAction } from "./actions/AddAction.js";
import { BRegAction } from "./actions/BRegAction.js";
import { B_INC, B_READ, B_SET, B_TDEC } from "./action_consts/BReg_consts.js";
import { ADD_A1, ADD_B0, ADD_B1 } from "./action_consts/Add_consts.js";
import { NopAction } from "./actions/NopAction.js";
import { URegAction } from "./actions/URegAction.js";
import { U_TDEC } from "./action_consts/UReg_consts.js";
import { HaltOutAction } from "./exports.js";
import { internalError } from "./internalError.js";

/**
 * @param {Action} action
 * @returns {boolean}
 */
const isBInc = (action) => {
    return action instanceof BRegAction && action.op === B_INC;
};

/**
 * @param {Action} action
 * @returns {boolean}
 */
const isUTdec = (action) => {
    return action instanceof URegAction && action.op === U_TDEC;
};

/**
 * @param {Command} command
 * @returns {undefined | { readonly tdecU: URegAction }}
 */
const getOptimizedTdecU = (command) => {
    // - 前の入力がNZであること
    // - 次の状態が自分自身であること
    // - HALT_OUTを含まないこと
    // - ActionはUまたはB_INCのみであること
    if (
        command.input === "NZ" &&
        command.state === command.nextState &&
        command.actions.every((action) => !(action instanceof HaltOutAction)) &&
        command.actions.every((action) =>
            action instanceof URegAction ||
            isBInc(action)
        )
    ) {
        // TDECは2つ以上入らないため最初を取得でよい
        const tdecU = command.actions.find(isUTdec);
        if (tdecU && tdecU instanceof URegAction) {
            return { tdecU };
        }
    }

    return undefined;
};

/**
 * @param {Command} command
 * @returns {undefined | { readonly tdecB: BRegAction }}
 */
const getOptimizedTdecB = (command) => {
    // - 前の入力がNZであること
    // - 次の状態が自分自身であること
    // - HALT_OUTを含まないこと
    // - ActionはTDEC Bのみであること
    if (
        command.input === "NZ" &&
        command.state === command.nextState &&
        command.actions.every((action) => !(action instanceof HaltOutAction)) &&
        command.actions.length === 1 &&
        command.actions.every((action) => action instanceof BRegAction)
    ) {
        // TDECは2つ以上入らないため最初を取得でよい
        const tdecB = command.actions.find((action) =>
            action instanceof BRegAction && action.op === B_TDEC
        );
        if (tdecB && tdecB instanceof BRegAction) {
            return { tdecB };
        }
    }

    return undefined;
};

/**
 * コマンドと次の状態
 */
export class CompiledCommandWithNextState {
    /**
     * @param {Command} command
     * @param {number} nextState
     */
    constructor(command, nextState) {
        /**
         * @readonly
         */
        this.command = command;

        /**
         * 次の状態の添字
         * @readonly
         */
        this.nextState = nextState;

        this.tdecuOptimize = getOptimizedTdecU(command);
        this.tdecbOptimize = getOptimizedTdecB(command);

        /**
         * should be defined on NZ
         *
         * @type {undefined | BinaryAddOptimizeResult}
         */
        this.binaryaAdOptimization = undefined;
    }
}

// TODO: optimize following cases:
// binary addition
// MULA16 is input state and MULA20 is output state

// [State 0] MULA16;  Z;  MULA20; TDEC B3
// [State 0] MULA16;  NZ; MULA17; READ B3
// [State 1] MULA17;  Z;  MULA18; READ B1
// [State 1] MULA17;  NZ; MULA18; READ B1, SET B3, ADD A1
// [State 2] MULA18;  Z;  MULA19; ADD B0
// [State 2] MULA18;  NZ; MULA19; ADD B1
// [State 3] MULA19;  Z;  MULA16; TDEC U7, INC B1, INC B3
// [State 3] MULA19;  NZ; MULA19; SET B1, NOP

/**
 * @typedef {{ state0: number, state1: number, state2: number, state3: number, inputBReg: number, outputBReg: number, allocNumUReg: number, inputState: number, outputState: number }} BinaryAddOptimizeResult
 */

// TODO: 他の状態から途中の状態への遷移がないことを確認する。

/**
 * @param {CompiledCommand[]} compiledCommands
 * @returns {BinaryAddOptimizeResult[]}
 */
function optimizeBinaryAddPass(compiledCommands) {
    /** @type {BinaryAddOptimizeResult[]} */
    const results = [];

    for (let i = 0; i < compiledCommands.length; i++) {
        const s0 = compiledCommands[i];
        if (!s0?.z || !s0.nz) continue;

        // [State 0] MULA16;  Z;  MULA20; TDEC B3
        if (s0.z.command.actions.length !== 1) continue;
        const s0ZAction = s0.z.command.actions[0];
        if (!(s0ZAction instanceof BRegAction && s0ZAction.op === B_TDEC)) {
            continue;
        }
        const inputState = i;
        const outputState = s0.z.nextState;

        const inputBReg = s0ZAction.regNumber;

        // [State 0] MULA16;  NZ; MULA17; READ B3
        if (s0.nz.command.actions.length !== 1) continue;
        const s0NzAction = s0.nz.command.actions[0];
        if (
            !(s0NzAction instanceof BRegAction &&
                s0NzAction.op === B_READ &&
                s0NzAction.regNumber === inputBReg)
        ) {
            continue;
        }
        const s1Idx = s0.nz.nextState;

        if (s1Idx >= compiledCommands.length) continue;
        const s1 = compiledCommands[s1Idx];
        if (!s1?.z || !s1.nz) continue;

        // [State 1] MULA17;  Z;  MULA18; READ B1
        if (s1.z.command.actions.length !== 1) continue;
        const s1ZAction = s1.z.command.actions[0];
        if (!(s1ZAction instanceof BRegAction && s1ZAction.op === B_READ)) {
            continue;
        }
        const outputBReg = s1ZAction.regNumber;
        const s2Idx = s1.z.nextState;

        // [State 1] MULA17;  NZ; MULA18; READ B1, SET B3, ADD A1
        if (s1.nz.nextState !== s2Idx) continue;
        const s1NzActions = s1.nz.command.actions;
        if (s1NzActions.length !== 3) continue;
        if (
            !s1NzActions.some((a) =>
                a instanceof BRegAction && a.op === B_READ &&
                a.regNumber === outputBReg
            )
        ) {
            continue;
        }
        if (
            !s1NzActions.some((a) =>
                a instanceof BRegAction && a.op === B_SET &&
                a.regNumber === inputBReg
            )
        ) {
            continue;
        }
        if (
            !s1NzActions.some((a) => a instanceof AddAction && a.op === ADD_A1)
        ) {
            continue;
        }

        if (s2Idx >= compiledCommands.length) continue;
        const s2 = compiledCommands[s2Idx];
        if (!s2?.z || !s2.nz) continue;

        // [State 2] MULA18;  Z;  MULA19; ADD B0
        if (s2.z.command.actions.length !== 1) continue;
        const s2ZAction = s2.z.command.actions[0];
        if (
            !(s2ZAction instanceof AddAction && s2ZAction.op === ADD_B0)
        ) {
            continue;
        }
        const s3Idx = s2.z.nextState;

        // [State 2] MULA18;  NZ; MULA19; ADD B1
        if (s2.nz.nextState !== s3Idx) continue;
        if (s2.nz.command.actions.length !== 1) continue;
        const s2NzAction = s2.nz.command.actions[0];
        if (
            !(s2NzAction instanceof AddAction && s2NzAction.op === ADD_B1)
        ) {
            continue;
        }

        if (s3Idx >= compiledCommands.length) continue;
        const s3 = compiledCommands[s3Idx];
        if (!s3?.z || !s3.nz) continue;

        // [State 3] MULA19;  Z;  MULA16; TDEC U7, INC B1, INC B3
        if (s3.z.nextState !== i) continue;
        const s3ZActions = s3.z.command.actions;
        if (s3ZActions.length !== 3) continue;
        const tdecUAction = s3ZActions.find((a) =>
            a instanceof URegAction && a.op === U_TDEC
        );
        if (!(tdecUAction instanceof URegAction)) continue;
        const allocNumUReg = tdecUAction.regNumber;
        if (
            !s3ZActions.some((a) =>
                a instanceof BRegAction && a.op === B_INC &&
                a.regNumber === outputBReg
            )
        ) {
            continue;
        }
        if (
            !s3ZActions.some((a) =>
                a instanceof BRegAction && a.op === B_INC &&
                a.regNumber === inputBReg
            )
        ) {
            continue;
        }

        // [State 3] MULA19;  NZ; MULA19; SET B1, NOP
        if (s3.nz.nextState !== s3Idx) continue;
        const s3NzActions = s3.nz.command.actions;
        const setActions = s3NzActions.filter((a) =>
            a instanceof BRegAction && a.op === B_SET &&
            a.regNumber === outputBReg
        );
        if (setActions.length !== 1) continue;
        const nopActions = s3NzActions.filter((a) => a instanceof NopAction);
        if (setActions.length + nopActions.length !== s3NzActions.length) {
            continue;
        }

        results.push({
            state0: i,
            state1: s1Idx,
            state2: s2Idx,
            state3: s3Idx,
            inputBReg,
            outputBReg,
            allocNumUReg,
            inputState,
            outputState,
        });
    }

    return results;
}

export class CompiledCommand {
    /**
     * @param {CompiledCommandWithNextState | undefined} z Zの場合
     * @param {CompiledCommandWithNextState | undefined} nz NZの場合
     */
    constructor(z, nz) {
        /**
         * Zの場合
         */
        this.z = z;

        /**
         * NZの場合
         */
        this.nz = nz;
    }
}

/**
 * @param {Command} oldCommand
 * @param {Command} command
 */
const throwDuplicated = (oldCommand, command) => {
    throw Error(
        `Duplicated command: "${oldCommand.pretty()}" and "${command.pretty()}"${
            addLineNumber(command)
        }`,
    );
};

/**
 * @param {Command} command
 * @param {number} nextState
 */
function newCompiled(command, nextState) {
    return new CompiledCommandWithNextState(command, nextState);
}

/**
 * 速く実行できる形式へ変換する
 * @param {ReadonlyArray<Command>} commands
 * @returns {{
 *   readonly stateNames: string[];
 *   readonly stateNameToIndexMap: Map<string, number>;
 *   readonly lookup: CompiledCommand[];
 *   readonly reverseStateList: Set<number>[];
 * }}
 */
export const commandsToLookupTable = (commands) => {
    /**
     * 状態名から添字へのMap
     * @type {Map<string, number>}
     */
    const stateMap = new Map();

    /** @type {CompiledCommand[]} */
    const lookup = [];

    // lookupを初期化
    for (const command of commands) {
        // 記録されていない場合追加
        if (!stateMap.has(command.state)) {
            stateMap.set(command.state, stateMap.size);
            lookup.push(new CompiledCommand(undefined, undefined));
        }
    }

    for (const command of commands) {
        const compiledCommand =
            lookup[stateMap.get(command.state) ?? internalError()] ??
                internalError();
        const nextState = stateMap.get(command.nextState);
        // 次の状態が見つからない場合はエラー
        if (nextState === undefined) {
            throw Error(
                `Unknown state: "${command.nextState}" at "${command.pretty()}"${
                    addLineNumber(command)
                }`,
            );
        }

        switch (command.input) {
            case "Z": {
                if (compiledCommand.z === undefined) {
                    // 新しく作成する
                    compiledCommand.z = newCompiled(command, nextState);
                } else {
                    throwDuplicated(compiledCommand.z.command, command);
                }
                break;
            }
            case "NZ": {
                if (compiledCommand.nz === undefined) {
                    // 新しく作成する
                    compiledCommand.nz = newCompiled(command, nextState);
                } else {
                    throwDuplicated(compiledCommand.nz.command, command);
                }
                break;
            }
            case "ZZ": {
                if (compiledCommand.nz !== undefined) {
                    throw Error(
                        `Invalid input: ZZ with NZ or *: "${command.pretty()}" and "${compiledCommand.nz.command.pretty()}"${
                            addLineNumber(command)
                        }`,
                    );
                } else if (compiledCommand.z === undefined) {
                    compiledCommand.z = newCompiled(command, nextState);
                } else {
                    throwDuplicated(compiledCommand.z.command, command);
                }
                break;
            }
            case "*": {
                if (compiledCommand.nz !== undefined) {
                    throw Error(
                        `Invalid input: * "${command.pretty()}" and "${compiledCommand.nz.command.pretty()}"${
                            addLineNumber(command)
                        }`,
                    );
                } else if (compiledCommand.z !== undefined) {
                    throw Error(
                        `Invalid input: * "${command.pretty()}" and "${compiledCommand.z.command.pretty()}"${
                            addLineNumber(command)
                        }`,
                    );
                } else {
                    const c = newCompiled(command, nextState);
                    compiledCommand.z = c;
                    compiledCommand.nz = c;
                }
                break;
            }
            default: {
                internalError();
            }
        }
    }

    const binaryAddOptimizeResults = optimizeBinaryAddPass(lookup);
    for (const r of binaryAddOptimizeResults) {
        const c = lookup[r.inputState];
        if (c === undefined || c.nz === undefined) {
            internalError();
        }
        c.nz.binaryaAdOptimization = r;
    }

    const stateNames = [...stateMap.keys()];

    /**
     * Reverse state map for analyzation and optimization
     *
     * `reverseStateList[toState] = { fromState1, fromState2, ... }`
     *
     * @type {Set<number>[]}
     */
    const reverseStateList = Array(stateNames.length).fill(0).map(() =>
        new Set()
    );

    for (let index = 0; index < lookup.length; index++) {
        const command = lookup[index];
        if (command === undefined) {
            continue;
        }
        if (command.z) {
            reverseStateList[command.z.nextState]?.add(index);
        }
        if (command.nz) {
            reverseStateList[command.nz.nextState]?.add(index);
        }
    }

    return {
        stateNames: [...stateMap.keys()],
        stateNameToIndexMap: stateMap,
        lookup,
        reverseStateList,
    };
};

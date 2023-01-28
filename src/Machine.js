// @ts-check
// deno-lint-ignore-file no-unused-vars

import { ActionExecutor } from "./ActionExecutor.js";
import {
    commandsToLookupTable,
    CompiledCommandWithNextState,
} from "./compile.js";
import { Program } from "./Program.js";
import {
    addLineNumber,
    Command,
    INITIAL_STATE,
    RegistersHeader,
} from "./Command.js";
export { INITIAL_STATE };

/**
 * @returns {never}
 */
function error(msg = "error") {
    throw Error(msg);
}

/**
 * @typedef {"Z" | "NZ" | "ZZ" | "*"} Input
 */

/**
 * エミュレーター
 * プログラムと現在の状態、コンポーネントを保持する
 */
export class Machine {
    /**
     * @param {Program} program
     * @throws {Error} #REGISTERSでの初期化に失敗
     */
    constructor(program) {
        if (!(program instanceof Program)) {
            throw TypeError("program is not a Program");
        }

        /**
         * ステップ数
         */
        this.stepCount = 0;

        const registerNumbers = program.extractRegisterNumbers();
        /**
         * @readonly
         */
        this.actionExecutor = new ActionExecutor({
            binaryRegisterNumbers: registerNumbers.binary,
            unaryRegisterNumbers: registerNumbers.unary,
            legacyTRegisterNumbers: registerNumbers.legacyT,
        });

        /** @type {0 | 1} */
        this.prevOutput = 0;

        /**
         * @readonly
         */
        this.program = program;

        const { states, stateMap, lookup } = commandsToLookupTable(
            program.commands,
        );

        /**
         * @readonly
         */
        this.states = states;

        /**
         * @readonly
         * @private
         */
        this.stateMap = stateMap;

        /**
         * @readonly
         * @private
         */
        this.lookup = lookup;

        // set cache
        for (const compiledCommand of lookup) {
            const actions = (compiledCommand.z?.command.actions ?? []).concat(
                compiledCommand.nz?.command.actions ?? [],
            );
            for (const action of actions) {
                this.actionExecutor.setCache(action);
            }
        }

        /**
         * 現在の状態の添字
         */
        this.currentStateIndex = stateMap.get(INITIAL_STATE) ??
            error(`${INITIAL_STATE} state is not present`);

        /**
         * @type {number}
         * @readonly
         * @private
         */
        this.initialIndex = this.currentStateIndex;

        /**
         * 統計
         * NとNZが交互に並ぶ
         * @type {number[]}
         * @private
         */
        this.stateStatsArray = Array(lookup.length * 2).fill(0).map(() => 0);

        const regHeader = program.registersHeader;
        if (regHeader) {
            this.#setByRegistersHeader(regHeader);
        }
    }

    /**
     * 文字列から作成する
     * @param {string} source
     * @returns {Machine}
     */
    static fromString(source) {
        const program = Program.parse(source);

        if (typeof program === "string") {
            throw Error(program);
        }

        return new Machine(program);
    }

    /**
     * @returns {{ z: number, nz: number }[]}
     */
    getStateStats() {
        const array = this.stateStatsArray;
        const len = array.length;
        /**
         * @type {{ z: number, nz: number }[]}
         */
        const result = [];
        for (let i = 0; i < len; i += 2) {
            result.push({
                z: array[i] ?? error(),
                nz: array[i + 1] ?? error(),
            });
        }

        return result;
    }

    /**
     * @param {RegistersHeader} regHeader
     * @throws
     */
    #setByRegistersHeader(regHeader) {
        /** @type {string} */
        const str = regHeader.content.replace(/'/ug, `"`);

        /** @type {import("./ActionExecutor.js").RegistersInit} */
        let parsed = {};
        try {
            parsed = JSON.parse(str);
        } catch (_e) {
            error(`Invalid #REGISTERS: is not a valid JSON: "${str}"`);
        }
        if (parsed === null || typeof parsed !== "object") {
            error(`Invalid #REGISTERS: "${str}" is not an object`);
        }

        // throw if error is occurred
        this.actionExecutor.setByRegistersInit(parsed);
    }

    /**
     * 現在の状態の名前
     * @returns {string}
     */
    getCurrentState() {
        const name = this.states[this.currentStateIndex];
        if (name === undefined) {
            error("State name is not found");
        }
        return name;
    }

    /**
     * 状態の名前から添字へのマップを取得する
     * @returns {Map<string, number>}
     */
    getStateMap() {
        return this.stateMap;
    }

    /**
     * 前回の出力を取得する
     * @returns {"Z" | "NZ"}
     */
    getPreviousOutput() {
        return this.prevOutput === 0 ? "Z" : "NZ";
    }

    /**
     * @private
     */
    log() {
        const currentStateIndex = this.currentStateIndex;
        const prevOutput = this.prevOutput;
        this.stateStatsArray[currentStateIndex * 2 + prevOutput]++;
    }

    /**
     * 次に実行するコマンドを返す
     * @throws internal error
     * @returns {CompiledCommandWithNextState}
     */
    getNextCommand() {
        const currentStateIndex = this.currentStateIndex;
        const compiledCommand = this.lookup[currentStateIndex];

        if (compiledCommand === undefined) {
            error(
                `Internal Error: Next command is not found: ` +
                    `Current state index: ${currentStateIndex}`,
            );
        }

        const prevOutput = this.prevOutput;

        if (prevOutput === 0) {
            const z = compiledCommand.z;
            if (z !== undefined) {
                return z;
            }
        } else {
            const nz = compiledCommand.nz;
            if (nz !== undefined) {
                return nz;
            }
        }

        error(
            "Next command is not found: Current state = " +
                this.getCurrentState() + ", output = " +
                this.getPreviousOutput(),
        );
    }

    /**
     * @private
     * @param {Command} command
     * @param {number} num
     */
    _internalExecActionN(command, num) {
        try {
            const actionExecutor = this.actionExecutor;
            for (const action of command.actions) {
                // HALT_OUTは含まれないため停止しない
                actionExecutor.execActionN(action, num);
            }
        } catch (error) {
            if (error instanceof Error) {
                this.throwError(error);
            } else {
                throw error;
            }
        }
        this.stateStatsArray[this.currentStateIndex * 2 + this.prevOutput] +=
            num;
        this.stepCount += num;
    }

    /**
     * nステップ進める
     * @param {number} n
     * @param {boolean} isRunning 実行中は重い場合途中で止める
     * @param {number} breakpointIndex -1はブレークポイントなし
     * @param {-1 | 0 | 1} breakpointInputValue -1はZとNZ両方
     * @returns {"Halted" | "Stop" | undefined} HALT_OUTによる停止は"Halted"、ブレークポイントによる停止は"Stop"
     * @throws {Error} 実行時エラー
     */
    exec(n, isRunning, breakpointIndex, breakpointInputValue) {
        const hasBreakpoint = breakpointIndex !== -1;
        const start = performance.now();

        for (let i = 0; i < n; i++) {
            const compiledCommand = this.getNextCommand();

            // optimization
            if (compiledCommand.tdecuOptimize) {
                const tdec = compiledCommand.tdecuOptimize.tdecU;
                let num = tdec.registerCache?.getValue();
                if (num !== undefined && num !== 0) {
                    num = Math.min(num, n - i);
                    this._internalExecActionN(compiledCommand.command, num);
                    i += num - 1; // i++しているため1減らす
                    continue;
                }
            } else if (compiledCommand.tdecbOptimize) {
                const tdecb = compiledCommand.tdecbOptimize.tdecB;
                let num = tdecb.registerCache?.pointer;
                if (num !== undefined && num !== 0) {
                    num = Math.min(num, n - i);
                    this._internalExecActionN(compiledCommand.command, num);
                    i += num - 1; // i++しているため1減らす
                    continue;
                }
            }
            // optimization end

            try {
                const res = this.execCommandFor(compiledCommand);
                if (res === -1) {
                    return "Halted";
                }
            } catch (error) {
                if (error instanceof Error) {
                    this.throwError(error);
                } else {
                    throw error;
                }
            }

            // ブレークポイントの状態の場合、停止する
            if (
                hasBreakpoint &&
                this.currentStateIndex === breakpointIndex &&
                (breakpointInputValue === -1 ||
                    breakpointInputValue === this.prevOutput)
            ) {
                return "Stop";
            }

            // 1フレームに50ms以上時間が掛かっていたら、残りはスキップする
            if (
                isRunning && (i + 1) % 500000 === 0 &&
                (performance.now() - start >= 50)
            ) {
                return undefined;
            }
        }

        return undefined;
    }

    /**
     * @private
     * @param {Error} err
     */
    throwError(err) {
        const command = this.getNextCommand().command;
        const line = addLineNumber(command);
        error(err.message + ` in "${command.pretty()}"` + line);
    }

    /**
     * @private
     * @param {import('./compile.js').CompiledCommandWithNextState} compiledCommand
     * @returns {-1 | void}
     */
    execCommandFor(compiledCommand) {
        this.stepCount += 1;
        this.log();

        /**
         * -1は返り値無し
         * @type {0 | 1 | -1}
         */
        let result = -1;

        const actionExecutor = this.actionExecutor;
        const command = compiledCommand.command;
        for (const action of command.actions) {
            const actionResult = actionExecutor.execAction(action);
            if (actionResult === -1) { // HALT_OUT
                return -1;
            }
            if (actionResult !== undefined) { // actionResult === 1 || actionResult ==== 0
                if (result === -1) {
                    result = actionResult;
                } else {
                    error(
                        `Return value twice: ` +
                            `line = ${command.pretty()}${
                                addLineNumber(command)
                            }`,
                    );
                }
            }
        }

        if (result === -1) {
            error(
                `No return value: line = ${command.pretty()}${
                    addLineNumber(command)
                }`,
            );
        }

        const nextStateIndex = compiledCommand.nextState;
        // INITIALに返ってくることは禁止
        // バリデーションしているので省く
        // if (nextStateIndex === this.initialIndex) {
        //     throw Error(`Return to INITIAL state during execution: line = ${
        //         compiledCommand.command.pretty()
        //     }`);
        // }
        this.currentStateIndex = nextStateIndex;
        this.prevOutput = result;
    }

    /**
     * 次のコマンドを実行する
     * エラーが発生した場合は例外を投げる
     * -1はHALT_OUT
     * voidは正常
     * @returns {-1 | void}
     * @throws {Error} 実行時エラー
     */
    execCommand() {
        return this.execCommandFor(this.getNextCommand());
    }
}

// @ts-check
// deno-lint-ignore-file no-unused-vars

import { ActionExecutor } from "./ActionExecutor.js";
import {
    commandsToLookupTable,
    CompiledCommandWithNextState,
} from "./compile.js";
import {
    analyzeProgram,
    Program,
    validateComponentsHeader,
} from "./Program.js";
import {
    Command,
    commandWithLineNumber,
    INITIAL_STATE_NAME,
    RegistersHeader,
} from "./Command.js";
import { internalError } from "./internalError.js";
export { INITIAL_STATE_NAME as INITIAL_STATE };

/**
 * @returns {never}
 */
const error = (msg = "error") => {
    throw Error(msg);
};

/**
 * @typedef {"Z" | "NZ" | "ZZ" | "*"} Input
 */

/**
 * Emulator
 * エミュレーター
 * プログラムと現在の状態、コンポーネントを保持する
 */
export class Machine {
    /**
     * @param {Program} program
     * @param {{ enableBinaryOptimization?: boolean }} [options]
     * @throws {Error} #REGISTERSでの初期化に失敗
     */
    constructor(program, { enableBinaryOptimization = true } = {}) {
        /**
         * ステップ数
         */
        this.stepCount = 0;

        const analyzeResult = analyzeProgram(program);

        this.enableBinaryOptimization = enableBinaryOptimization;

        /**
         * @readonly
         */
        this.actionExecutor = new ActionExecutor(analyzeResult);

        /** @type {0 | 1} */
        this.prevOutput = 0;

        const { stateNames, stateNameToIndexMap, lookup } =
            commandsToLookupTable(
                program.commands,
            );

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
        this.currentStateIndex = stateNameToIndexMap.get(INITIAL_STATE_NAME) ??
            error(`${INITIAL_STATE_NAME} state is not present`);

        // /**
        //  * @type {number}
        //  * @readonly
        //  * @private
        //  */
        // this.initialIndex = this.currentStateIndex;

        /**
         * Statistics
         * 統計
         * NとNZが交互に並ぶ
         *
         * index = this.currentStateIndex * 2 + this.prevOutput
         *
         * @type {number[]}
         * @private
         */
        this.stateStatsArray = [];

        /**
         * @readonly
         */
        this.stateNames = stateNames;

        /**
         * @readonly
         * @private
         */
        this.stateNameToIndexMap = stateNameToIndexMap;

        /**
         * @readonly
         */
        this.program = program;

        /**
         * @readonly
         */
        this.analyzeResult = analyzeResult;

        // holey arrayにならないように埋める
        for (let i = 0; i < lookup.length * 2; i++) {
            this.stateStatsArray.push(0);
        }

        const regHeaders = program.registersHeader;
        for (const regHeader of regHeaders) {
            this.#setByRegistersHeader(regHeader);
        }

        // 存在する場合のみ検証
        if (program.componentsHeader.length > 0) {
            validateComponentsHeader(program.componentsHeader, analyzeResult);
        }
    }

    /**
     * 文字列から作成する
     * @param {string} source
     * @param {{ name: string; content: string }[]} [libraryFiles]
     * @param {{ enableBinaryOptimization?: boolean }} [options]
     * @returns {Machine}
     * @throws エラー
     */
    static fromString(
        source,
        libraryFiles,
        { enableBinaryOptimization = false } = {},
    ) {
        const program = Program.parse(source, {
            libraryFiles: libraryFiles ?? [],
        });

        if (typeof program === "string") {
            throw Error(program);
        }

        return new Machine(program, {
            enableBinaryOptimization: enableBinaryOptimization,
        });
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
        // Pythonのevalと合わせるためシングルクォーテーションを変換
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
        const name = this.stateNames[this.currentStateIndex];
        if (name === undefined) {
            error("State name is not found");
        }
        return name;
    }

    /**
     * 状態の名前から添字へのマップを取得する
     * @returns {Map<string, number>}
     */
    getStateNameToIndexMap() {
        return this.stateNameToIndexMap;
    }

    /**
     * 前回の出力を取得する
     * @returns {"Z" | "NZ"}
     */
    getPreviousOutput() {
        return this.prevOutput === 0 ? "Z" : "NZ";
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
                this.#throwError(error);
            } else {
                throw error;
            }
        }
        const statIndex = this.currentStateIndex * 2 + this.prevOutput;
        const stateStatsArray = this.stateStatsArray;
        stateStatsArray[statIndex] = (stateStatsArray[statIndex] ?? 0) + num;
        this.stepCount += num;
    }

    /**
     * @param {import("./optimize/binary-optimize.js").BinaryAddOptimizeResult} optimizeResult
     * @param {number} breakpointIndex
     * @param {number} num
     * @returns {{ type: 'cant-execute' } | { type: 'executed', count: number }}
     * @private
     */
    _internalExecBinaryAdd(optimizeResult, breakpointIndex, num) {
        if (num <= 5) {
            return { type: "cant-execute" };
        }
        if (
            breakpointIndex !== -1 &&
            (
                optimizeResult.state0 === breakpointIndex ||
                optimizeResult.state1 === breakpointIndex ||
                optimizeResult.state2 === breakpointIndex ||
                optimizeResult.state3 === breakpointIndex
            )
        ) {
            return { type: "cant-execute" };
        }

        const allocUReg = this.actionExecutor.getUReg(
            optimizeResult.allocNumUReg,
        );
        if (allocUReg === undefined) {
            internalError();
        }

        const allocURegValue = allocUReg.getValue();

        const iterationCount = allocURegValue + 1;

        // ensure enough steps is provided
        if (!(iterationCount >= 4 && iterationCount * 5 + 1 < num)) {
            // 5 is state0, state1, state2, state3, state3 (loop)
            // fully executing the optimized command requires more registers than available, so do normal execution to stop at the breakpoint if needed
            return { type: "cant-execute" };
        }

        const outputBReg = this.actionExecutor.getBReg(
            optimizeResult.outputBReg,
        );
        const inputBReg = this.actionExecutor.getBReg(optimizeResult.inputBReg);
        if (outputBReg === undefined || inputBReg === undefined) {
            internalError();
        }

        // TODO optimize if ouputBReg.pointer is not zero
        if (outputBReg.pointer !== 0 || inputBReg.pointer !== 0) {
            // fully executing the optimized command requires non-zero pointer, so do normal execution to stop at the breakpoint if needed
            return { type: "cant-execute" };
        }

        // binary bits has 0 or 1 as values

        // -- Start Execution --

        allocUReg.setValue(0); // for TDEC U loop

        outputBReg.pointer = iterationCount;
        outputBReg.extend();
        inputBReg.pointer = iterationCount;
        inputBReg.extend();

        // this should be below the extend() calls above
        const outputBRegUint8Array = outputBReg.getInternalUint8Array();
        const inputBRegUint8Array = inputBReg.getInternalUint8Array();

        let stepCount = 0;

        // outputBReg += inputBReg;
        let carry = 0;
        for (let i = 0; i < iterationCount; i++) {
            const sum = (outputBRegUint8Array[i] ?? internalError()) +
                (inputBRegUint8Array[i] ?? internalError()) +
                carry;
            const outputValue = sum % 2;
            outputBRegUint8Array[i] = outputValue;
            // +1 for `MULA19;  NZ; MULA19; SET B1, NOP`
            stepCount += outputValue === 0 ? 4 : 5;
            carry = sum >= 2 ? 1 : 0;

            // TODO: This is wrong. depending on state should change the value of execution count.
            // for (
            //     const statState of [
            //         optimizeResult.state0,
            //         optimizeResult.state1,
            //         optimizeResult.state2,
            //         optimizeResult.state3,
            //     ]
            // ) {
            //     const statIndex = statState * 2 + TODO;
            //     const stateStatsArray = this.stateStatsArray;
            //     stateStatsArray[statIndex] = (stateStatsArray[statIndex] ?? 0) +
            //                 statState === optimizeResult.state3
            //         ? outputValue === 0 ? 1 : 2
            //         : 1;
            // }
        }
        // if there is overflow, the result is truncated, so we can ignore the carry

        this.prevOutput = inputBReg.tdec(); // last TDEC B
        stepCount += 1; // for last TDEC B

        this.currentStateIndex = optimizeResult.outputState;

        this.stepCount += stepCount;
        return { type: "executed", count: stepCount };
    }

    /**
     * nステップ進める
     * @param {number} n
     * @param {boolean} isRunning 実行中は重い場合途中で止める
     * @param {number} breakpointIndex -1はブレークポイントなし
     * @param {-1 | 0 | 1} breakpointInputValue -1はZとNZ両方
     * @returns {"Halted" | "Stop" | undefined}
     *   HALT_OUTによる停止は"Halted"、ブレークポイントによる停止は"Stop"、実行途中はundefined
     * @throws {Error} 実行時エラー
     */
    exec(n, isRunning, breakpointIndex, breakpointInputValue) {
        const hasBreakpoint = breakpointIndex !== -1;
        /**
         * @type {number | null}
         */
        const start = isRunning ? null : performance.now();

        const enableBinaryOptimization = this.enableBinaryOptimization;
        for (let i = 0; i < n; i++) {
            const compiledCommand = this.getNextCommand();

            // optimization
            const tdecuOptimize = compiledCommand.tdecuOptimize;
            if (tdecuOptimize) {
                const tdec = tdecuOptimize.tdecU;
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
            } else if (
                enableBinaryOptimization &&
                compiledCommand.binaryaAddOptimization
            ) {
                const num = n - i;
                const result = this._internalExecBinaryAdd(
                    compiledCommand.binaryaAddOptimization,
                    breakpointIndex,
                    num,
                );

                if (result.type === "executed") {
                    i += result.count - 1; // i++しているため1減らす
                    continue;
                }
                // for "cant-execute", do normal execution, and it will stop at the breakpoint if needed
            }
            // optimization end

            try {
                const res = this.execCommandFor(compiledCommand);
                if (res === -1) {
                    return "Halted";
                }
            } catch (error) {
                if (error instanceof Error) {
                    this.#throwError(error);
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
                isRunning && (i + 1) % 500000 === 0 && start !== null &&
                (performance.now() - start >= 50)
            ) {
                return undefined;
            }
        }

        return undefined;
    }

    /**
     * @param {Error} err
     */
    #throwError(err) {
        const command = this.getNextCommand().command;
        return error(err.message + ` in ` + commandWithLineNumber(command));
    }

    /**
     * @private
     * @param {import('./compile.js').CompiledCommandWithNextState} compiledCommand
     * @returns {-1 | undefined} -1 is HALT_OUT
     */
    execCommandFor(compiledCommand) {
        this.stepCount += 1;

        // log
        {
            const currentStateIndex = this.currentStateIndex;
            const prevOutput = this.prevOutput;
            const statIndex = currentStateIndex * 2 + prevOutput;
            const stateStatsArray = this.stateStatsArray;
            stateStatsArray[statIndex] = (stateStatsArray[statIndex] ?? 0) + 1;
        }

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
                            `line = ${commandWithLineNumber(command)}`,
                    );
                }
            }
        }

        if (result === -1) {
            error(
                `No return value: line = ${commandWithLineNumber(command)}`,
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

        return undefined;
    }

    /**
     * 次のコマンドを実行する
     * エラーが発生した場合は例外を投げる
     * @returns {-1 | undefined}
     * - -1はHALT_OUT
     * - voidは正常
     * @throws {Error} 実行時エラー
     */
    execCommand() {
        return this.execCommandFor(this.getNextCommand());
    }
}

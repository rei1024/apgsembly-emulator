// @ts-check
// deno-lint-ignore-file no-unused-vars

import { ActionExecutor } from "./ActionExecutor.js";
import {
    commandsToLookupTable,
    CompiledCommandWithNextState
} from "./compile.js";
import { Program } from "./Program.js";
import { INITIAL_STATE, RegistersHeader } from "./Command.js";
import { Action } from "./actions/Action.js";
import { BRegAction } from "./actions/BRegAction.js";
import { URegAction } from "./actions/URegAction.js";
export { INITIAL_STATE };

/**
 * @typedef {"Z" | "NZ" | "ZZ" | "*"} Input
 */

/**
 * エミュレーター
 * プログラムと現在の状態、コンポーネントを保持する
 */
export class Machine {
    /**
     *
     * @param {Program} program
     * @throws {Error} #REGISTERSでの初期化に失敗
     */
    constructor(program) {
        if (!(program instanceof Program)) {
            throw TypeError('program is not a Program');
        }

        /**
         * @readonly
         */
        this.actionExecutor = new ActionExecutor({
            binaryRegisterNumbers: program.extractBinaryRegisterNumbers(),
            unaryRegisterNumbers: program.extractUnaryRegisterNumbers(),
            legacyTRegisterNumbers: program.extractLegacyTRegisterNumbers(),
        });

        /** @type {0 | 1} */
        this.prevOutput = 0;

        /**
         * @readonly
         */
        this.program = program;

        const obj = commandsToLookupTable(program.commands);

        /**
         * @readonly
         */
        this.states = obj.states;

        /**
         * @readonly
         * @private
         */
        this.stateMap = obj.stateMap;

        /**
         * @readonly
         * @private
         */
        this.lookup = obj.lookup;

        // set cache
        for (const compiledCommand of obj.lookup) {
            const actions = (compiledCommand.z?.command.actions ?? []).concat(compiledCommand.nz?.command.actions ?? []);
            for (const action of actions) {
                this.setCache(action);
            }
        }

        /**
         * 現在の状態の添字
         */
        this.currentStateIndex = this.stateMap.get(INITIAL_STATE) ?? (() => {
            throw Error(`${INITIAL_STATE} state is not present`);
        })();

        /**
         * @type {number}
         * @readonly
         * @private
         */
        this.initialIndex = this.currentStateIndex;

        /**
         * 統計
         * @type {{ z: number, nz: number }[]}
         */
        this.stateStats = this.lookup.map(() => ({ z: 0, nz: 0 }));

        const regHeader = program.registersHeader;
        if (regHeader !== undefined) {
            this.setByRegistersHeader(regHeader);
        }
    }

    /**
     * @private
     * @param {RegistersHeader} regHeader
     */
    setByRegistersHeader(regHeader) {
        /** @type {string} */
        const str = regHeader.content.replace(/'/ug, `"`);

        /** @type {import("./ActionExecutor.js").RegistersInit} */
        let parsed = {};
        try {
            parsed = JSON.parse(str);
        } catch (_e) {
            throw Error(`Invalid #REGISTERS: is not a valid JSON: "${str}"`);
        }
        if (parsed === null || typeof parsed !== 'object') {
            throw Error(`Invalid #REGISTERS: "${str}" is not an object`);
        }

        // throw if error is occurred
        this.actionExecutor.setByRegistersInit(parsed);
    }

    /**
     * @private
     * @param {Action} action
     */
    setCache(action) {
        if (action instanceof BRegAction) {
            action.registerCache = this.actionExecutor.getBReg(action.regNumber);
        } else if (action instanceof URegAction) {
            action.registerCache = this.actionExecutor.getUReg(action.regNumber);
        }
    }

    /**
     * 現在の状態の名前
     * @returns {string}
     */
    get currentState() {
        const name = this.states[this.currentStateIndex];
        if (name === undefined) {
            throw Error('State name is not found');
        }
        return name;
    }

    /**
     * 状態の文字列から添字へのマップを取得する
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
        if (this.prevOutput === 0) {
            return "Z";
        } else {
            return "NZ";
        }
    }

    /**
     * @param {boolean} [logStats=false] 記録する
     * @throws internal error
     * @returns {CompiledCommandWithNextState}
     */
    getNextCompiledCommandWithNextState(logStats = false) {
        const compiledCommand = this.lookup[this.currentStateIndex];

        if (compiledCommand === undefined) {
            throw Error(`Internal Error: Next command is not found: ` +
                        `Current state index: ${this.currentStateIndex}`);
        }

        if (this.prevOutput === 0) {
            if (logStats) {
                const stat = this.stateStats[this.currentStateIndex];
                if (stat === undefined) {
                    throw Error('Internal error');
                }
                stat.z++;
            }
            const z = compiledCommand.z;
            if (z !== undefined) {
                return z;
            }
        } else {
            if (logStats) {
                const stat = this.stateStats[this.currentStateIndex];
                if (stat === undefined) {
                    throw Error('Internal error');
                }
                stat.nz++;
            }
            const nz = compiledCommand.nz;
            if (nz !== undefined) {
                return nz;
            }
        }
        throw Error('Next command is not found: Current state = ' +
            this.currentState + ', output = ' + this.getPreviousOutput());
    }

    /**
     * 次のコマンドを実行する
     * エラーが発生した場合は例外を投げる
     * -1はHALT_OUT
     * voidは正常
     * @returns {-1 | void}
     * @throws
     */
    execCommand() {
        const compiledCommand = this.getNextCompiledCommandWithNextState(true);

        /**
         * -1は返り値無し
         * @type {0 | 1 | -1}
         */
        let result = -1;

        const actionExecutor = this.actionExecutor;
        for (const action of compiledCommand.command.actions) {
            const actionResult = actionExecutor.execAction(action);
            if (actionResult === -1) { // HALT_OUT
                return -1;
            }
            if (actionResult !== undefined) { // actionResult === 1 || actionResult ==== 0
                if (result === -1) {
                    result = actionResult;
                } else {
                    throw Error(`Return value twice: line = ${
                        compiledCommand.command.pretty()
                    }`);
                }
            }
        }

        if (result === -1) {
            throw Error(`No return value: line = ${
                compiledCommand.command.pretty()
            }`);
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
}

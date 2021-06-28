// @ts-check

import { ActionExecutor } from "./ActionExecutor.js";
import { Command } from "./Command.js";
import { commandsToLookupTable, CompiledCommandWithNextState } from "./compile.js";
import { Program } from "./Program.js";

const INITIAL_STATE = "INITIAL";

/**
 * @typedef {"Z" | "NZ" | "ZZ" | "*"} Input
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
        this.actionExecutor = new ActionExecutor({
            binaryRegisterNumbers: program.extractBinaryRegisterNumbers(),
            unaryRegisterNumbers: program.extractUnaryRegisterNumbers()
        });
    


        /** @type {0 | 1} */
        this.prevOutput = 0;
        this.program = program;
    
        const obj = commandsToLookupTable(program.commands);
        this.states = obj.states;
        this.stateMap = obj.stateMap;
        this.lookup = obj.lookup;

        this.currentStateIndex = this.stateMap.get(INITIAL_STATE) ?? (() => {
            throw Error('INITIAL state is not present');
        })() ;

        const regHeader = program.registersHeader;
        if (regHeader !== undefined) {
            /** @type {string} */
            const str = regHeader.content

            /** @type {import("./ActionExecutor.js").RegistersInit} */
            let parsed = {};
            try {
                parsed = JSON.parse(str);
            } catch (e) {
                throw Error('Invalid #REGISTERS: ' + str);
            }
            try {
                this.actionExecutor.setByRegistersInit(parsed);
            } catch (e) {
               throw e;
            }
        }
    }

    /**
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
     * @throws
     * @returns {CompiledCommandWithNextState}
     */
    getNextCompiledCommandWithnextState() {
        const compiledCommand = this.lookup[this.currentStateIndex];

        if (compiledCommand === undefined) {
            throw Error('Next state not found: current state: ' + this.currentState);
        }

        if (this.prevOutput === 0) {
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
        throw Error('Next Command not found: Current state = ' + this.currentState + ', output = ' + this.getPreviousOutput());
    }

    /**
     * @returns {"HALT_OUT" | undefined}
     * @throws
     */
    execCommand() {
        const compiledCommand = this.getNextCompiledCommandWithnextState();

        const command = compiledCommand.command;

        /** @type {0 | 1 | undefined} */
        let result = undefined;

        const actionExecutor = this.actionExecutor;
        for (const action of command.actions) {
            const res = actionExecutor.execAction(action);
            if (res === -1) {
                return "HALT_OUT";
            }
            if (res !== undefined) { // res === 1 || res ==== 0
                if (result === undefined) {
                    result = res;
                } else {
                    throw Error('Return value twice: command = ' + command.pretty());
                }
            }
        }
        if (result === undefined) {
            throw Error('No return value');
        }

        // INITIALに返ってくることは禁止
        if (command.nextState === INITIAL_STATE) {
            throw Error('INITIAL is return in execution: command = ' + command.pretty());
        }
        this.currentStateIndex = compiledCommand.nextState;
        this.prevOutput = result;
        return undefined;
    }

    /**
     * @returns {never}
     */
    error() {
        throw Error('internal error');
    }
}

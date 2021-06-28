import { Command } from "./Command.js";

// @ts-check

export class CompiledCommandWithNextState {
    /**
     * 
     * @param {Command} command 
     * @param {number} nextState 
     */
    constructor(command, nextState) {
        /**
         * @readonly
         */
        this.command = command;
        /**
         * @readonly
         */
        this.nextState = nextState;
    }
}

export class CompiledCommand {
    /**
     * 
     * @param {CompiledCommandWithNextState | undefined} z 
     * @param {CompiledCommandWithNextState | undefined} nz
     */
    constructor(z, nz) {
        this.z = z;
        this.nz = nz;
    }
}

/**
 * @param {Command[]} commands
 * @returns {{
 *   states: string[];
 *   stateMap: Map<string, number>;
 *   lookup: CompiledCommand[];
 * }}
 */
export function commandsToLookupTable(commands) {
    /** @type {string[]} */
    const states = [];

    /** @type {Map<string, number>} */
    const stateMap = new Map();

    /** @type {CompiledCommand[]} */
    const lookup = [];

    /**
     * @returns {never}
     */
    function error() {
        throw Error('commandsToLookupTable internal error')
    }

    // lookupを初期化
    for (const command of commands) {
        // 記録されていない場合追加
        if (!stateMap.has(command.state)) {
            let n = states.length;
            states.push(command.state);
            stateMap.set(command.state, n);
            lookup.push(new CompiledCommand(undefined, undefined))
        }
    }

    for (const command of commands) {
        const compiledCommand = lookup[stateMap.get(command.state) ?? error()] ?? error();
        const nextState = stateMap.get(command.nextState);
        // 次の状態が見つからない場合はエラー
        if (nextState === undefined) {
            throw Error(`Unkown state: "${command.nextState}" at "${command.pretty()}"`);
        }
        switch (command.input) {
            case "Z": {
                if (compiledCommand.z === undefined) {
                    // 新しく作成する
                    compiledCommand.z = new CompiledCommandWithNextState(command, nextState);
                } else {
                    throw Error(`Duplicate command: "${compiledCommand.z.command.pretty()}" and "${command.pretty()}"`);
                }
                break;
            }
            case "NZ": {
                if (compiledCommand.nz === undefined) {
                    // 新しく作成する
                    compiledCommand.nz = new CompiledCommandWithNextState(command, nextState);
                } else {
                    throw Error(`Duplicate command: "${compiledCommand.nz.command.pretty()}" and "${command.pretty()}"`);
                }
                break;
            }
            case "ZZ": {
                if (compiledCommand.nz !== undefined) {
                    throw Error(`Invalid input: ZZ with NZ or *: "${command.pretty()}" and "${compiledCommand.nz.command.pretty()}"`);
                } else if (compiledCommand.z === undefined) {
                    compiledCommand.z = new CompiledCommandWithNextState(command, nextState);
                } else {
                    throw Error(`Duplicate command: "${compiledCommand.z.command.pretty()}" and "${command.pretty()}"`);
                }
                break;
            }
            case "*": {
                if (compiledCommand.nz !== undefined) {
                    throw Error(`Invalid input: * "${command.pretty()}" and "${compiledCommand.nz.command.pretty()}"`);
                } else if (compiledCommand.z !== undefined) {
                    throw Error(`Invalid input: * "${command.pretty()}" and "${compiledCommand.z.command.pretty()}"`);
                } else {
                    const c = new CompiledCommandWithNextState(command, nextState);
                    compiledCommand.z = c;
                    compiledCommand.nz = c;
                }
                break;
            }
            default: {
                error();
            }
        }
    }

    return {
        states: states,
        stateMap: stateMap,
        lookup: lookup
    };
}

// @ts-check

import { Machine } from "../src/Machine.js";
import { Comlink } from "./deps.js";

export class MachineWorker {
    /**
     * @type {Machine}
     */
    // @ts-ignore
    #machine;
    /**
     * @param {string} source
     * @param {{ name: string; content: string; }[]} libraryFiles
     */
    async init(source, libraryFiles) {
        this.#machine = Machine.fromString(source, libraryFiles);
    }

    async terminate() {
        this.terminate();
    }

    async getBRegMap() {
        return new Map(
            [...this.#machine.actionExecutor.bRegMap.entries()].map(
                ([key, breg]) => {
                    return [key, {
                        pointer: breg.pointer,
                        bits: breg.getBits(),
                    }];
                },
            ),
        );
    }

    async getURegMap() {
        return new Map(
            [...this.#machine.actionExecutor.uRegMap.entries()].map(
                ([key, ureg]) => {
                    return [key, ureg.getValue()];
                },
            ),
        );
    }

    async getStateMap() {
        return this.#machine.getStateMap();
    }

    async getNextCommandText() {
        const command = this.#machine.getNextCommand();
        return command?.command.pretty();
    }

    async getB2D() {
        const b2d = this.#machine.actionExecutor.b2d;
        return {
            x: b2d.x,
            y: b2d.y,
            maxX: b2d.getMaxX(),
            maxY: b2d.getMaxY(),
            data: b2d.getArray(),
        };
    }

    async getOutput() {
        return this.#machine.actionExecutor.output.getString();
    }

    async getStateStats() {
        return this.#machine.getStateStats();
    }

    async getStates() {
        return this.#machine.states;
    }

    async getCurrentStateIndex() {
        return this.#machine.currentStateIndex;
    }

    async getInfo() {
        return {
            currentState: this.#machine.getCurrentState(),
            previousOutput: this.#machine.getPreviousOutput(),
            stepCount: this.#machine.stepCount,
        };
    }

    async getCurrentState() {
        return this.#machine.getCurrentState();
    }

    async getPreviousOutput() {
        return this.#machine.getPreviousOutput();
    }

    async getAnalyzeResult() {
        return this.#machine.analyzeResult;
    }

    async getAddSubMulToUIString() {
        return this.#machine.actionExecutor.addSubMulToUIString();
    }

    /**
     * @param {number} n
     * @param {boolean} isRunning 実行中は重い場合途中で止める
     * @param {number} breakpointIndex -1はブレークポイントなし
     * @param {-1 | 0 | 1} breakpointInputValue -1はZとNZ両方
     * @returns {Promise<"Halted" | "Stop" | undefined>}
     */
    async exec(n, isRunning, breakpointIndex, breakpointInputValue) {
        return this.#machine.exec(
            n,
            isRunning,
            breakpointIndex,
            breakpointInputValue,
        );
    }
}

Comlink.expose(new MachineWorker());

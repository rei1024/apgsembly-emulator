// @ts-check

import { Machine } from "../../src/Machine.js";

export class HistoryUI {
    /**
     * @param {HTMLElement} historyBody
     */
    constructor(historyBody) {
        this.historyBody = historyBody;

        /**
         * @type {Array<{ $row: HTMLElement; $step: HTMLElement; $state: HTMLElement; $output: HTMLElement, $command: HTMLElement }>}
         */
        this.items = [];
    }

    /**
     * @param {number} historyMaxSize
     */
    initialize(historyMaxSize) {
        this.historyBody.innerHTML = "";
        this.items = [];
        for (let i = 0; i < historyMaxSize; i++) {
            const $row = document.createElement("tr");
            $row.classList.add("code-mono");
            const $step = document.createElement("td");
            const $state = document.createElement("td");
            const $output = document.createElement("td");
            const $command = document.createElement("td");
            $row.append($step, $state, $output, $command);
            this.historyBody.appendChild($row);
            this.items.push({
                $row,
                $step,
                $state,
                $output,
                $command,
            });
        }
    }

    /**
     * @param {Machine} machine
     */
    render(machine) {
        if (machine.stateHistoryMax !== this.items.length) {
            this.initialize(machine.stateHistoryMax);
        }

        const items = this.items;

        const histories = [...machine.getStateHistory()];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const history = histories[i]; // histories[histories.length - 1 - i];
            if (!item) {
                return;
            }
            if (history) {
                item.$row.classList.remove("d-none");
                item.$step.textContent = history.step.toLocaleString();
                item.$state.textContent =
                    machine.stateNames[history.stateIndex] ?? "";
                item.$output.textContent = history.output === 0 ? "Z" : "NZ";
                const command = machine.getCommandForStateIndex(
                    history.stateIndex,
                    history.output,
                );
                item.$command.textContent = command.command.actions.map((a) =>
                    a.pretty()
                ).join(", ") ?? "";
            } else {
                item.$row.classList.add("d-none");
                item.$step.textContent = "";
                item.$state.textContent = "";
                item.$output.textContent = "";
                item.$command.textContent = "";
            }
        }
    }
}

// @ts-check

import { Machine } from "../../src/Machine.js";

export class HistoryUI {
    /**
     * @param {HTMLElement} historyBody
     */
    constructor(historyBody) {
        this.historyBody = historyBody;

        /**
         * @type {Array<{ $row: HTMLElement; $step: HTMLElement; $state: HTMLElement; $output: HTMLElement, $actions: HTMLElement }>}
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
            $step.colSpan = 2;
            const $state = document.createElement("td");
            $state.colSpan = 2;
            const $output = document.createElement("td");
            const $actions = document.createElement("td");
            $actions.colSpan = 2;
            $row.append($step, $state, $output, $actions);
            this.historyBody.appendChild($row);
            this.items.push({
                $row,
                $step,
                $state,
                $output,
                $actions,
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

        // TODO: change by UI
        const ENABLE_RING_VIEW = false;

        const internal = machine.getStateHistoryInternal();
        const histories = ENABLE_RING_VIEW
            ? internal.items
            : [...machine.getStateHistory()];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const history = histories[i]; // histories[histories.length - 1 - i];
            if (!item) {
                return;
            }
            if (history) {
                item.$row.classList.remove("d-none");
                if (ENABLE_RING_VIEW) {
                    if (
                        (internal.head === 0 && i === items.length - 1) ||
                        (i === internal.head - 1)
                    ) {
                        item.$row.classList.add("current_state");
                    } else {
                        item.$row.classList.remove("current_state");
                    }
                }
                item.$step.textContent = history.step.toLocaleString();
                item.$state.textContent =
                    machine.stateNames[history.stateIndex] ?? "";
                item.$output.textContent = history.output === 0 ? "Z" : "NZ";
                const command = machine.getCommandForStateIndex(
                    history.stateIndex,
                    history.output,
                );
                item.$actions.textContent = command.command.actions.map((a) =>
                    a.pretty()
                ).join(", ") ?? "";
            } else {
                item.$row.classList.add("d-none");
                item.$row.classList.remove("current_state");
                item.$step.textContent = "";
                item.$state.textContent = "";
                item.$output.textContent = "";
                item.$actions.textContent = "";
            }
        }
    }
}

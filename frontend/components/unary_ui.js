// @ts-check

import { chunk } from "../util/chunk.js";
import { UReg } from "../../src/components/UReg.js";
import { create } from "../util/create.js";
import { internalError } from "../../src/internalError.js";

/**
 * 列の数
 * @param {number} numberOfRegister
 * @returns {number}
 */
const getNumberOfCols = (numberOfRegister) => {
    const width = window.innerWidth;
    if (width < 768) {
        // 画面幅狭い場合は8個ごと
        const chunkSize = 8;
        // 1個だけの列は作らない
        if (chunkSize + 1 === numberOfRegister) {
            return numberOfRegister;
        }
        return chunkSize;
    }

    // 12個ごと
    const chunkSize = 12;
    if (
        chunkSize + 1 <= numberOfRegister && numberOfRegister <= chunkSize + 2
    ) {
        return numberOfRegister;
    }
    return chunkSize;
};

/**
 * @param {number} key
 */
const createHeaderCell = (key) => {
    return create("th", {
        text: `U${key}`,
        classes: ["text-end"],
    });
};

/**
 * @param {number} key
 * @param {UReg} value
 */
const createDataCell = (key, value) => {
    return create("td", {
        text: value.getValue().toString(),
        fn: (td) => {
            td.dataset["test"] = `U${key}`;
        },
        classes: ["text-end"],
    });
};

/**
 * @param {ReadonlyMap<number, UReg>} regs
 * @returns {{ table: HTMLTableElement, cells: HTMLElement[] }}
 */
const createTable = (regs) => {
    /**
     * @type {HTMLElement[]}
     */
    const cells = [];

    /** @type {{ header: HTMLTableRowElement, data: HTMLTableRowElement }[]} */
    const rows = [];

    const numberOfCols = getNumberOfCols(regs.size);

    for (const entries of chunk(regs, numberOfCols)) {
        const header = create("tr");
        const data = create("tr");
        for (const [key, value] of entries) {
            header.append(createHeaderCell(key));

            const td = createDataCell(key, value);
            cells.push(td);
            data.append(td);
        }

        rows.push({ header, data });
    }

    const table = create("table");
    for (const row of rows) {
        table.append(row.header, row.data);
    }

    table.classList.add("table");

    // 幅を均等にする
    table.style.tableLayout = "fixed";

    // 16pxから変更
    table.style.marginBottom = "0";

    return {
        table,
        cells,
    };
};

/**
 * 1進数レジスタのUI
 * UI for unary registers
 */
export class UnaryUI {
    /**
     * @type {HTMLElement}
     */
    #root;
    /**
     * @type {HTMLElement[]}
     */
    #cells;
    /**
     * @param {HTMLElement} root
     */
    constructor(root) {
        this.#root = root;
        this.#cells = [];
    }

    /**
     * initialize DOM
     * @param {ReadonlyMap<number, UReg>} regs
     */
    initialize(regs) {
        const { table, cells } = createTable(regs);
        this.#root.replaceChildren(table);
        this.#cells = cells;
    }

    clear() {
        this.#cells = [];
        this.#root.innerHTML = "";
    }

    /**
     * @param {ReadonlyMap<number, UReg>} regs
     */
    render(regs) {
        let i = 0;
        const cells = this.#cells;
        for (const reg of regs.values()) {
            const item = cells[i] ?? internalError();
            item.textContent = reg.getValue().toString();
            i++;
        }
    }
}

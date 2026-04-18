// @ts-check

import { create } from "./create.js";

/**
 * Create spinner
 * @returns {HTMLElement}
 */
export const makeSpinner = () => {
    const spinner = create("span");
    spinner.classList.add("spinner-border", "spinner-border-sm");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-hidden", "true");
    return spinner;
};

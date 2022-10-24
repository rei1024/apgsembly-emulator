// @ts-check

import { create } from '../util/create.js';

/**
 *
 * @param {HTMLElement} $error
 * @param {import('../app.js').AppState} appState
 * @param {string} errorMessage
 */
export function renderErrorMessage($error, appState, errorMessage) {
    if (appState === "RuntimeError" || appState === "ParseError") {
        const messages = errorMessage.split('\n');
        $error.replaceChildren();
        for (const message of messages) {
            $error.append(
                create('span', "- " + message),
                create('br')
            );
        }
        $error.classList.remove('d-none');
    } else {
        $error.classList.add('d-none');
    }
}

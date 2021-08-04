export const APGsemblyEmulatorURL = 'http://localhost:1123/';

/**
 *
 * @param {string} str
 */
export function loadProgram(str) {
    cy.get('#samples').click();
    cy.get(`[data-src="${str}"]`).click();
}

/**
 *
 * @param {number} n
 */
export function setStep(n) {
    cy.get(`[data-test="config_button"]`).click();
    cy.wait(500);
    cy.get('#step_input').type(`{selectall}{backspace}${n}`);
    cy.get('#config_modal .btn-close').click();
    cy.wait(50);
}
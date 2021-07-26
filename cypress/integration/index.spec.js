const apgsemblyEmulatorPageURL = 'http://localhost:1123/';

describe('Load', () => {
    it('should load', () => {
        cy.visit(apgsemblyEmulatorPageURL);
        cy.get('#start').should('not.be.disabled');
    });
});

describe('Error', () => {
    it('Error', () => {
        cy.visit(apgsemblyEmulatorPageURL);
        cy.contains('APGsembly');
        cy.get('#start').click();
        cy.contains('Program is empty');
    });
});

/**
 *
 * @param {string} str 
 */
function loadProgram(str) {
    cy.get('#samples').click();
    cy.get(`[data-src="${str}"]`).click();
}

/**
 *
 * @param {number} n 
 */
function setStep(n) {
    cy.contains('Config').click();
    cy.wait(100);
    cy.get('#step_input').type(`{selectall}{backspace}${n}`);
    cy.wait(100);
    cy.get('#config_modal .btn-close').click();
    cy.wait(100);
}

describe('Integers', () => {
    it('should print integers', () => {
        cy.visit(apgsemblyEmulatorPageURL);
        cy.contains('APGsembly');
        loadProgram('integers.apg');

        setStep(1050);
        cy.get('#step').click();
        cy.get('#output').should('have.value', '1.2.3.4.5.6.7.8.9.10');

        cy.get('#steps').should('have.text', '1050');
    });
});

describe('Pi calculator', () => {
    it('should print pi', () => {
        cy.visit(apgsemblyEmulatorPageURL);
        cy.contains('APGsembly');
        loadProgram('pi_calc.apg');

        cy.contains('U0');
        cy.contains('U9');
        cy.contains('B0');
        cy.contains('B3');

        setStep(1000000);
        cy.get('#step').click();
        cy.get('#output').should('have.value', '3.141');

        cy.get('#steps').should('have.text', '1000000');
    });
});

describe('Rule 110', () => {
    it('Rule 110 should work', () => {
        cy.visit(apgsemblyEmulatorPageURL);
        cy.contains('APGsembly');
        loadProgram('rule110.apg');

        setStep(1000);
        cy.get('#step').click();

        cy.get('#steps').should('have.text', '1000');
    });
});

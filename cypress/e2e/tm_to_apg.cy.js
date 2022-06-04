// @ts-check
/// <reference types="cypress" />

import {
    tmToAPGURL,
    APGsemblyEmulatorURL,
    setStep,
    clickStep,
    setProgram,
    assertSteps,
} from "../common/common.js";

describe('TM to APG integration BB3', () => {
    it('should load', () => {
        cy.visit(tmToAPGURL);
    });

    it('should generate', () => {
        cy.get('#example_button').click();
        cy.contains('BB(3)').click();
        cy.get('#generate').click();
        cy.get('#copy').should('not.be.disabled');
    });

    it('should run', () => {
        cy.wait(50);
        cy.get('#output').then(x => {
            /**
             * @type {string}
             */
            // @ts-ignore
            const prog = x.val();
            cy.visit(APGsemblyEmulatorURL);

            setProgram(prog);
            setStep(200);
            clickStep();
            cy.get(`[data-test="U1"]`).should('have.text', '14');
            assertSteps(119);
        });
    });
});

describe('TM to APG integration BB4', () => {
    it('should load', () => {
        cy.visit(tmToAPGURL);
    });

    it('should generate', () => {
        cy.get('#example_button').click();
        cy.contains('BB(4)').click();
        cy.get('#generate').click();
        cy.get('#copy').should('not.be.disabled');
    });
    it('should run', () => {
        cy.wait(50);
        cy.get('#output').then(x => {
            /**
             * @type {string}
             */
            // @ts-ignore
            const prog = x.val();
            cy.visit(APGsemblyEmulatorURL);

            setProgram(prog);
            setStep(1000);
            clickStep();
            cy.get(`[data-test="U1"]`).should('have.text', '108');
            assertSteps(887);
        });
    });
});

export {};
// @ts-check
/// <reference types="cypress" />

import { tmToAPGURL, APGsemblyEmulatorURL, setStep, setProgram } from "../common/common.js";

describe('TM to APG integration', () => {
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

            cy.get('#input').clear().invoke('val', prog)
            setProgram(prog);
            setStep(1000);
            cy.get('#step').click();
            cy.get('#steps').should('contain.text', '100');
        })
    });
});

export {};

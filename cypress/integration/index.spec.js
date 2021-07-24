describe('Test', () => {
    it('Visits page', () => {
        cy.visit('http://localhost:1123/');
        cy.contains('APGsembly');
        cy.get('#samples').click();
        cy.get('[data-src="pi_calc.apg"]').click();
        cy.contains('Config').click();
        cy.get('#step_input').type('{backspace}1000000');
        cy.get('#config_modal .btn-close').click();
        cy.get('#step').click();
        cy.get('#output').should('have.value', '3.141');
    });
});

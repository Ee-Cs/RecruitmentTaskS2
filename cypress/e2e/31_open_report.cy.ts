
/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Create PDF Reports', () => {
  it('should create PDF report', () => {
    /*
      * Page "Home"
      */
    cy.visit('/');
    cy.contains('Home').should('be.visible');
    cy.contains('Standard').should('be.visible');
    cy.contains('Large Scale').should('be.visible');
    cy.contains('Long Names').should('be.visible');
    cy.contains('Empty').should('be.visible');
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('⏵⏵⏵').click();
    cy.get('button').contains('Create PDF Reports').click();
    /*
      * Page "Rockets Location"
      */
    cy.contains('Reports').should('be.visible');
    cy.contains('Missions and Rockets').should('be.visible');
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get('button').contains('Open PDF').click();
    cy.wait(500);// wait for PDF generation
    cy.get('@windowOpen').should('have.been.called');
    cy.get('button').contains('Print PDF').should('be.visible');
    cy.get('button').contains('Download PDF').should('be.visible');
    cy.screenshot(`1_pdf_reports`);
    /*
    * Page "Home".
    * It should navigate back to Home and verify radio selection.
    */
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Home').click();
    cy.contains('Home').should('be.visible');
    // reset
    cy.contains('Standard').should('be.visible');
    cy.get('input[type="radio"][value="S"]').should('be.checked');
    cy.screenshot(`2_home`);
  });
});

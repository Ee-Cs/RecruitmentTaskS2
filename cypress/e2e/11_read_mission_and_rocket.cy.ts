import {
  MISSION_READ_NAME,
  ROCKET_READ_NAME,
  MISSIONS_NUMBER,
  ROCKETS_NUMBER,
} from './test_constants';

/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Read mission and rocket', () => {
  it('`should read mission and rocket', () => {
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
    cy.get('button').contains('Manage Missions').click();
    /*
      * Page "Manage Missions"
      * It should read mission name.
      */
    cy.contains('Missions').should('be.visible');
    cy.get('table tbody tr').should('have.length', MISSIONS_NUMBER);
    cy.screenshot(`1_list_missions`);
    cy.get('table').within(() => {
      cy.get('tr').contains(MISSION_READ_NAME).parent().contains('Manage Rockets').click();
    });
    /*
      * Page "Manage Rockets"
      * It should read rocket first name  and last name.
      */
    cy.contains('Missions').should('be.visible');
    cy.contains(MISSION_READ_NAME).should('be.visible');
    cy.contains('Rockets').should('be.visible');
    cy.get('table tbody tr').should('have.length', ROCKETS_NUMBER);
    cy.get('table').within(() => {
      cy.get('tr').contains(ROCKET_READ_NAME).should('be.visible');
    });
    cy.screenshot(`2_list_rockets`);
    /*
      * Page "Home".
      * It should navigate back to Home and verify radio selection.
      */
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Home').click();
    cy.contains('Home').should('be.visible');
    cy.get('input[type="radio"][value="S"]').should('be.checked');
    cy.screenshot(`3_home`);
  });
});

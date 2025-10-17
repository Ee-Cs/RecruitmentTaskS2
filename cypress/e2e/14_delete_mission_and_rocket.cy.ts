import {
  MISSION_READ_NAME,
  ROCKET_READ_NAME,
  MISSIONS_NUMBER,
  ROCKETS_NUMBER,
} from './test_constants';
/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Delete mission and rocket', () => {
  it('should delete mission and rocket', () => {
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
      */
    cy.contains('Missions').should('be.visible');
    cy.get('table tbody tr').should('have.length', MISSIONS_NUMBER);
    cy.screenshot(`1_list_missions_before_delete`);
    cy.get('table').within(() => {
      cy.get('tr').contains(MISSION_READ_NAME).parent().contains('Manage Rockets').click();
    });
    /*
      * Page "Manage Rockets"
      */
    cy.contains('Missions').should('be.visible');
    cy.contains(MISSION_READ_NAME).should('be.visible');
    cy.contains('Rockets').should('be.visible');
    cy.get('table tbody tr').should('have.length', ROCKETS_NUMBER);
    cy.screenshot(`2_list_rockets_before_delete`);
    cy.get('table').within(() => {
      cy.get('tr').each(($tr) => {
        const nameMatch = $tr.text().includes(ROCKET_READ_NAME);
        if (nameMatch) {
          cy.wrap($tr).contains('Delete').click();
        }
      });
    });
    /*
      * Page "Delete Rocket"
      * It should delete rocket.
      */
    cy.get('input[formcontrolname="name"]').should('be.visible')
      .and('have.value', ROCKET_READ_NAME);
    cy.screenshot(`3_delete_rocket`);
    cy.get('button').contains('Delete').click();
    /*
      * Page "Manage Rockets"
      */
    cy.contains('Rockets').should('be.visible');
    cy.get('table tbody tr').should('have.length', ROCKETS_NUMBER - 1);
    cy.get('table').within(() => {
      cy.get('tr').each(($tr) => {
        const text = $tr.text();
        expect(text.includes(ROCKET_READ_NAME)).to.be.false;
      });
    });
    cy.screenshot(`4_list_rockets_after_delete`);
    cy.contains('Missions').click();
    /*
      * Page "Delete Mission"
      * It should delete mission.
      */
    cy.get('tr').contains(MISSION_READ_NAME).parent().contains('Delete').click();
    /*
      * Page "Manage Missions"
      */
    cy.get('input[formcontrolname="name"]').should('be.visible')
      .and('have.value', MISSION_READ_NAME);
    cy.screenshot(`5_delete_mission`);
    cy.get('button').contains('Delete').click();
    /*
      * Page "Manage Missions"
      */
    cy.contains('Missions').should('be.visible');
    cy.get('table tbody tr').should('have.length', MISSIONS_NUMBER);
    cy.get('table').within(() => {
      cy.get('tr').contains(MISSION_READ_NAME).should('not.exist');
    });
    cy.screenshot(`6_list_missions_after_delete`);
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
    cy.contains('mat-radio-button', 'Empty').click();
    cy.get('input[type="radio"][value="E"]').should('be.checked');
    cy.contains('button', 'Load dataset').should('not.be.disabled').click();
    cy.screenshot(`7_home`);
  });
});

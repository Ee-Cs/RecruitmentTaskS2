import {
  MISSION_READ_NAME,
  MISSION_UPDATED_NAME,
  ROCKET_READ_NAME,
  ROCKET_UPDATED_NAME,
  MISSIONS_NUMBER,
  ROCKETS_NUMBER,
} from './test_constants';
/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Update mission and rocket', () => {
  it('`should update mission and rocket', () => {
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
    cy.screenshot(`1_list_missions_before_update`);
    cy.get('table').within(() => {
      cy.get('tr').contains(MISSION_READ_NAME).parent().within(() => {
        cy.contains('Update').click();
      });
    });
    /*
      * Page "Update Mission"
      * It should update mission.
      */
    cy.contains('Update Mission').should('be.visible');
    cy.get('input[formcontrolname="name"]').clear().type(MISSION_UPDATED_NAME);
    cy.screenshot(`2_update_mission`);
    cy.get('button').contains('Update').click();
    /*
      * Page "Manage Missions"
      */
    cy.contains('Missions').should('be.visible');
    cy.get('table').within(() => {
      cy.get('tr').contains(MISSION_UPDATED_NAME).should('be.visible');
    });
    cy.screenshot(`3_list_missions_after_update`);
    cy.get('table').within(() => {
      cy.get('tr').contains(MISSION_UPDATED_NAME).parent().contains('Manage Rockets').click();
    });
    /*
      * Page "Manage Rockets"
      */
    cy.contains('Missions').should('be.visible');
    cy.contains(MISSION_UPDATED_NAME).should('be.visible');
    cy.get('table tbody tr').should('have.length', ROCKETS_NUMBER);
    cy.screenshot(`4_list_rockets_before_update`);
    cy.get('table').within(() => {
      cy.get('tr').contains(ROCKET_READ_NAME).parent().contains('Update').click();
    });
    /*
      * Page "Update Rocket"
      * It should update rocket.
      */
    cy.get('input[formcontrolname="name"]').clear().type(ROCKET_UPDATED_NAME);
    cy.screenshot(`5_update_rocket`);
    cy.get('button').contains('Update').click();
    /*
      * Page "Manage Rockets"
      */
    cy.contains('Missions').should('be.visible');
    cy.contains(MISSION_UPDATED_NAME).should('be.visible');
    cy.contains('Rockets').should('be.visible');
    cy.get('table').within(() => {
      cy.get('tr').contains(ROCKET_UPDATED_NAME).should('be.visible');
    });
    cy.screenshot(`6_list_rockets_after_update`);
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

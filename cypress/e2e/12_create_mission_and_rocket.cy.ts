import {
  MISSION_CREATED_NAME,
  ROCKET_CREATED_NAME,
  MISSIONS_NUMBER,
} from './test_constants';

/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Create mission and rocket', () => {
  it('`should create mission and rocket', () => {
    /*
      * Page "Home"
      */
    cy.visit('/');
    cy.contains('Home').should('be.visible');
    cy.contains('Dataset').should('be.visible');
    cy.contains('Load dataset').should('be.visible');
    cy.contains('Standard').should('be.visible');
    cy.contains('Large Scale').should('be.visible');
    cy.contains('Long Names').should('be.visible');
    cy.contains('Empty').should('be.visible');
    cy.get('input[type="radio"][value="S"]').should('be.checked');
    cy.contains('mat-radio-button', 'Empty').click();
    cy.get('input[type="radio"][value="E"]').should('be.checked');
    cy.contains('button', 'Load dataset').should('not.be.disabled').click();
    cy.screenshot(`1_home`);
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('⏵⏵⏵').click();
    cy.get('button').contains('Manage Missions').click();
    /*
      * Page "Manage Missions"
      */
    cy.contains('Missions').should('be.visible');
    cy.get('table tbody tr').should('have.length', 0);
    cy.screenshot(`2_list_missions_before_create`);
    cy.contains('Create Mission').click();
    /*
      * Page "Create Mission"
      * It should create new mission.
      */
    cy.contains('Create Mission').should('be.visible');
    cy.get('input[formcontrolname="name"]').clear().type(MISSION_CREATED_NAME);
    cy.screenshot(`3_create_mission`);
    cy.get('button').contains('Create').click();
    /*
      * Page "Manage Missions"
      */
    cy.contains('Missions').should('be.visible');
    cy.screenshot(`4_list_missions_after_create`);
    cy.get('table').within(() => {
      cy.get('tr').contains(MISSION_CREATED_NAME).parent().contains('Manage Rockets').click();
    });
    /*
      * Page "Manage Rockets"
      */
    cy.contains('Missions').should('be.visible');
    cy.contains(MISSION_CREATED_NAME).should('be.visible');
    cy.screenshot(`5_list_rockets_before_create`);
    cy.get('button').contains('Create').click();
    /*
      * Page "Create Rocket"
      * It should create new rocket.
      */
    cy.get('input[formcontrolname="name"]').clear().type(ROCKET_CREATED_NAME);
    cy.screenshot(`6_create_rocket`);
    cy.get('button').contains('Create').click();
    /*
      * Page "Manage Rockets"
      */
    cy.contains('Missions').should('be.visible');
    cy.contains(MISSION_CREATED_NAME).should('be.visible');
    cy.get('table tbody tr').should('have.length', 1);
    cy.contains('Rockets').should('be.visible');
    cy.get('table').within(() => {
      cy.get('tr').contains(ROCKET_CREATED_NAME).should('be.visible');
    });
    cy.screenshot(`7_list_rockets_after_create`);
    /*
      * Page "Home".
      * It should navigate back to Home and verify radio selection.
      */
    cy.get('button').contains('Menu').click();
    cy.get('button').contains('Home').click();
    cy.contains('Home').should('be.visible');
    // reset
    cy.contains('Empty').should('be.visible');
    cy.get('input[type="radio"][value="E"]').should('be.checked');
    cy.contains('mat-radio-button', 'Standard').click();
    cy.get('input[type="radio"][value="S"]').should('be.checked');
    cy.contains('button', 'Load dataset').should('not.be.disabled').click();
    cy.screenshot(`8_home`);
  });
});

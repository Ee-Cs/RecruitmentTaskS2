import {
  MISSION_READ_NAME,
  UNASSIGNED_ROCKET_NAME,
  ROCKET_READ_NAME,
  TRANSFERABLE_ROCKETS_NUMBER,
} from './test_constants';

/**
 * Cypress End-to-End Tests for RecruitmentTaskS2.
 */
describe('Read mission and rocket', () => {
  it('should transfer rockets', () => {
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
    cy.get('button').contains('Transfer Rockets').click();
    /*
      * Page "Transfer Rockets"
      */
    cy.contains('Unassigned Rockets').should('be.visible');
    cy.contains('Mission Rockets').should('be.visible');
    cy.get('.rocket-pool-table').find('tbody tr').should('have.length', 0);
    cy.get('form').find('.mat-mdc-select-value-text .mat-mdc-select-min-line')
      .should('contain', MISSION_READ_NAME);
    cy.get('.rocket-table').find('tbody tr').should('have.length', TRANSFERABLE_ROCKETS_NUMBER);
    cy.get('.rocket-table').find('tbody tr').filter((_, el) => {
      return el.innerText.includes(ROCKET_READ_NAME);
    }).should('have.length.at.least', 1);
    cy.screenshot(`1_list_rockets_in_source_and_in_target`);
    cy.contains('Create Unassigned Rocket').click();
    /*
      * Page "Create Unassigned Rocket"
      * It should create new mission.
      */
    cy.contains('Create Unassigned Rocket').should('be.visible');
    cy.get('input[formcontrolname="name"]').clear().type(UNASSIGNED_ROCKET_NAME);
    cy.screenshot(`2_create_unassigned_rocket`);
    cy.get('button').contains('Create').click();
    /*
      * Page "Transfer Rockets"
      */
    cy.contains('Unassigned Rockets').should('be.visible');
    cy.contains('Mission Rockets').should('be.visible');
    cy.screenshot(`3_list_rockets_after_create`);
    cy.get('.rocket-pool-table').find('tbody tr')
      .filter((_, el) => el.innerText.includes(UNASSIGNED_ROCKET_NAME))
      .first()
      .find('mat-checkbox')
      .click();
    cy.contains('button', 'Assign').click();
    cy.get('.rocket-table').find('tbody tr').should('have.length', 2);
    cy.get('.rocket-pool-table').find('tbody tr').should('have.length', 0);
    cy.get('.rocket-table').find('tbody tr')
      .filter((_, el) => el.innerText.includes(ROCKET_READ_NAME))
      .should('have.length.at.least', 1);
    cy.get('.rocket-table').find('tbody tr')
      .filter((_, el) => el.innerText.includes(UNASSIGNED_ROCKET_NAME))
      .should('have.length.at.least', 1);
    cy.screenshot(`4_list_rockets_after_assign`);
    /*
    * Could not test the unassigment because in Cypress browser
    * the checkbox is being covered by another element!
    */
    /*
     cy.get('.rocket-table').find('th mat-checkbox').click();
     cy.contains('button', 'Unassign').click();
     cy.get('.rocket-table').find('tbody tr').should('have.length', 0);
     cy.get('.rocket-pool-table').find('tbody tr').should('have.length', 2);
     cy.get('.rocket-pool-table').find('tbody tr')
       .filter((_, el) => el.innerText.includes(ROCKET_READ_NAME))
       .should('have.length.at.least', 1);
     cy.get('.rocket-pool-table').find('tbody tr')
       .filter((_, el) => el.innerText.includes(UNASSIGNED_ROCKET_NAME))
       .should('have.length.at.least', 1);
     cy.get('.rocket-pool-table').find('th mat-checkbox').click();
     cy.contains('button', 'Assign').click();
     cy.get('.rocket-table').find('tbody tr').should('have.length', 2);
     cy.get('.rocket-pool-table').find('tbody tr').should('have.length', 0);
     cy.get('.rocket-table').find('tbody tr')
       .filter((_, el) => el.innerText.includes(ROCKET_READ_NAME))
       .should('have.length.at.least', 1);
     cy.get('.rocket-table').find('tbody tr')
       .filter((_, el) => el.innerText.includes(UNASSIGNED_ROCKET_NAME))
       .should('have.length.at.least', 1);
    */
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
    cy.screenshot(`5_home`);
  });
});

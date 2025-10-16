import { TestBed } from '@angular/core/testing';

import { MissionService } from '../mission-service/mission.service';
import { RocketService } from './rocket.service';
import { TEST_MISSIONS, TEST_MISSION_ID, TEST_ROCKET_ID } from 'testing/test-data';
/**
 * Unit tests for the {@link RocketService}.
 *
 * This test suite sets up the Angular testing environment and verifies
 * that the {@link RocketService} can be instantiated and functions correctly.
 */
describe('RocketService', () => {
  let rocketService: RocketService;
  /**
   * Sets up the testing module for RocketService.
   * This function is called before each test to ensure a fresh instance of the service.
   */
  beforeEach(() => {
    // reseting data for tests
    const missionService = TestBed.inject(MissionService);
    missionService.setMissions(TEST_MISSIONS);
    rocketService = TestBed.inject(RocketService);
    rocketService.setRockets(TEST_MISSION_ID, []);
  });

  /**
   * Checks that the RocketService is instantiated successfully.
   */
  it('should be created', () => {
    expect(rocketService).toBeTruthy();
  });

  /**
   * Verifies that the initial rocket array is returned correctly.
   * Checks that the result is an array, contains elements, and the first rocket has the expected name.
   */
  it('should return initial rocket array', () => {
    // GIVEN
    rocketService.setRockets(TEST_MISSION_ID, TEST_MISSIONS[0].rockets);
    // WHEN
    const actualRockets = rocketService.getRockets(TEST_MISSION_ID);
    // THEN
    expect(Array.isArray(actualRockets)).toBeTrue();
    expect(actualRockets.length).toBeGreaterThan(0);
    expect(actualRockets).toEqual(TEST_MISSIONS[0].rockets);
  });

  /**
   * Ensures that rockets are retrieved for a specific mission.
   * Checks that the result is an array, contains rockets, and the first rocket has the expected ID.
   */
  it('should get rockets for a specific mission', () => {
    // GIVEN
    rocketService.setRockets(TEST_MISSION_ID, TEST_MISSIONS[0].rockets);
    // WHEN
    const actualRockets = rocketService.getRockets(TEST_MISSION_ID);
    // THEN
    expect(Array.isArray(actualRockets)).toBeTrue();
    expect(actualRockets.length).toBeGreaterThan(0);
    expect(actualRockets).toEqual(TEST_MISSIONS[0].rockets);
  });

  /**
   * Checks if a specific rocket can be retrieved by mission and rocket ID.
   * Verifies that the returned rocket exists and has the expected name.
   */
  it('should get a specific rocket by id', () => {
    // GIVEN
    rocketService.setRockets(TEST_MISSION_ID, TEST_MISSIONS[0].rockets);
    // WHEN
    const actualRocket = rocketService.getRocket(
      TEST_MISSION_ID,
      TEST_ROCKET_ID
    );
    // THEN
    expect(actualRocket).toBeTruthy();
    expect(actualRocket).toEqual(TEST_MISSIONS[0].rockets[0]);
  });

  /**
   * Tests the creation of a new rocket in a mission.
   * Ensures the created rocket is added and matches the test data.
   */
  it('should create a new rocket in a mission', () => {
    // GIVEN
    // WHEN
    rocketService.createRocket(TEST_MISSION_ID, { ...TEST_MISSIONS[0].rockets[0] });
    // THEN
    const actualRockets = rocketService.getRockets(TEST_MISSION_ID);
    const actualRocket = actualRockets.find(
      (emp) => emp.name === TEST_MISSIONS[0].rockets[0].name
    );
    expect(actualRocket?.id).toBeGreaterThan(0);
    const expectedRocket = { ...TEST_MISSIONS[0].rockets[0] };
    expectedRocket.id = actualRocket?.id ?? -1;
    expect(actualRocket).toEqual(expectedRocket);
  });

  /**
   * Tests updating an rocket's information.
   * Verifies that the rocket's data is updated by checking the new name.
   */
  it('should update an rocket', () => {
    // GIVEN
    rocketService.setRockets(TEST_MISSION_ID, TEST_MISSIONS[0].rockets);
    const updatedRocket = {
      ...TEST_MISSIONS[0].rockets[0],
      name: 'UpdatedName',
    };
    // WHEN
    rocketService.updateRocket(TEST_MISSION_ID, updatedRocket);
    // THEN
    const actualRocket = rocketService.getRocket(
      TEST_MISSION_ID,
      TEST_ROCKET_ID
    );
    expect(actualRocket?.name).toBe('UpdatedName');
  });

  /**
   * Tests deleting an rocket from a mission.
   * Ensures the rocket is removed and cannot be retrieved.
   */
  it('should delete an rocket', () => {
    // GIVEN
    rocketService.setRockets(TEST_MISSION_ID, TEST_MISSIONS[0].rockets);
    // WHEN
    rocketService.deleteRocket(TEST_MISSION_ID, TEST_ROCKET_ID);
    // THEN
    const actualRocket = rocketService.getRocket(
      TEST_MISSION_ID,
      TEST_ROCKET_ID
    );
    expect(actualRocket).toBeUndefined();
  });
});

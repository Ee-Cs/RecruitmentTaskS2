import { TestBed } from '@angular/core/testing';

import { MissionService } from '../mission-service/mission.service';
import { RocketPoolService } from './rocket-pool.service';
import { TEST_MISSIONS, TEST_MISSION_ID, TEST_ROCKET_POOL } from 'testing/test-data';
/**
 * Unit tests for the {@link RocketPoolService}.
 *
 * This test suite sets up the Angular testing environment and verifies
 * that the {@link RocketPoolService} can be instantiated and functions correctly.
 */
describe('RocketPoolService', () => {
  let missionService: MissionService;
  let rocketPoolService: RocketPoolService;
  /**
   * Sets up the testing module for RocketPoolService.
   * This function is called before each test to ensure a fresh instance of the service.
   */
  beforeEach(() => {
    // reseting data for tests
    missionService = TestBed.inject(MissionService);
    missionService.setMissions(TEST_MISSIONS);

    rocketPoolService = TestBed.inject(RocketPoolService);
    rocketPoolService.setRockets(TEST_ROCKET_POOL);
  });

  /**
   * Checks that the RocketPoolService is instantiated successfully.
   */
  it('should be created', () => {
    expect(rocketPoolService).toBeTruthy();
  });

  /**
   * Verifies that the initial rocket array is returned correctly.
   * Checks that the result is an array, contains elements, and the first rocket has the expected name.
   */
  it('should return initial rocket array', () => {
    // GIVEN
    rocketPoolService.setRockets(TEST_ROCKET_POOL);
    // WHEN
    const actualRockets = rocketPoolService.getRockets();
    // THEN
    expect(Array.isArray(actualRockets)).toBeTrue();
    expect(actualRockets.length).toBeGreaterThan(0);
    expect(actualRockets).toEqual(TEST_ROCKET_POOL);
  });
  /**
  * Tests creating unassigned rocket.
  * Ensures the rocket is created.
  */
  it('should create unassigned rocket', () => {
    // GIVEN
    const testRocketName = 'new test rocket';
    // WHEN
    rocketPoolService.createUnassignedRocket(testRocketName);
    // THEN
    const actualRocketPool = rocketPoolService.getRockets();
    TEST_ROCKET_POOL.forEach(() => {
      expect(actualRocketPool?.find(roc => roc.name === testRocketName)).toBeDefined();
    });
  });
  /**
   * Tests assigning a rocket to the mission.
   * Ensures the rocket is removed from the rocket pool and added to the mission.
   */
  it('should assign a rocket to the mission', () => {
    // GIVEN
    missionService.setMissions(TEST_MISSIONS);
    const assignFlag = true;
    // WHEN
    rocketPoolService.transferRockets(
      TEST_MISSION_ID,
      TEST_ROCKET_POOL,
      assignFlag
    );
    // THEN
    const actualRocketPool = rocketPoolService.getRockets();
    TEST_ROCKET_POOL.forEach(rocket => {
      expect(actualRocketPool?.find(roc => roc.id === rocket.id)).toBeUndefined();
    });
    const actualMission = missionService.getMission(TEST_MISSION_ID);
    TEST_ROCKET_POOL.forEach(rocket => {
      expect(actualMission?.rockets.find(roc => roc.id === rocket.id)).toBeDefined();
    });
  });
  /**
  * Tests unassigning a rocket from the mission.
  * Ensures the rocket is removed from the mission and added to the rocket pool.
  */
  it('should unassign a rocket from the mission', () => {
    // GIVEN
    missionService.setMissions(TEST_MISSIONS);
    const transferedRockets = TEST_MISSIONS[0].rockets;
    const assignFlag = false;
    // WHEN
    rocketPoolService.transferRockets(
      TEST_MISSION_ID,
      transferedRockets,
      assignFlag
    );
    // THEN
    const actualMission = missionService.getMission(TEST_MISSION_ID);
    transferedRockets.forEach(rocket => {
      expect(actualMission?.rockets.find(emp => emp.id === rocket.id)).toBeUndefined();
    });
    const actualRocketPool = rocketPoolService.getRockets();
    TEST_ROCKET_POOL.forEach(rocket => {
      expect(actualRocketPool?.find(roc => roc.id === rocket.id)).toBeDefined();
    });
  });
});




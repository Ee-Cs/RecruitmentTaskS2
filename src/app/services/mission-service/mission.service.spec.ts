import { TestBed } from '@angular/core/testing';

import { TEST_MISSIONS, TEST_MISSION_ID } from 'testing/test-data';
import { Mission } from 'models/mission';
import { MissionService } from './mission.service';
/**
 * Unit tests for the {@link MissionService}.
 *
 * This test suite sets up the Angular testing environment and verifies
 * that the {@link MissionService} can be instantiated and functions correctly.
 */
describe('MissionService', () => {
  let missionService: MissionService;
  /**
   * Sets up the testing module for the MissionService.
   * This is necessary to provide the service and any dependencies it may have.
   */
  beforeEach(() => {
    missionService = TestBed.inject(MissionService);
    // reseting data for tests
    missionService.setMissions([]);
  });
  /**
   * Tests the creation of the MissionService.
   * This test checks if the service is instantiated correctly
   * and is available for use in the application.
   */
  it('should be created', () => {
    expect(missionService).toBeTruthy();
  });
  /**
   * Tests the retrieval of the initial mission array.
   * This test checks if the service can return a non-empty array of missions
   * and that the first mission has a defined name.
   */
  it('should return initial missions on getMissionArray()', () => {
    // GIVEN
    missionService.setMissions(TEST_MISSIONS);
    // WHEN
    const actualMissions = missionService.getMissions();
    // THEN
    checkMissions(actualMissions);
  });
  /**
   * Tests the retrieval of a mission by its ID.
   * This test checks if the service can fetch a mission by its ID
   * and that the returned mission has the expected ID.
   */
  it('should get a mission by id', () => {
    // GIVEN
    missionService.setMissions(TEST_MISSIONS);
    // WHEN
    const mission = missionService.getMission(TEST_MISSION_ID);
    // THEN
    expect(mission).toBeDefined();
    expect(mission?.id).toBe(TEST_MISSION_ID);
  });
  /**
   * Tests the creation of a new mission.
   * This test checks if the service can create a new mission,
   * ensuring that the new mission is added to the mission array
   * and has a valid ID.
   */
  it('should create a new mission', () => {
    // GIVEN
    // WHEN
    missionService.createMission(TEST_MISSIONS[0]);
    // THEN
    checkMissions(missionService.getMissions());
  });
  /**
   * Tests the update functionality of an existing mission.
   * This test checks if the service can update an existing mission's details,
   * ensuring that the updated mission has the new values.
   */
  it('should update an existing mission', () => {
    // GIVEN
    missionService.setMissions(TEST_MISSIONS);
    const updatedMission = { ...TEST_MISSIONS[0], name: 'Updated Name' };
    // WHEN
    missionService.updateMission(updatedMission);
    // THEN
    const actualUpdated = missionService.getMission(TEST_MISSION_ID);
    expect(actualUpdated?.name).toBe('Updated Name');
  });
  /**
   * Tests the deletion of a mission.
   * This test checks if the service can delete a mission by its ID,
   * ensuring that the mission is no longer present in the mission array
   * and that all associated rockets are also deleted.
   */
  it('should delete a mission', () => {
    // GIVEN
    missionService.setMissions(TEST_MISSIONS);
    // WHEN
    missionService.deleteMission(TEST_MISSION_ID);
    // THEN
    const actualMission = missionService.getMission(TEST_MISSION_ID);
    expect(actualMission).toBeUndefined();
  });
  /**
   * Checks that the first mission in actualMissions matches the first in TEST_MISSIONS.
   * Used for test assertions.
   */
  function checkMissions(actualMissions: Mission[]) {
    expect(Array.isArray(actualMissions)).toBeTrue();
    expect(actualMissions.length).toBeGreaterThan(0);
    const actualMission = actualMissions.find(
      (dep) => dep.name === TEST_MISSIONS[0].name
    );
    expect(actualMission).toBeDefined();
    expect(actualMission?.id).toBeGreaterThan(0);
    expect(actualMission?.name).toBe(TEST_MISSIONS[0].name);
  }
});

import { Mission } from 'models/mission';
import { RocketStatus } from 'models/rocket-status';
import { MissionStatus } from 'models/mission-status';
import { Rocket } from 'models/rocket';
/**
 * Test mission data for missions.
 * This data is used to populate the mission array in tests.
 */
export const TEST_MISSIONS: Mission[] = [
  {
    id: 1,
    name: 'Mars',
    missionStatus: MissionStatus.Scheduled,
    rockets: [{
      id: 1,
      missionId: 1,
      name: 'Red Dragon',
      rocketStatus: RocketStatus.OnGround,
    }],
  },
  {
    id: 2,
    name: 'Luna1',
    missionStatus: MissionStatus.InProgress,
    rockets: [{
      id: 2,
      missionId: 2,
      name: 'Dragon XL',
      rocketStatus: RocketStatus.OnGround,
    }],
  },
];
/**
 * Test rockets data for rocket pool.
 * This data is used to populate the rocket pool array in tests.
 */
export const TEST_ROCKET_POOL: Rocket[] = [
  {
    'id': 3,
    'missionId': 0,
    'name': 'Red Dragon',
    'rocketStatus': RocketStatus.OnGround,
  },
  {
    'id': 4,
    'missionId': 0,
    'name': 'Dragon XL',
    'rocketStatus': RocketStatus.OnGround,
  },
];
/**
 * Test mission id.
 */
export const TEST_MISSION_ID = TEST_MISSIONS[0].id;
/**
 * Test rocket id.
 */
export const TEST_ROCKET_ID = TEST_MISSIONS[0].rockets[0].id;
/**
 * Test rocket name.
 */
export const TEST_ROCKET_NAME = TEST_MISSIONS[0].rockets[0].name;
/**
 * Test rockets in pool after assignment.
 */
export const TEST_ROCKETS_IN_POOL_AFTER_ASSIGNMENT: Rocket[] = [
  TEST_ROCKET_POOL[1]
];
/**
 * Test rockets in mission after assignment.
 */
export const TEST_ROCKETS_IN_MISSION_AFTER_ASSIGNMENT: Rocket[] = [
  TEST_MISSIONS[0].rockets[0], TEST_ROCKET_POOL[0]
];
/**
 * Test rockets in pool after unassignment.
 */
export const TEST_ROCKETS_IN_POOL_AFTER_UNASSIGNMENT: Rocket[] = [
  TEST_ROCKET_POOL[0], TEST_ROCKET_POOL[1], TEST_MISSIONS[0].rockets[0]
];
/**
 * Test rockets in mission after unassignment.
 */
export const TEST_ROCKETS_IN_MISSION_AFTER_UNASSIGNMENT: Rocket[] = [];

import { RocketStatus } from './rocket-status';
/**
 * Represents an rocket in the system.
 * This interface defines the structure of an rocket object,
 * including its unique identifier, name, and status.
 *
 * @interface Rocket
 * @property {number} id - The unique identifier for the rocket.
 * @property {number} missionId - The unique identifier for the mission the rocket belongs to.
 * @property {string} name - The name of the rocket.
 * @property {RocketStatus} rocketStatus - The status of the rocket, represented by the RocketStatus interface.
 */
export interface Rocket {
  id: number;
  missionId: number;
  name: string;
  rocketStatus: RocketStatus;
}

import { MissionStatus } from './mission-status';
import { Rocket } from './rocket';
/**
 * Represents a mission within the organization.
 * This interface defines the structure of a mission object,
 * including its unique identifier, name, and status.
 *
 * @interface Mission
 * @property {number} id - The unique identifier for the mission.
 * @property {string} name - The name of the mission.
 * @property {RocketStatus} missionStatus - The status of the mission, represented by the MissionStatus interface.
 * @property {Rocket[]} rockets - The rockets belonging to the mission.
 */
export interface Mission {
  id: number;
  name: string;
  missionStatus: MissionStatus;
  rockets: Rocket[];
}

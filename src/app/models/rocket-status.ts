/**
 * Represents the status of a rocket.
 * This enum defines the possible statuses a rocket can have.
 *
 * @enum {string}
 * @property {string} OnGround - Represents a rocket on ground.
 * @property {string} InSpace - Represents a rocket in space.
 * @property {string} InRepair - Represents a rocket in repair.
 */
export enum RocketStatus {
    OnGround = 'On Ground',
    InSpace = 'In Space',
    InRepair = 'In Repair',
}

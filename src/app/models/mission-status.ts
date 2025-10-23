/**
 * Represents the status of a mission.
 * This enum defines the possible statuses a mission can have.
 *
 * @enum {string}
 * @property {string} Scheduled - Represents a scheduled mission.
 * @property {string} Pending - Represents a pending mission.
 * @property {string} InProgress - Represents a mission in progress.
 * @property {string} Ended - Represents an ended mission.
 */
export enum MissionStatus {
    Scheduled = 'Scheduled',
    Pending = 'Pending',
    InProgress = 'In Progress',
    Ended = 'Ended',
}

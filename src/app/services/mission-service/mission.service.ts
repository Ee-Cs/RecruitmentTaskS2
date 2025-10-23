import { Injectable, InjectionToken, inject } from '@angular/core';

import { Mission } from 'models/mission';
/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * Service for managing missions.
 * This service provides methods to create, read, update, and delete missions.
 * It uses local storage to persist mission data across sessions.
 * It also interacts with the RocketService to manage rockets associated with missions.
 */
@Injectable({
  providedIn: 'root',
})
export class MissionService {
  storage = inject<Storage>(BROWSER_STORAGE);
  /**
   * Gets the mission array.
   * Retrieves the mission array from local storage,
   * parses it from JSON format,
   * and returns it as an array of Mission objects.
   * If the storage is empty, it returns an empty array.
   *
   * @returns an array of Mission objects
   */
  getMissions(): Mission[] {
    const json = this.storage.getItem('missions') ?? '';
    console.log('MissionService.getMissions():');
    return JSON.parse(json) as Mission[];
  }
  /**
   * Sets the mission array.
   * Converts an array of missions to a JSON string and puts it in the storage.
   *
   * @param missions the array of missions to be stored
   * @returns void
   */
  setMissions(missions: Mission[]) {
    const json = JSON.stringify(missions) ?? '';
    this.storage.setItem('missions', json);
  }
  /**
   * Gets the mission by id.
   * Retrieves a specific mission by its id from the mission array.
   * If the mission with the given id does not exist, it returns undefined.
   *
   * @param id the id of the mission to retrieve
   * @returns the Mission object if found, otherwise undefined
   */
  getMission(id: number): Mission | undefined {
    const missions = this.getMissions();
    console.log('MissionService.getMission(): id[%d]', id);
    return missions.find((mission) => mission.id === id);
  }
  /**
   * Creates a new mission.
   * Generates a new mission with a unique id,
   * adds it to the mission array, and updates the storage.
   *
   * @param mission the mission to be created
   * @return void
   */
  createMission(mission: Mission) {
    let missions = this.getMissions();
    if (missions.length === 0) {
      mission.id = 1;
      missions = [mission];
    } else {
      mission.id = missions.map(dep => dep?.id ?? 0)
        .reduce((id1, id2) => Math.max(id1, id2)) + 1;
      missions.push(mission);
    }
    this.setMissions(missions);
  }
  /**
   * Updates an existing mission.
   * Replaces the existing mission in the mission array.
   *
   * @param mission the mission to be updated
   * @returns void
   */
  updateMission(mission: Mission) {
    const missions = this.getMissions();
    const index = missions.findIndex(dep => dep.id === mission.id);
    mission.rockets = missions[index].rockets;
    missions[index] = mission;
    this.setMissions(missions);
  }
  /**
   * Deletes a mission by its id.
   * Removes the mission from the mission array
   * and also deletes all rockets associated with that mission.
   *
   * @param id the id of the mission to be deleted
   * @returns void
   */
  deleteMission(id: number) {
    const missions = this.getMissions();
    const index = missions.findIndex((dep) => dep.id === id);
    missions.splice(index, 1);
    this.setMissions(missions);
  }
}

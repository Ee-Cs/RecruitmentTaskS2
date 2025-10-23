import { Injectable, InjectionToken, inject } from '@angular/core';

import { Rocket } from 'models/rocket';
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
 * Service for managing rocket data.
 * This service provides methods to get, set, create, update, delete, and transfer rockets
 * across missions.
 */
@Injectable({
  providedIn: 'root',
})
export class RocketService {
  storage = inject<Storage>(BROWSER_STORAGE);
  /**
   * Sets the rocket array.
   * This method takes an array of rockets,
   * converts it to JSON format, and stores it in the storage.
   *
   * @param rocketArray the rocket array
   * @returns void
   */
  setRockets(missionId: number, rockets: Rocket[]) {
    let json = this.storage.getItem('missions') ?? '';
    const missions = JSON.parse(json) as Mission[];
    const mission = missions.find(dep => dep.id === missionId);
    if (mission) {
      mission.rockets = rockets;
    }
    json = JSON.stringify(missions) ?? '';
    console.log('RocketService.setRockets(): mission id[%s]', missionId);
    this.storage.setItem('missions', json);
  }
  /**
   * Gets the rockets for a specific mission.
   * This method retrieves the rocket array and returns the rockets
   *
   * @param missionId the mission id
   * @returns an array of rockets for the specified mission
   */
  getRockets(missionId: number): Rocket[] {
    const rockets = (JSON.parse(this.storage.getItem('missions') ?? '') as Mission[])
      .find(dep => dep.id === missionId)
      ?.rockets
      .sort((emp1, emp2) => emp1.id - emp2.id) || [];
    console.log('RocketService.getRockets(): mission id[%s]', missionId);
    return rockets;
  }
  /**
   * Gets a specific rocket by id from a mission.
   * This method retrieves the rocket array,
   * finds the rocket with the specified id in the specified mission,
   * and returns it.
   *
   * @param missionId the mission id
   * @param rocketId the rocket id
   * @return the rocket with the specified id, or undefined if not found
   */
  getRocket(missionId: number, rocketId: number): Rocket | undefined {
    const rocket = this.getRockets(missionId).find(emp => emp.id === rocketId);
    console.log('RocketService.getRocket(): mission id[%s], rocket id[%s]', missionId, rocketId);
    return rocket;
  }
  /**
   * Creates a new rocket in the specified mission.
   * This method generates a new rocket ID based on the existing rockets in the mission,
   * adds the new rocket to the mission's rocket array,
   * and updates the storage with the new rocket array.
   *
   * @param missionId the mission id
   * @param rocket the rocket to create
   * @return void
   */
  createRocket(missionId: number, rocket: Rocket) {
    rocket.id = this.getNextRocketId();
    const rockets = this.getRockets(missionId);
    rockets.push(rocket);
    this.setRockets(missionId, rockets);
  }
  /**
   * Updates the rocket.
   * This method finds the rocket in the specified mission's rocket array
   * and updates its details with the provided rocket object.
   *
   * @param missionId the mission id
   * @param rocket the rocket to update
   * @return void
   */
  updateRocket(missionId: number, rocket: Rocket) {
    const rockets = this.getRockets(missionId);
    const empIndex = rockets.findIndex(emp => emp.id === rocket.id);
    if (empIndex !== -1) {
      rockets[empIndex] = rocket;
    }
    this.setRockets(missionId, rockets);
  }
  /**
   * Deletes the rocket from the specified mission.
   * This method finds the rocket in the specified mission's rocket array
   * and removes it from the array.
   *
   * @param missionId the mission id
   * @param rocketId the rocket id
   * @return void
   */
  deleteRocket(missionId: number, rocketId: number) {
    const rockets = this.getRockets(missionId);
    const empIndex = rockets.findIndex(emp => emp.id === rocketId);
    if (empIndex !== -1) {
      rockets.splice(empIndex, 1);
    }
    this.setRockets(missionId, rockets);
  }
  /**
   * Returns the next available rocket id:
   * (maximum id found in all missions' rockets) + 1.
   * If there are no rockets, returns 1.
   * @return id
   */
  private getNextRocketId(): number {
    const json = this.storage.getItem('missions') ?? '';
    const missions = JSON.parse(json) as Mission[];
    const rocketIds = missions.flatMap(dep => dep.rockets).map(emp => emp.id);
    return rocketIds.length > 0 ? Math.max(...rocketIds) + 1 : 1;
  };

}

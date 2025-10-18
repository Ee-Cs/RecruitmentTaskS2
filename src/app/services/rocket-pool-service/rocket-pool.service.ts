import { Injectable, InjectionToken, inject } from '@angular/core';
import { Mission } from 'models/mission';

import { Rocket } from 'models/rocket';
import { RocketStatus } from 'models/rocket-status';
import { MissionService } from 'services/mission-service/mission.service';

/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * Service for managing rocket pool.
 * This service provides methods to create, and read rockets.
 * It uses local storage to persist rocket data across sessions.
 */
@Injectable({
  providedIn: 'root',
})
export class RocketPoolService {
  storage = inject<Storage>(BROWSER_STORAGE);
  private missionService: MissionService = inject(MissionService);

  /**
   * Gets the rockets array.
   * Retrieves the rockets array from local storage,
   * parses it from JSON format,
   * and returns it as an array of Rocket objects.
   * If the storage is empty, it returns an empty array.
   *
   * @returns an array of Rocket objects
   */
  getRockets(): Rocket[] {
    let json = this.storage.getItem('rockets') as string;
    if (!json) {
      json = JSON.stringify([]);
      this.storage.setItem('rockets', '[]');
    }
    const rockets: Rocket[] = JSON.parse(json) as Rocket[];
    console.log('RocketPoolService.getRockets(): rockets count[%d]', rockets.length);
    return rockets;
  }
  /**
   * Sets the rockets array.
   * Converts an array of rockets to a JSON string and puts it in the storage.
   *
   * @param rockets the array of rockets to be stored
   * @returns void
   */
  setRockets(rockets: Rocket[]) {
    const json = JSON.stringify(rockets) ?? '';
    this.storage.setItem('rockets', json);
  }
  /**
   * Creates the unassigned the rocket.
   *
   * @param name the rocket name
   * @returns void
   */
  createUnassignedRocket(name: string) {
    const rocket: Rocket = {
      id: this.getNextRocketId(),
      missionId: 0,
      name: name,
      rocketStatus: RocketStatus.OnGround,
    };
    const poolRockets = this.getRockets();
    poolRockets.push(rocket);
    this.setRockets(poolRockets);
  }

  /**
   * Transfers a list of rockets.
   *
   * @param missionId the source mission id
   * @param rockets the list of the rockets to transfer
   * @param assignFlag the assign flag
   * @return void
   */
  transferRockets(
    missionId: number,
    rockets: Rocket[],
    assignFlag: boolean
  ) {
    const missions = this.missionService.getMissions();
    const mission = missions.find(mis => mis.id === missionId);
    if (!mission) {
      console.log('MissionService.transferRockets(): error - mission is undefined');
      return;
    }
    const poolRockets = this.getRockets();
    rockets.forEach(rocket => {
      if (assignFlag) {
        rocket.missionId = missionId;
        const rocIndex = poolRockets.findIndex(roc => roc.id === rocket.id);
        if (rocIndex !== -1) {
          poolRockets.splice(rocIndex, 1);
          mission.rockets.push(rocket);
        }
      } else {
        rocket.missionId = 0;
        const rocIndex = mission.rockets.findIndex(roc => roc.id === rocket.id);
        if (rocIndex !== -1) {
          mission.rockets.splice(rocIndex, 1);
          poolRockets.push(rocket);
        }
      }
    });
    this.setRockets(poolRockets);
    this.missionService.setMissions(missions);
    console.log('MissionService.transferRockets(): mission id[%s], assignFlag[%s]',
      missionId, assignFlag);
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

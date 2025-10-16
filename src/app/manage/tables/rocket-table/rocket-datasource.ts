import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { Rocket } from 'models/rocket';
import { RocketService } from 'services/rocket-service/rocket.service';
/**
 * Data source for the Rocket Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class RocketDataSource extends DataSource<Rocket> {
  private rocketService: RocketService = inject(RocketService);
  rockets: Rocket[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  missionId = 0;

  /**
   * Sets the mission id.
   *
   * @param missionId the mission id
   */
  setMissionId(missionId: number) {
    this.missionId = missionId;
    this.rockets = this.rocketService.getRockets(missionId);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Rocket[]> {
    if (!this.paginator || !this.sort) {
      const msg = 'Please set the paginator and sort on the data before connecting.';
      console.log('RocketDataSource.connect(): missionId[%d], ', this.missionId, msg);
      throw Error(msg);
    }
    return merge(observableOf(this.rockets), this.paginator.page, this.sort.sortChange)
      .pipe(
        map(() => this.getPagedData(this.getSortedData([...this.rockets])))
      );
  }

  /**
   * Called when the table is being destroyed. Use this function to clean up
   * any open connections or free any held resources that were set up during connect.
   * This is a no-op in this implementation, as there are no resources to clean up.
   *
   * @return void
   */
  disconnect(): void {
    // No resources to clean up
  }

  /**
   * Paginates the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   *
   * @param rockets The array of rockets to be paginated.
   * @returns The paginated array of rockets.
   */
  private getPagedData(rockets: Rocket[]): Rocket[] {
    if (!this.paginator) {
      return rockets;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return rockets.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sorts the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   *
   * @param rockets The array of rockets to be sorted.
   * @returns The sorted array of rockets.
   */
  private getSortedData(rockets: Rocket[]): Rocket[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return rockets;
    }
    return rockets.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id':
          return this.compare(+a.id, +b.id, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'rocketStatus':
          return this.compare(a.rocketStatus.substring(2), b.rocketStatus.substring(2), isAsc);
        default:
          return 0;
      }
    });
  }
  /**
   * Compares two values and returns a number indicating their relative order.
   * This function is used for sorting the data in the table.
   */
  private compare(
    a: string | number,
    b: string | number,
    isAsc: boolean
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

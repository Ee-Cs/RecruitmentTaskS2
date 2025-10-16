import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { Mission } from 'models/mission';
import { MissionService } from 'services/mission-service/mission.service';
/**
 * Data source for the Mission Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class MissionDataSource extends DataSource<Mission> {
  private missionService: MissionService = inject(MissionService);
  missions: Mission[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns An observable of the items to be rendered by the table.
   */
  connect(): Observable<Mission[]> {
    if (!this.paginator || !this.sort) {
      const msg = 'Please set the paginator and sort on the data before connecting.';
      console.log('MissionDataSource.connect(): %s', msg);
      throw Error(msg);
    }
    this.missions = this.missionService.getMissions();
    return merge(observableOf(this.missions), this.paginator.page, this.sort.sortChange)
      .pipe(
        map(() => this.getPagedData(this.getSortedData([...this.missions])))
      );
  }
  /**
   * Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   *
   * @returns void
   */
  disconnect(): void {
    // No resources to clean up in this implementation.
  }
  /**
   * Paginate the data (client-side). This method slices the data array based on the current
   * page index and page size. If you switch to using server-side pagination, this method
   * should be replaced with a call to the server to fetch the appropriate page of data.
   *
   * @param missions The array of missions to be paginated.
   * @returns The paginated array of missions.
   */
  private getPagedData(missions: Mission[]): Mission[] {
    if (!this.paginator) {
      return missions;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return missions.slice(startIndex, startIndex + this.paginator.pageSize);
  }
  /**
   * Sort the data (client-side). This method sorts the data array based on the active
   * sort field and direction. If you switch to using server-side sorting, this method
   * should be replaced with a call to the server to fetch the appropriately sorted data.
   *
   * @param missions The array of missions to be sorted.
   * @returns The sorted array of missions.
   */
  private getSortedData(missions: Mission[]): Mission[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return missions;
    }
    return missions.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id':
          return this.compare(+a.id, +b.id, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'missionStatus':
          return this.compare(a.missionStatus.substring(2), b.missionStatus.substring(2), isAsc);
        default:
          return 0;
      }
    });
  }
  /**
   * Compare two values and return a number indicating their relative order.
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

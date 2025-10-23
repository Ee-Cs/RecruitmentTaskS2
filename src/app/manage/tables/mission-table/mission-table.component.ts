import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { Mission } from 'models/mission';
import { MissionDataSource } from './mission-datasource';
import { AppTools } from '../../../app.tools';
/**
 * MissionTableComponent is a component that displays a table of missions.
 * It uses Angular Material's table features to display, sort, and paginate the
 * mission data.
 * This component also provides methods to create, update, delete missions,
 * and read rockets associated with a mission.
 */
@Component({
  selector: 'app-mission-table',
  templateUrl: './mission-table.component.html',
  styleUrl: './mission-table.component.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
})
export class MissionTableComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Mission>;
  dataSource = new MissionDataSource();
  appTools = new AppTools(); 
  displayedColumns = ['id', 'name', 'missionStatus', 'actions'];
  /** Local input model for the search box */
  filterText = '';
  /**
   * A component lifecycle hook method.
   * Runs once after the component's view has been initialized.
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    console.log('🟩MissionTableComponent.ngAfterViewInit():');
  }
  /**
   * Creates a new mission.
   * This method navigates to the mission form with the 'CREATE' action
   * and a placeholder id of '-1'.
   *
   * @returns void
   */
  createMission() {
    this.router.navigate(['/mission-form', 'CREATE', '-1'], {
      relativeTo: this.route,
    });
    console.log('🟩MissionTableComponent.createMission():');
  }
  /**
   * Updates the mission.
   * This method navigates to the mission form with the 'UPDATE' action
   * and the specified mission id.
   *
   * @param id the mission id
   * @returns void
   */
  updateMission(id: number) {
    this.router.navigate(['/mission-form', 'UPDATE', id], {
      relativeTo: this.route,
    });
    console.log('🟩MissionTableComponent.updateMission(): id[%d]', id);
  }
  /**
   * Deletes the mission.
   * This method navigates to the mission form with the 'DELETE' action
   * and the specified mission id.
   *
   * @param id the mission id
   * @returns void
   */
  deleteMission(id: number) {
    this.router.navigate(['/mission-form', 'DELETE', id], {
      relativeTo: this.route,
    });
    console.log('🟩MissionTableComponent.deleteMission(): id[%d]', id);
  }
  /**
   * Manage the rockets of the mission.
   * This method navigates to the rocket table with the specified mission id.
   *
   * @param id the mission id
   * @returns void
   */
  manageRockets(id: number) {
    this.router.navigate(['/rocket-table', id], {
      relativeTo: this.route,
    });
    console.log('🟩MissionTableComponent.manageRockets(): mission id[%d]', id);
  }
  /**
   * Gets the length of the missions array.
   */
  get missionsLength(): number {
    return this.dataSource.filteredLength ?? this.dataSource.missions?.length ?? 0;
  }
  /**
   * Apply a filter string to the datasource (search by name)
   * @param value the value
   */
  applyFilter(value: string) {
    this.filterText = value ?? '';
    this.dataSource.setFilter(this.filterText);
  }
}

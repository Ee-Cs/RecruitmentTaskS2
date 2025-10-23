import { AfterViewInit, Component, ViewChild, inject, OnInit } from '@angular/core';
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

import { Rocket } from 'models/rocket';
import { RocketDataSource } from './rocket-datasource';
import { MissionService } from 'services/mission-service/mission.service';
import { AppTools } from '../../../app.tools';
/**
 * RocketTableComponent is a component that displays a table of rockets.
 * It uses Angular Material's table features to display, sort, and paginate the
 * rocket data.
 * This component also provides methods to create, update, delete rockets,
 * and read details of a specific rocket.
 */
@Component({
  selector: 'app-rocket-table',
  templateUrl: './rocket-table.component.html',
  styleUrl: './rocket-table.component.css',
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
export class RocketTableComponent implements AfterViewInit, OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Rocket>;
  private missionService: MissionService = inject(MissionService);
  missionId = '';
  missionName = '';
  dataSource = new RocketDataSource();
  appTools = new AppTools(); 
  displayedColumns = ['id', 'name', 'rocketStatus', 'actions'];
  /** Local input model for the search box */
  filterText = '';

  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   */
  ngOnInit() {
    this.missionId = this.route.snapshot.paramMap.get('missionId') ?? '';
    const mission = this.missionService.getMission(+this.missionId);
    this.missionName = mission?.name ?? '';
    this.dataSource.setMissionId(+this.missionId);
  }
  /**
   * A component lifecycle hook method.
   * Runs once after the component's view has been initialized.
   *
   * https://angular.dev/guide/components/lifecycle#ngafterviewinit
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    console.log('🟩RocketTableComponent.ngAfterViewInit():');
  }
  /**
   * Creates a new rocket.
   * This method navigates to the rocket form with the 'CREATE' action
   * and a placeholder id of '-1'.
   *
   * @param void
   * @returns void
   */
  createRocket() {
    this.router.navigate(
      ['/rocket-form', this.missionId, 'CREATE', '-1'],
      {
        relativeTo: this.route,
      }
    );
    console.log('🟩RocketTableComponent.createRocket():');
  }
  /**
   * Updates the rocket.
   * This method navigates to the rocket form with the 'UPDATE' action
   * and the specified rocket id.
   *
   * @param id the rocket id
   * @returns void
   */
  updateRocket(id: number) {
    this.router.navigate(['/rocket-form', this.missionId, 'UPDATE', id], {
      relativeTo: this.route,
    });
    console.log('🟩RocketTableComponent.updateRocket(): id[%d]', id);
  }
  /**
   * Deletes the rocket.
   * This method navigates to the rocket form with the 'DELETE' action
   * and the specified rocket id.
   *
   * @param id the rocket id
   * @returns void
   */
  deleteRocket(id: number) {
    this.router.navigate(['/rocket-form', this.missionId, 'DELETE', id], {
      relativeTo: this.route,
    });
    console.log('🟩RocketTableComponent.deleteRocket(): id[%d]', id);
  }
  /**
   * Navigates to the missions table.
   *
   * @returns void
   */
  navigateToMissions() {
    this.router.navigate(['/mission-table'], { 
      relativeTo: this.route
    });
  }
  /**
   * Gets the length of the rockets array.
   */
  get rocketsLength(): number {
    return this.dataSource.filteredLength ?? this.dataSource.rockets?.length ?? 0;
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

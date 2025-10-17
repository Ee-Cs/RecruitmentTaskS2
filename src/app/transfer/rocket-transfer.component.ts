import { inject, OnInit, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTable } from '@angular/material/table';

import { Mission } from 'models/mission';
import { Rocket } from 'models/rocket';
import { RocketStatus } from 'models/rocket-status';
import { MissionService } from 'services/mission-service/mission.service';
import { RocketService } from 'services/rocket-service/rocket.service';
import { RocketPoolService } from 'services/rocket-pool-service/rocket-pool.service';

/**
 * A component for transferring rockets between missions.
 */
@Component({
  selector: 'app-rocket-transfer',
  templateUrl: './rocket-transfer.component.html',
  styleUrl: './rocket-transfer.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatTable,
    MatTableModule,
  ],
})
export class RocketTransferComponent implements OnInit {
 private route = inject(ActivatedRoute);
 private router = inject(Router);

  @ViewChild(MatTable) table!: MatTable<Rocket>;
  private missionService: MissionService = inject(MissionService);
  private rocketService: RocketService = inject(RocketService);
  private rocketPoolService: RocketPoolService = inject(RocketPoolService);
  private formBuilder = inject(FormBuilder);
  private emptyMission = { id: 0, name: '' };
  leftSideForm = this.formBuilder.group({
    leftSideSelect: this.emptyMission,
  });
  rightSideForm = this.formBuilder.group({
    rightSideSelect: this.emptyMission,
  });
  missionId = 0;
  missions: Mission[] = [];
  leftSideRockets: Rocket[] = [];
  rightSideRockets: Rocket[] = [];
  displayedColumns = ['select', 'id', 'name'];
  leftSideSelection = new SelectionModel<Rocket>(true, []);
  rightSideSelection = new SelectionModel<Rocket>(true, []);
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   *
   * https://angular.dev/guide/components/lifecycle#ngoninit
   * @returns void
   */
  ngOnInit() {
    this.leftSideRockets = this.rocketPoolService.getRockets();
    this.missions = this.missionService.getMissions();
    if (this.missions.length > 1) {
      this.selectMission(this.missions[0].id);
    }
    console.log('🟦RocketTransferComponent.ngOnInit():');
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
      ['/unassigned-rocket-form'],
      {
        relativeTo: this.route,
      }
    );
    console.log('🟦RocketTransferComponent.createRocket():');
  }
  /**
   * Selects the missions on the right side.
   *
   * @param missionId the mission id
   * @returns void
   */
  selectMission(missionId: number) {
    this.missionId = missionId;
    const index = this.missions.findIndex(dep => dep.id === missionId);
    this.rightSideForm.controls.rightSideSelect.setValue(this.missions[index]);
    this.rightSideRockets = this.rocketService.getRockets(missionId)
      .filter(r => r.rocketStatus === RocketStatus.OnGround || r.rocketStatus === RocketStatus.InRepair);
    console.log(
      '🟦RocketTransferComponent.selectMission():  mission id[%d]', missionId);
  }
  /**
   * Transfers the rockets.
   *
   * @param side the side
   * @returns void
   */
  transferRockets(side: 'LEFT-SIDE' | 'RIGHT-SIDE') {
    if (side === 'LEFT-SIDE') {
      this.rocketPoolService.transferRockets(
        +this.missionId,
        this.leftSideSelection.selected,
        true
      );
    } else {
      this.rocketPoolService.transferRockets(
        +this.missionId,
        this.rightSideSelection.selected,
        false
      );
    }
    this.leftSideSelection.clear();
    this.rightSideSelection.clear();
    this.leftSideRockets = this.rocketPoolService.getRockets();
    this.rightSideRockets = this.rocketService.getRockets(+this.missionId)
      .filter(r => r.rocketStatus === RocketStatus.OnGround || r.rocketStatus === RocketStatus.InRepair);
    console.log(
      '🟦RocketTransferComponent.transferRockets(): side[%s], mission id[%d]', side, this.missionId
    );
  }
  /**
   * Disables transfer button.
   *
   * @param side the side
   * @returns the flag
   */
  disableTransferButton(side: 'LEFT-SIDE' | 'RIGHT-SIDE'): boolean {
    if (side === 'LEFT-SIDE') {
      return (this.leftSideSelection.selected.length === 0);
    } else {
      return (this.rightSideSelection.selected.length === 0);
    }
  }
  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   *
   * @param side the side
   * @returns void
   */
  toggleAllRows(side: 'LEFT-SIDE' | 'RIGHT-SIDE') {
    if (side === 'LEFT-SIDE') {
      if (this.isAllSelected('LEFT-SIDE')) {
        this.leftSideSelection.clear();
      } else {
        this.leftSideSelection.select(...this.leftSideRockets);
      }
    } else {
      if (this.isAllSelected('RIGHT-SIDE')) {
        this.rightSideSelection.clear();
      } else {
        this.rightSideSelection.select(...this.rightSideRockets);
      }
    }
  }
  /**
   * The label for the checkbox on the passed row
   *
   * @param side the side
   * @param row the row
   * @returns the checkbox label
   */
  checkboxLabel(side: 'LEFT-SIDE' | 'RIGHT-SIDE', row?: Rocket): string {
    if (side === 'LEFT-SIDE') {
      if (!row) {
        return `${this.isAllSelected('LEFT-SIDE') ? 'deselect' : 'select'} all`;
      } else {
        return `${this.leftSideSelection.isSelected(row) ? 'deselect' : 'select'
          } row ${row.id + 1}`;
      }
    } else {
      if (!row) {
        return `${this.isAllSelected('RIGHT-SIDE') ? 'deselect' : 'select'
          } all`;
      } else {
        return `${this.rightSideSelection.isSelected(row) ? 'deselect' : 'select'
          } row ${row.id + 1}`;
      }
    }
  }
  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   * @param side the side
   * @returns the flag
   */
  isAllSelected(side: 'LEFT-SIDE' | 'RIGHT-SIDE'): boolean {
    if (side === 'LEFT-SIDE') {
      return (
        this.leftSideSelection.selected.length === this.leftSideRockets.length
      );
    } else {
      return (
        this.rightSideSelection.selected.length === this.rightSideRockets.length
      );
    }
  }
}

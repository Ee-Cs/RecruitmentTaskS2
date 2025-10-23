import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';

import { Mission } from 'models/mission';
import { Rocket } from 'models/rocket';
import { MissionService } from 'services/mission-service/mission.service';
import { RocketService } from 'services/rocket-service/rocket.service';
import { RocketPoolService } from 'services/rocket-pool-service/rocket-pool.service';
import { RocketTransferComponent } from './rocket-transfer.component';
import * as testData from 'testing/test-data';

let doneTransferFromLeftToRight = false;
let doneTransferFromRightToLeft = false;
const missionServiceSpy = jasmine.createSpyObj('MissionService', ['getMissions']);
missionServiceSpy.getMissions.and
  .callFake((): Mission[] => {
    return [...testData.TEST_MISSIONS];
  });
const rocketServiceSpy = jasmine.createSpyObj('RocketService', ['getRockets']);
rocketServiceSpy.getRockets.and
  .callFake((missionId: number): Rocket[] => {
    if (missionId == testData.TEST_MISSIONS[0].id) {
      if (doneTransferFromLeftToRight) {
        return [...testData.TEST_ROCKETS_IN_MISSION_AFTER_ASSIGNMENT];
      } else if (doneTransferFromRightToLeft) {
        return [...testData.TEST_ROCKETS_IN_MISSION_AFTER_UNASSIGNMENT];
      } else {
        return [...testData.TEST_MISSIONS[0].rockets];
      }
    } if (missionId == testData.TEST_MISSIONS[1].id) {
      return [...testData.TEST_MISSIONS[1].rockets];
    } else {
      return [...testData.TEST_MISSIONS[2].rockets];
    }
  });
const rocketPoolServiceSpy = jasmine.createSpyObj('RocketPoolService', ['getRockets', 'transferRockets']);
rocketPoolServiceSpy.getRockets.and
  .callFake((): Rocket[] => {
    if (doneTransferFromLeftToRight) {
      return [...testData.TEST_ROCKETS_IN_POOL_AFTER_ASSIGNMENT];
    } else if (doneTransferFromRightToLeft) {
      return [...testData.TEST_ROCKETS_IN_POOL_AFTER_UNASSIGNMENT];
    } else {
      return [...testData.TEST_ROCKET_POOL];
    }
  });
/**
 * The tests of the RocketTransferComponent.
 */
describe('RocketTransferComponent', () => {
  let component: RocketTransferComponent;
  let fixture: ComponentFixture<RocketTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RocketTransferComponent,
        ReactiveFormsModule,
        MatTableModule,
        MatGridListModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        MatListModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
        { provide: MissionService, useValue: missionServiceSpy },
        { provide: RocketService, useValue: rocketServiceSpy },
        { provide: RocketPoolService, useValue: rocketPoolServiceSpy },
      ],
    })
      .compileComponents();

    doneTransferFromLeftToRight = false;
    doneTransferFromRightToLeft = false;
    rocketPoolServiceSpy.transferRockets.calls.reset();
    fixture = TestBed.createComponent(RocketTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });
  /**
   * Tests that the RocketTransferComponent compiles successfully.
   * This is a basic test to ensure that the component can be created without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
    console.log('compile');
  });
  /**
   * Tests that  the mission dropdowns are populated.
   */
  it('should populate mission dropdowns', async () => {
    // GIVEN
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    const matSelects = fixture.debugElement.queryAll(By.css('mat-select'));
    // THEN
    expect(matSelects.length).toBe(1, 'Should have 2 mission selects');
    matSelects[0].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const options = fixture.debugElement.queryAll(By.css('mat-option'));
    expect(options.length).toBe(testData.TEST_MISSIONS.length);
    expect(options[0].nativeElement.textContent).toContain(
      testData.TEST_MISSIONS[0].name
    );
    console.log('should populate mission dropdowns');
  });
  /**
   * Tests that the rocket tables for left side are rendered.
   */
  it('should render left rocket tables', async () => {
    // GIVEN
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    const tables = fixture.debugElement.queryAll(By.css('table.rocket-pool-table'));
    // THEN
    expect(tables.length).toBe(1);
    // WHEN
    const rows = tables[0].queryAll(By.css('td'));
    // THEN
    expect(rows.length).toBe(6);
    const testRocket = testData.TEST_ROCKET_POOL[0];
    expect(rows[1].nativeElement.textContent).toContain(testRocket.id);
    expect(rows[2].nativeElement.textContent).toContain(testRocket.name);
    console.log('should render left rocket tables');
  });
  /**
   * Tests that the rocket tables for right side are rendered.
   */
  it('should render right rocket tables', async () => {
    // GIVEN
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    const tables = fixture.debugElement.queryAll(By.css('table.rocket-table'));
    // THEN
    expect(tables.length).toBe(1);
    // WHEN
    const rows = tables[0].queryAll(By.css('td'));
    // THEN
    expect(rows.length).toBe(3);
    const testRocket = testData.TEST_MISSIONS[0].rockets[0];
    expect(rows[1].nativeElement.textContent).toContain(testRocket.id);
    expect(rows[2].nativeElement.textContent).toContain(testRocket.name);
    console.log('should render right rocket tables');
  });
  /**
   * Tests that the selection for a row and update checkbox are toggled.
   */
  it('should toggle selection for a left side row and update checkbox', async () => {
    // GIVEN
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    const tables = fixture.debugElement.queryAll(By.css('table.rocket-pool-table'));
    const checkbox = tables[0].query(By.css('td'));
    const selection = component.leftSideSelection;
    // THEN
    expect(selection.selected.length).toBe(0);
    // WHEN
    checkbox.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    // THEN
    expect(selection.selected.length).toBe(1);
    // WHEN
    checkbox.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    // THEN
    expect(selection.selected.length).toBe(0);
    console.log('should toggle selection for a left side row and update checkbox');
  });
  /**
   * Tests that the selection for a row and update checkbox are toggled.
   */
  it('should toggle selection for a right side row and update checkbox', async () => {
    // GIVEN
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    const tables = fixture.debugElement.queryAll(By.css('table.rocket-table'));
    const checkbox = tables[0].query(By.css('td'));
    const selection = component.rightSideSelection;
    // THEN
    expect(selection.selected.length).toBe(0);
    // WHEN
    checkbox.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    // THEN
    expect(selection.selected.length).toBe(1);
    // WHEN
    checkbox.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    // THEN
    expect(selection.selected.length).toBe(0);
    console.log('should toggle selection for a right side row and update checkbox');
  });
  /**
   * Tests that all rows when header checkbox is clicked are toggled.
   */
  [
    {
      testName: 'should toggle all rows on the left side when header checkbox is clicked',
      tableCssClass: 'table.rocket-pool-table',
      getSelection: (component: RocketTransferComponent) => component.leftSideSelection,
    },
    {
      testName: 'should toggle all rows on the right side when header checkbox is clicked',
      tableCssClass: 'table.rocket-table',
      getSelection: (component: RocketTransferComponent) => component.rightSideSelection,
    },
  ].forEach(({ testName, tableCssClass, getSelection }) =>
    it(testName, async () => {
      // GIVEN
      fixture.detectChanges();
      await fixture.whenStable();
      // WHEN
      const tables = fixture.debugElement.queryAll(By.css(tableCssClass));
      const headerCheckbox = tables[0].query(By.css('th'));
      const selection = getSelection(component);
      headerCheckbox.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      // THEN
      expect(selection.selected.length).toBe(0);
      // WHEN
      headerCheckbox.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      // THEN
      expect(selection.selected.length).toBe(0);
      console.log(testName);
    })
  );
  /**
   * Tests that rocket from left to right and right to left is transfered.
   */
  [
    {
      testName: 'should transfer rocket from left to right',
      setTransferDoneFlag: () => { doneTransferFromLeftToRight = true; },
      rocket: testData.TEST_ROCKET_POOL[0],
      selectRocket: (component: RocketTransferComponent) => component.leftSideSelection.select(testData.TEST_ROCKET_POOL[0]),
      transfer: (component: RocketTransferComponent) => component.transferRockets('LEFT-SIDE'),
      sourceRockets: (component: RocketTransferComponent) => component.leftSideRockets,
      targetRockets: (component: RocketTransferComponent) => component.rightSideRockets,
    },
    {
      testName: 'should transfer rocket from right to left',
      setTransferDoneFlag: () => { doneTransferFromRightToLeft = true; },
      rocket: testData.TEST_MISSIONS[0].rockets[0],
      selectRocket: (component: RocketTransferComponent) => component.rightSideSelection.select(testData.TEST_MISSIONS[0].rockets[0]),
      transfer: (component: RocketTransferComponent) => component.transferRockets('RIGHT-SIDE'),
      sourceRockets: (component: RocketTransferComponent) => component.rightSideRockets,
      targetRockets: (component: RocketTransferComponent) => component.leftSideRockets,
    },
  ].forEach(
    ({
      testName,
      setTransferDoneFlag,
      rocket,
      selectRocket,
      transfer,
      sourceRockets,
      targetRockets,
    }) =>
      it(testName, async () => {
        // GIVEN
        fixture.detectChanges();
        await fixture.whenStable();
        selectRocket(component);
        fixture.detectChanges();
        await fixture.whenStable();
        setTransferDoneFlag();
        // WHEN
        transfer(component);
        // THEN
        fixture.detectChanges();
        await fixture.whenStable();
        expect(sourceRockets(component).find(roc => roc.id === rocket.id)).toBeUndefined();
        expect(targetRockets(component).find(roc => roc.id === rocket.id)).toBeDefined();
        console.log(testName);
      })
  );
  /**
   * Tests that correct checkbox labels are provided.
   */
  [
    {
      testName: 'should provide correct checkbox labels on the left side',
      side: 'LEFT-SIDE',
      getSelection: (component: RocketTransferComponent) => component.leftSideSelection,
    },
    {
      testName: 'should provide correct checkbox labels on the right side',
      side: 'RIGHT-SIDE',
      getSelection: (component: RocketTransferComponent) => component.rightSideSelection,
    },
  ].forEach(({ testName, side, getSelection }) =>
    it(testName, async () => {
      // GIVEN
      fixture.detectChanges();
      await fixture.whenStable();
      const rocket = testData.TEST_MISSIONS[0].rockets[0]
      expect(component.checkboxLabel(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE')).toContain('select');
      // WHEN
      getSelection(component).select(rocket);
      // THEN
      expect(component.checkboxLabel(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE', rocket)).toContain('deselect');
      // WHEN
      getSelection(component).clear();
      // THEN
      expect(component.checkboxLabel(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE', rocket)).toContain('select');
      console.log(testName);
    })
  );
  /**
   * Tests that it correctly reports if all rows are selected.
   */
  [
    {
      testName: 'should correctly report if all rows are selected on the left side',
      side: 'LEFT-SIDE',
      getSelection: (component: RocketTransferComponent) => component.leftSideSelection,
      getRockets: () => testData.TEST_ROCKET_POOL,
    },
    {
      testName: 'should correctly report if all rows are selected on the right side',
      side: 'RIGHT-SIDE',
      getSelection: (component: RocketTransferComponent) => component.rightSideSelection,
      getRockets: () => testData.TEST_MISSIONS[1].rockets,
    },
  ].forEach(({ side, testName, getSelection, getRockets }) =>
    it(testName, async () => {
      // GIVEN
      fixture.detectChanges();
      await fixture.whenStable();
      // WHEN
      // THEN
      expect(component.isAllSelected(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE')).toBeFalse();
      // WHEN
      getRockets().forEach(emp => getSelection(component).select(emp));
      // THEN
      expect(component.isAllSelected(side === 'LEFT-SIDE' ? 'LEFT-SIDE' : 'RIGHT-SIDE')).toBeTrue();
      console.log(testName);
    })
  );
  /**
   * Tests that rockets when mission selection changes are updated.
   */
  it('should update rockets when mission selection changes', fakeAsync(async () => {
    // GIVEN
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    // THEN
    expect(component.rightSideRockets[0].id).toBe(testData.TEST_MISSIONS[0].rockets[0].id);
    component.selectMission(testData.TEST_MISSIONS[1].id);
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    tick();
    // THEN
    expect(component.rightSideRockets.length).toBe(1);
    expect(component.rightSideRockets[0].id).toBe(testData.TEST_MISSIONS[1].rockets[0].id);
    console.log('should update rockets when mission selection changes');
  }));
  /**
   * Tests that rockets in space are absent for unassignment.
   */
  it('should not present rockets in space', fakeAsync(async () => {
    // GIVEN
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    // THEN
    expect(component.rightSideRockets[0].id).toBe(testData.TEST_MISSIONS[0].rockets[0].id);
    component.selectMission(testData.TEST_MISSIONS[2].id);
    fixture.detectChanges();
    await fixture.whenStable();
    // WHEN
    tick();
    // THEN
    expect(component.rightSideRockets.length).toBe(0);
    console.log('should not present rockets in space');
  }));
});

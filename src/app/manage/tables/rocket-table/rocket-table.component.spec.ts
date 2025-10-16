import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RocketTableComponent } from './rocket-table.component';
import { Mission } from 'models/mission';
import { Rocket } from 'models/rocket';
import { MissionService } from 'services/mission-service/mission.service';
import { RocketService } from 'services/rocket-service/rocket.service';
import * as testData from 'testing/test-data';

const missionServiceSpy = jasmine.createSpyObj('MissionService', ['getMission']);
missionServiceSpy.getMission.and
  .callFake((id: number): Mission | undefined => {
    return testData.TEST_MISSIONS.find(dep => dep.id === id);
  });
const rocketServiceSpy = jasmine.createSpyObj('RocketService', ['getRockets']);
rocketServiceSpy.getRockets.and
  .callFake((missionId: number): Rocket[] => {
    const mission = testData.TEST_MISSIONS.find(dep => dep.id === missionId);
    return mission ? mission.rockets : [];
  });
/**
 * RocketTableComponent is a component that displays a table of rockets.
 * It uses Angular Material's table features to display, sort, and paginate the
 * rocket data.
 * This component also provides methods to create, update, delete rockets,
 * and read details of a specific rocket.
 */
describe('RocketTableComponent', () => {
  let component: RocketTableComponent;
  let fixture: ComponentFixture<RocketTableComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  /**
   * Sets up the testing module for the RocketTableComponent.
   * This includes importing necessary modules and compiling the component.
   */
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [RocketTableComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MissionService, useValue: missionServiceSpy },
        { provide: RocketService, useValue: rocketServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              missionId: testData.TEST_MISSION_ID,
            }),
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'missionId') return testData.TEST_MISSION_ID;
                  return null;
                },
              },
            },
          },
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(RocketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Tests that the RocketTableComponent compiles successfully.
   * This is a basic test to ensure that the component can be created without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  /**
   * Tests that the ngAfterViewInit method sets the dataSource.sort, dataSource.paginator,
   * and table.dataSource properties correctly.
   * This method is expected to be called after the view has been initialized.
   * It checks if the dataSource and table properties are set up correctly for the Angular Material table.
   */
  it('should set dataSource sort, paginator, and table dataSource on ngAfterViewInit', () => {
    // GIVEN
    const mockSort = {} as import('@angular/material/sort').MatSort;
    const mockPaginator =
      {} as import('@angular/material/paginator').MatPaginator;
    const mockTable = {
      dataSource: null,
    } as unknown as import('@angular/material/table').MatTable<Rocket>;
    component.sort = mockSort;
    component.paginator = mockPaginator;
    component.table = mockTable;
    // WHEN
    component.ngAfterViewInit();
    // THEN
    expect(component.dataSource.sort).toBe(mockSort);
    expect(component.dataSource.paginator).toBe(mockPaginator);
    expect(component.table.dataSource).toBe(component.dataSource);
  });
  /**
   * Tests that the displayedColumns property is set correctly.
   * This property defines the columns that will be displayed in the mission table.
   * It checks if the displayedColumns array matches the expected column names.
   */
  it('should have displayedColumns set correctly', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component.displayedColumns).toEqual([
      'id',
      'name',
      'rocketStatus',
      'actions',
    ]);
  });
  /**
   * Tests that the createRocket method navigates to the create rocket form.
   * This method is expected to navigate to the rocket form for creating a new rocket.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should navigate to create rocket form on createRocket', () => {
    // GIVEN
    // WHEN
    component.createRocket();
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/rocket-form', testData.TEST_MISSION_ID, 'CREATE', '-1'],
      { relativeTo: jasmine.any(Object) }
    );
  });
  /**
   * Tests that the updateRocket method navigates to the update rocket form.
   * This method is expected to navigate to the rocket form for updating an existing rocket.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should navigate to update rocket form on updateRocket', () => {
    // GIVEN
    // WHEN
    component.updateRocket(testData.TEST_ROCKET_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/rocket-form', testData.TEST_MISSION_ID, 'UPDATE', testData.TEST_ROCKET_ID],
      { relativeTo: jasmine.any(Object) }
    );
  });
  /**
   * Tests that the deleteRocket method navigates to the delete rocket form.
   * This method is expected to navigate to the rocket form for deleting an existing rocket.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should navigate to delete rocket form on deleteRocket', () => {
    // GIVEN
    // WHEN
    component.deleteRocket(testData.TEST_ROCKET_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/rocket-form', testData.TEST_MISSION_ID, 'DELETE', testData.TEST_ROCKET_ID],
      { relativeTo: jasmine.any(Object) }
    );
  });
});

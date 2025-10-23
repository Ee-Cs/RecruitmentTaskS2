import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { MissionTableComponent } from './mission-table.component';
import { Mission } from 'models/mission';
import { MissionService } from 'services/mission-service/mission.service';
import * as testData from 'testing/test-data';

const missionServiceSpy = jasmine.createSpyObj('MissionService', ['getMissions']);
missionServiceSpy.getMissions.and
  .callFake((): Mission[] => {
    return [...testData.TEST_MISSIONS];
  });
/**
 * MissionTableComponent is a component that displays a table of missions.
 * It uses Angular Material's table features to display, sort, and paginate the
 * mission data.
 * This component also provides methods to create, update, delete missions,
 * and read missions associated with a specific mission.
 * It is part of the tables module and is used to manage mission-related data.
 */
describe('MissionTableComponent', () => {
  let component: MissionTableComponent;
  let fixture: ComponentFixture<MissionTableComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeStub: Partial<ActivatedRoute>;
  /**
   * Sets up the testing module for the MissionTableComponent.
   * This includes importing necessary modules and compiling the component.
   * @returns void
   */
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = {};
    await TestBed.configureTestingModule({
      imports: [MissionTableComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: MissionService, useValue: missionServiceSpy },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MissionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Tests that the MissionTableComponent compiles successfully.
   * This is a basic test to ensure that the component can be created without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  /**
   * Tests that the ngAfterViewInit method sets the dataSource.sort, dataSource.paginator, and table.dataSource properties correctly.
   * This method is expected to be called after the view has been initialized.
   * It checks if the dataSource and table properties are set up correctly for the Angular Material table.
   */
  it('should set dataSource.sort, dataSource.paginator, and table.dataSource in ngAfterViewInit', () => {
    // GIVEN
    const mockSort = {} as import('@angular/material/sort').MatSort;
    const mockPaginator =
      {} as import('@angular/material/paginator').MatPaginator;
    const mockTable = {
      dataSource: null,
    } as unknown as import('@angular/material/table').MatTable<Mission>;
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
      'missionStatus',
      'actions',
    ]);
  });
  /**
   * Tests that the createMission method calls router.navigate with the correct parameters.
   * This method is expected to navigate to the mission form for creating a new mission.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should call router.navigate with correct params when createMission is called', () => {
    // GIVEN
    // WHEN
    component.createMission();
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/mission-form', 'CREATE', '-1'],
      { relativeTo: TestBed.inject(ActivatedRoute) }
    );
  });
  /**
   * Tests that the updateMission method calls router.navigate with the correct parameters.
   * This method is expected to navigate to the mission form for updating an existing mission.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should call router.navigate with correct params when updateMission is called', () => {
    // GIVEN
    // WHEN
    component.updateMission(testData.TEST_MISSION_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/mission-form', 'UPDATE', testData.TEST_MISSION_ID],
      { relativeTo: TestBed.inject(ActivatedRoute) }
    );
  });
  /**
   * Tests that the deleteMission method calls router.navigate with the correct parameters.
   * This method is expected to navigate to the mission form for deleting an existing mission.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should call router.navigate with correct params when deleteMission is called', () => {
    // GIVEN
    // WHEN
    component.deleteMission(testData.TEST_MISSION_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/mission-form', 'DELETE', testData.TEST_MISSION_ID],
      { relativeTo: TestBed.inject(ActivatedRoute) }
    );
  });
  /**
   * Tests that the viewMissions method calls router.navigate with the correct parameters.
   * This method is expected to navigate to the mission table for a specific mission.
   * It checks if the router's navigate method is called with the correct route and parameters.
   */
  it('should call router.navigate with correct params when viewMissions is called', () => {
    // GIVEN
    // WHEN
    component.manageRockets(testData.TEST_MISSION_ID);
    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/rocket-table', testData.TEST_MISSION_ID],
      {
        relativeTo: TestBed.inject(ActivatedRoute),
      }
    );
  });
});

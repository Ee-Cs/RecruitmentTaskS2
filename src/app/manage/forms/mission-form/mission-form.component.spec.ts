import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { of } from 'rxjs';

import { MissionFormComponent } from './mission-form.component';
import { Mission } from 'models/mission';
import { MissionStatus } from 'models/mission-status';
import { MissionService } from 'services/mission-service/mission.service';
import * as testData from 'testing/test-data';

/**
 * Unit tests for the MissionFormComponent.
 * This component is part of the forms module and is used to manage mission-related forms.
 */
describe('MissionFormComponent', () => {
  let component: MissionFormComponent;
  let missionServiceSpy: jasmine.SpyObj<MissionService>;
  let fixture: ComponentFixture<MissionFormComponent>;
  /**
   * Sets up the testing module and compiles the component before each test.
   * The NoopAnimationsModule is imported to avoid issues with animations during testing.
   */
  beforeEach(waitForAsync(() => {
    missionServiceSpy = jasmine.createSpyObj('MissionService', [
      'getMissions', 'getMission', 'createMission', 'updateMission', 'deleteMission'
    ]);
    missionServiceSpy.getMissions.and
      .callFake((): Mission[] => {
        return [...testData.TEST_MISSIONS];
      });
    missionServiceSpy.getMission.and
      .callFake((id: number): Mission | undefined => {
        return testData.TEST_MISSIONS.find(dep => dep.id === id);
      });

    TestBed.configureTestingModule({
      providers: [
        provideNativeDateAdapter(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
        { provide: MissionService, useValue: missionServiceSpy }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  /**
   * Tests that the component is created successfully.
   * This is a basic test to ensure that the component can be instantiated without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  /**
   * Tests the initialization of the form for the CREATE operation.
   * This test checks that the form is set up with default values
   * when the operation is set to 'CREATE'.
   */
  it('should initialize form with default values for CREATE operation', () => {
    // GIVEN
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.callFake((key: string) => {
      if (key === 'operation') return 'CREATE';
      if (key === 'id') return null;
      return null;
    });
    // WHEN
    component.ngOnInit();
    // THEN
    expect(component.formTitle).toBe('Create Mission');
    expect(component.buttonLabel).toBe('Create');
    expect(component.missionForm.value.name).toBe('');
  });
  /**
   * Tests the submission of the form for the CREATE operation.
   * This test checks that the createMission method is called with the correct parameters.
   */
  it('should call missionService.createMission on CREATE submit', () => {
    // GIVEN
    const missionService = (component as MissionFormComponent)
      .missionService;
    component.operation = 'CREATE';
    component.missionForm.controls['name'].setValue(
      testData.TEST_MISSIONS[0].name
    );
    // WHEN
    component.onSubmit();
    // THEN
    expect(missionService.createMission).toHaveBeenCalledWith({
      id: -1,
      name: testData.TEST_MISSIONS[0].name,
      missionStatus: MissionStatus.Scheduled,
      rockets: []
    });
  });

  /**
   * Tests the submission of the form for the UPDATE operation.
   * This test checks that the updateMission method is called with the correct parameters.
   */
  it('should call missionService.updateMission on UPDATE submit', () => {
    // GIVEN
    const missionService = (component as MissionFormComponent)
      .missionService;
    component.operation = 'UPDATE';
    component.id = testData.TEST_MISSION_ID.toString();
    component.missionForm.controls['name'].setValue(
      testData.TEST_MISSIONS[0].name
    );
    // WHEN
    component.onSubmit();
    // THEN
    expect(missionService.updateMission).toHaveBeenCalledWith({
      id: testData.TEST_MISSION_ID,
      name: testData.TEST_MISSIONS[0].name,
      missionStatus: MissionStatus.Scheduled,
      rockets: [],
    });
  });
  /**
   * Tests the submission of the form for the DELETE operation.
   * This test checks that the deleteMission method is called with the correct parameters.
   */
  it('should call missionService.deleteMission on DELETE submit', () => {
    // GIVEN
    const missionService = (component as MissionFormComponent)
      .missionService;
    component.operation = 'DELETE';
    component.id = testData.TEST_MISSION_ID.toString();
    // WHEN
    component.onSubmit();
    // THEN
    expect(missionService.deleteMission).toHaveBeenCalledWith(
      testData.TEST_MISSION_ID
    );
  });
  /**
   * Tests the cancellation of the form.
   * This test checks that the form is reset and the router
   * navigates to the mission list when the cancel button is clicked.
   */
  it('should reset form and navigate on cancel', () => {
    // GIVEN
    const router: import('@angular/router').Router = (
      component as MissionFormComponent
    )['router'];
    spyOn(router, 'navigate');
    spyOn(component.missionForm, 'reset');
    // WHEN
    component.onCancel();
    // THEN
    expect(component.missionForm.reset).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });
});

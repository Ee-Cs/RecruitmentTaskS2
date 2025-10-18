import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RocketFormComponent } from './rocket-form.component';
import { Rocket } from 'models/rocket';
import { RocketStatus } from 'models/rocket-status';
import { RocketService } from 'services/rocket-service/rocket.service';
import * as testData from 'testing/test-data';

/**
 * Unit tests for the RocketFormComponent.
 * This component is part of the forms module and is used to manage rocket-related forms.
 * The component uses Angular Material components for UI elements and Reactive Forms for form handling.
 * It is designed to create, update, or delete rocket records.
 */
describe('RocketFormComponent', () => {
  let component: RocketFormComponent;
  let rocketServiceSpy: jasmine.SpyObj<RocketService>;
  let fixture: ComponentFixture<RocketFormComponent>;
  /**
   * Sets up the testing module and compiles the component before each test.
   */
  beforeEach(async () => {
    rocketServiceSpy = jasmine.createSpyObj('RocketService', [
      'getRockets', 'getRocket', 'createRocket', 'updateRocket', 'deleteRocket'
    ]);
    rocketServiceSpy.getRockets.and
      .callFake((missionId: number): Rocket[] => {
        const mission = testData.TEST_MISSIONS.find(dep => dep.id === missionId);
        return mission ? mission.rockets : [];
      });
    rocketServiceSpy.getRocket.and
      .callFake((missionId: number, rocketId: number): Rocket | undefined => {
        return rocketServiceSpy.getRockets(missionId)
          .find((emp: { id: number; }) => emp.id === rocketId);
      });

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
        { provide: RocketService, useValue: rocketServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RocketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Test if the component compiles successfully.
   * This is a basic test to ensure that the component can be instantiated without errors.
   */
  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  /**
   * Test if the component initializes the form with default values for CREATE operation.
   */
  it('should initialize form with default values for CREATE operation', () => {
    // GIVEN
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.callFake((key: string) => {
      if (key === 'operation') return 'CREATE';
      if (key === 'missionId') return testData.TEST_MISSION_ID.toString();
      return null;
    });
    // WHEN
    component.ngOnInit();
    // THEN
    expect(component.operation).toBe('CREATE');
    expect(component.formTitle).toBe('Create Rocket');
    expect(component.buttonLabel).toBe('Create');
    expect(component.missionId).toBe(testData.TEST_MISSION_ID.toString());
    expect(component.id).toBe('');
    expect(component.rocketStatuses.length).toBe(3);
    expect(component.rocketStatuses[0]).toBe(RocketStatus.OnGround);
    expect(component.rocketStatuses[1]).toBe(RocketStatus.InSpace);
    expect(component.rocketStatuses[2]).toBe(RocketStatus.InRepair);
    expect(component.rocketForm).toBeDefined();
    expect(component.rocketForm.valid).toBeFalse();
    expect(component.rocketForm.get('name')?.value).toBe('');
    expect(component.rocketForm.get('rocketStatus')?.value).toBeDefined();
    expect(component.rocketForm.get('rocketStatus')?.value).toBe(
      component.rocketStatuses[0]
    );
  });
  /**
   * Test if the component calls the createRocket method on submit for CREATE operation.
   */
  it('should call createRocket on submit for CREATE operation', () => {
    // GIVEN
    const rocketService = component.rocketService;
    component.operation = 'CREATE';
    component.missionId = testData.TEST_MISSION_ID.toString();
    const testRocket = testData.TEST_MISSIONS[0].rockets[0];
    component.rocketForm.controls['name'].setValue(testRocket.name);
    component.rocketForm.controls['rocketStatus'].setValue(testRocket.rocketStatus);
    // WHEN
    component.onSubmit();
    // THEN
    const actualCreatedRocket = { ...testRocket, id: -1, missionId: testData.TEST_MISSION_ID };
    expect(rocketService.createRocket).toHaveBeenCalledWith(
      testData.TEST_MISSION_ID,
      jasmine.objectContaining(actualCreatedRocket)
    );
  });
  /**
   * Test if the component initializes the form with existing rocket data for UPDATE operation.
   */
  it('should initialize form with rocket data for UPDATE operation', () => {
    // GIVEN
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.callFake((key: string) => {
      if (key === 'operation') return 'UPDATE';
      if (key === 'missionId') return testData.TEST_MISSION_ID.toString();
      if (key === 'id') return testData.TEST_ROCKET_ID.toString();
      return null;
    });
    const testRocket = testData.TEST_MISSIONS[0].rockets[0];
    // WHEN
    component.ngOnInit();
    // THEN
    expect(component.operation).toBe('UPDATE');
    expect(component.formTitle).toBe('Update Rocket');
    expect(component.buttonLabel).toBe('Update');
    expect(component.rocketForm.get('name')?.value).toBe(testRocket.name);
    expect(component.rocketForm.get('rocketStatus')?.value).toBe(testRocket.rocketStatus);
  });

  /**
   * Test if the component calls updateRocket on submit for UPDATE operation.
   */
  it('should call updateRocket on submit for UPDATE operation', () => {
    // GIVEN
    const rocketService = component.rocketService;
    component.operation = 'UPDATE';
    component.missionId = testData.TEST_MISSION_ID.toString();
    component.id = testData.TEST_ROCKET_ID.toString();
    const testRocket = testData.TEST_MISSIONS[0].rockets[0];
    component.rocketForm.controls.missionId.setValue(testRocket.missionId.toString());
    component.rocketForm.controls.name.setValue(testRocket.name);
    component.rocketForm.controls.rocketStatus.setValue(testRocket.rocketStatus);
    // WHEN
    component.onSubmit();
    // THEN
    const actualUpdatedRocket = { ...testRocket, missionId: testData.TEST_MISSION_ID };
    expect(rocketService.updateRocket).toHaveBeenCalledWith(
      testData.TEST_MISSION_ID,
      jasmine.objectContaining(actualUpdatedRocket)
    );
  });

  /**
   * Test if the component calls deleteRocket on submit for DELETE operation.
   */
  it('should call deleteRocket on submit for DELETE operation', () => {
    // GIVEN
    const rocketService = component.rocketService;
    component.operation = 'DELETE';
    component.missionId = testData.TEST_MISSION_ID.toString();
    component.id = testData.TEST_ROCKET_ID.toString();
    // WHEN
    component.onSubmit();
    // THEN
    expect(rocketService.deleteRocket).toHaveBeenCalledWith(
      testData.TEST_MISSION_ID,
      testData.TEST_ROCKET_ID
    );
  });

  /**
   * Test if the component resets the form and navigates on cancel.
   */
  it('should reset the form and navigate on cancel', () => {
    // GIVEN
    const router = component['router'];
    const route = TestBed.inject(ActivatedRoute);
    spyOn(component.rocketForm, 'reset');
    spyOn(router, 'navigate');
    component.missionId = testData.TEST_MISSION_ID.toString();
    // WHEN
    component.onCancel();
    // THEN
    expect(component.rocketForm.reset).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/rocket-table', testData.TEST_MISSION_ID.toString()],
      { relativeTo: route }
    );
  });

  /**
   * Test form validation: should be valid if required fields are present.
   */
  it('should be valid if required fields are present', () => {
    // GIVEN
    component.rocketForm.reset();
    // WHEN
    const testRocket = testData.TEST_MISSIONS[0].rockets[0];
    component.rocketForm.controls['name'].setValue(testRocket.name);
    component.rocketForm.controls['rocketStatus'].setValue(testRocket.rocketStatus);
    // THEN
    expect(component.rocketForm.valid).toBeTrue();
  });

  /**
   * Test form validation: should be invalid if required fields are missing.
   */
  it('should be invalid if required fields are missing', () => {
    // GIVEN
    component.rocketForm.reset();
    // WHEN
    component.rocketForm.controls['name'].setValue('');
    component.rocketForm.controls['rocketStatus'].setValue(null);
    // THEN
    expect(component.rocketForm.valid).toBeFalse();
  });

});

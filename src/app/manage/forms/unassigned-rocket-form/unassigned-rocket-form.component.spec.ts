import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UnassignedRocketFormComponent } from './unassigned-rocket-form.component';
import { Rocket } from 'models/rocket';
import { RocketPoolService } from 'services/rocket-pool-service/rocket-pool.service';
import * as testData from 'testing/test-data';

/**
 * Unit tests for the UnassignedRocketFormComponent.
 * This component is part of the forms module and is used to manage rocket-related forms.
 * The component uses Angular Material components for UI elements and Reactive Forms for form handling.
 * It is designed to create, update, or delete rocket records.
 */
describe('UnassignedRocketFormComponent', () => {
  let component: UnassignedRocketFormComponent;
  let rocketPoolServiceSpy: jasmine.SpyObj<RocketPoolService>;
  let fixture: ComponentFixture<UnassignedRocketFormComponent>;
  /**
   * Sets up the testing module and compiles the component before each test.
   */
  beforeEach(async () => {
    rocketPoolServiceSpy = jasmine.createSpyObj('RocketPoolService', [
      'getRockets', 'setRockets', 'createUnassignedRocket', 'transferRockets'
    ]);
    rocketPoolServiceSpy.getRockets.and
      .callFake((): Rocket[] => {
        return testData.TEST_ROCKET_POOL;
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
        { provide: RocketPoolService, useValue: rocketPoolServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UnassignedRocketFormComponent);
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
    expect(component.formTitle).toBe('Create Unassigned Rocket');
    expect(component.buttonLabel).toBe('Create');
    expect(component.unassignedRocketForm).toBeDefined();
    expect(component.unassignedRocketForm.valid).toBeFalse();
    expect(component.unassignedRocketForm.get('name')?.value).toBe('');
  });
  /**
   * Test if the component calls the createRocket method on submit for CREATE operation.
   */
  it('should call createRocket on submit for CREATE operation', () => {
    // GIVEN
    const rocketPoolService = component.rocketPoolService;
    const testRocket = testData.TEST_MISSIONS[0].rockets[0];
    component.unassignedRocketForm.controls['name'].setValue(testRocket.name);
    // WHEN
    component.onSubmit();
    // THEN
    expect(rocketPoolService.createUnassignedRocket).toHaveBeenCalledWith(testRocket.name);
  });

  /**
   * Test if the component resets the form and navigates on cancel.
   */
  it('should reset the form and navigate on cancel', () => {
    // GIVEN
    const router = component['router'];
    const route = TestBed.inject(ActivatedRoute);
    spyOn(component.unassignedRocketForm, 'reset');
    spyOn(router, 'navigate');
    // WHEN
    component.onCancel();
    // THEN
    expect(component.unassignedRocketForm.reset).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/transfer'],
      { relativeTo: route }
    );
  });

  /**
   * Test form validation: should be valid if required fields are present.
   */
  it('should be valid if required fields are present', () => {
    // GIVEN
    component.unassignedRocketForm.reset();
    // WHEN
    const testRocket = testData.TEST_MISSIONS[0].rockets[0];
    component.unassignedRocketForm.controls['name'].setValue(testRocket.name);
    // THEN
    expect(component.unassignedRocketForm.valid).toBeTrue();
  });

  /**
   * Test form validation: should be invalid if required fields are missing.
   */
  it('should be invalid if required fields are missing', () => {
    // GIVEN
    component.unassignedRocketForm.reset();
    // WHEN
    component.unassignedRocketForm.controls['name'].setValue('');
    // THEN
    expect(component.unassignedRocketForm.valid).toBeFalse();
  });
});

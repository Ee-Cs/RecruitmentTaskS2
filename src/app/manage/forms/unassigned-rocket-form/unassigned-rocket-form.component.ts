import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { RocketStatus } from 'models/rocket-status';
import { RocketPoolService } from 'services/rocket-pool-service/rocket-pool.service';
/**
 * RocketFormComponent is an Angular component that provides a form for creating the unassigned rocket.
 * It uses Angular Material components for UI elements and Reactive Forms for form handling.
 * This component is part of the forms module and is used to manage rocket-related forms.
 */
@Component({
  selector: 'app-rocket-form',
  templateUrl: './unassigned-rocket-form.component.html',
  styleUrl: './unassigned-rocket-form.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class UnassignedRocketFormComponent implements OnInit {
  public rocketPoolService = inject(RocketPoolService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  rocketStatuses: RocketStatus[] = [RocketStatus.OnGround, RocketStatus.InSpace, RocketStatus.InRepair];
  unassignedRocketForm = this.formBuilder.group({
    name: ['', Validators.required],
  });
  formTitle = '';
  buttonLabel = '';
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   */
  ngOnInit() {
    this.formTitle = 'Create Unassigned Rocket';
    this.buttonLabel = 'Create';
    this.unassignedRocketForm.controls.name.setValue('');
    console.log('🟢UnassignedRocketFormComponent.ngOnInit():');
  }
  /**
   * The submit action handler.
   * It creates, updates, or deletes an rocket based on the operation type.
   */
  onSubmit() {
    const name = this.unassignedRocketForm.get('name')?.value ?? '';
    this.rocketPoolService.createUnassignedRocket(name);
    console.log(
      '🟢UnassignedRocketFormComponent.onSubmit(): CREATE, name[%s]', name
    );
    this.router.navigate(['/transfer'], {
      relativeTo: this.route,
    });
  }
  /**
   * The cancel action handler.
   * It resets the form and navigates back to the rocket table.
   */
  onCancel() {
    this.unassignedRocketForm.reset();
    console.log('🟢UnassignedRocketFormComponent.onCancel():');
    this.router.navigate(['/transfer'], {
      relativeTo: this.route,
    });
  }
}

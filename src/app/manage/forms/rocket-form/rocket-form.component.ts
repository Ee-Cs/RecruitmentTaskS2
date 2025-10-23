import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Rocket } from 'models/rocket';
import { RocketStatus } from 'models/rocket-status';
import { RocketService } from 'services/rocket-service/rocket.service';
import { AppTools } from '../../../app.tools';
/**
 * RocketFormComponent is an Angular component that provides a form for creating, updating, or deleting an rocket.
 * It uses Angular Material components for UI elements and Reactive Forms for form handling.
 * This component is part of the forms module and is used to manage rocket-related forms.
 */
@Component({
  selector: 'app-rocket-form',
  templateUrl: './rocket-form.component.html',
  styleUrl: './rocket-form.component.css',
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
export class RocketFormComponent implements OnInit {
  public rocketService = inject(RocketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  rocketStatuses: RocketStatus[] = [RocketStatus.OnGround, RocketStatus.InSpace, RocketStatus.InRepair];
  rocketForm = this.formBuilder.group({
    missionId: [''],
    name: ['', Validators.required],
    rocketStatus: [RocketStatus.OnGround, Validators.required],
  });
  appTools = new AppTools(); 
  operation = '';
  formTitle = '';
  buttonLabel = '';
  missionId = '';
  id = '';
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   */
  ngOnInit() {
    this.operation = this.route.snapshot.paramMap.get('operation') ?? '';
    if (this.operation === 'CREATE') {
      this.formTitle = 'Create Rocket';
      this.buttonLabel = 'Create';
    } else if (this.operation === 'READ') {
      this.formTitle = 'Read Rocket';
      this.buttonLabel = 'Read';
    } else if (this.operation === 'UPDATE') {
      this.formTitle = 'Update Rocket';
      this.buttonLabel = 'Update';
    } else if (this.operation === 'DELETE') {
      this.formTitle = 'Delete Rocket';
      this.buttonLabel = 'Delete';
    }
    this.missionId = this.route.snapshot.paramMap.get('missionId') ?? '';
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    const rocket = this.rocketService.getRocket(+this.missionId, +this.id);
    this.rocketForm.controls.missionId.setValue(this.missionId);
    this.rocketForm.controls.name.setValue(rocket?.name ?? '');
    this.rocketForm.controls.rocketStatus.setValue(rocket?.rocketStatus ?? RocketStatus.OnGround);
    this.rocketForm.controls.rocketStatus.markAsPristine();
    this.rocketForm.controls.rocketStatus.markAsUntouched();
    this.rocketForm.controls.rocketStatus.updateValueAndValidity();
    console.log('🟢RocketFormComponent.ngOnInit():');
  }
  /**
   * The submit action handler.
   * It creates, updates, or deletes an rocket based on the operation type.
   */
  onSubmit() {
    if (this.operation === 'CREATE') {
      const rocket: Rocket = {
        id: -1,
        missionId: +this.missionId,
        name: this.rocketForm.get('name')?.value ?? '',
        rocketStatus: this.rocketForm.get('rocketStatus')?.value ?? RocketStatus.OnGround,
      };
      this.rocketService.createRocket(+this.missionId, rocket);
      console.log(
        '🟢RocketFormComponent.onSubmit(): CREATE, missionId[%d], name[%s]',
        this.missionId,
        rocket?.name
      );
    } else if (this.operation === 'READ') {
      const rocket = this.rocketService.getRocket(
        +this.missionId,
        +this.id
      );
      console.log(
        '🟢RocketFormComponent.onSubmit(): READ, id[%d], missionId[%d], name[%s]',
        this.id,
        this.missionId,
        rocket?.name,
      );
    } else if (this.operation === 'UPDATE') {
      const rocket: Rocket = {
        id: +this.id,
        missionId: +this.missionId,
        name: this.rocketForm.get('name')?.value ?? '',
        rocketStatus: this.rocketForm.get('rocketStatus')?.value ?? RocketStatus.OnGround,
      };
      this.rocketService.updateRocket(+this.missionId, rocket);
      console.log(
        '🟢RocketFormComponent.onSubmit(): UPDATE, id[%d], missionId[%d], name[%s]',
        this.id,
        this.missionId,
        rocket?.name
      );
    } else if (this.operation === 'DELETE') {
      this.rocketService.deleteRocket(+this.missionId, +this.id);
      console.log('🟢RocketFormComponent.onSubmit(): DELETE, id[%s], missionId[%d]',
        this.id, this.missionId);
    }
    this.router.navigate(['/rocket-table', this.missionId], {
      relativeTo: this.route,
    });
  }
  /**
   * The cancel action handler.
   * It resets the form and navigates back to the rocket table.
   */
  onCancel() {
    this.rocketForm.reset();
    console.log('🟢RocketFormComponent.onCancel():');
    this.router.navigate(['/rocket-table', this.missionId], {
      relativeTo: this.route,
    });
  }
}

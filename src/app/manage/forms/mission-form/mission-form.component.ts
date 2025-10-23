import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Mission } from 'models/mission';
import { MissionStatus } from 'models/mission-status';
import { MissionService } from 'services/mission-service/mission.service';
import { AppTools } from '../../../app.tools';
/**
 * MissionFormComponent is an Angular component that provides a form for creating, updating, or deleting a mission.
 * It uses Angular Material components for UI elements and Reactive Forms for form handling.
 * This component is part of the forms module and is used to manage mission-related forms.
 */
@Component({
  selector: 'app-mission-form',
  templateUrl: './mission-form.component.html',
  styleUrl: './mission-form.component.css',
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
export class MissionFormComponent implements OnInit {
  public missionService = inject(MissionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  missionStatuses: MissionStatus[] = [MissionStatus.Scheduled, MissionStatus.Pending, MissionStatus.InProgress, MissionStatus.Ended];
  missionForm = this.formBuilder.group({
    name: ['', Validators.required],
    missionStatus: [MissionStatus.Scheduled, Validators.required],
  });
  appTools = new AppTools(); 
  operation = '';
  formTitle = '';
  buttonLabel = '';
  id = '';
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   */
  ngOnInit() {
    this.operation = this.route.snapshot.paramMap.get('operation') ?? '';
    if (this.operation === 'CREATE') {
      this.formTitle = 'Create Mission';
      this.buttonLabel = 'Create';
    } else if (this.operation === 'READ') {
      this.formTitle = 'Read Mission';
      this.buttonLabel = 'Read';
    } else if (this.operation === 'UPDATE') {
      this.formTitle = 'Update Mission';
      this.buttonLabel = 'Update';
    } else if (this.operation === 'DELETE') {
      this.formTitle = 'Delete Mission';
      this.buttonLabel = 'Delete';
    }
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    const mission = this.missionService.getMission(+this.id);
    this.missionForm.controls.name.setValue(mission?.name ?? '');
    this.missionForm.controls.missionStatus.setValue(
      mission?.missionStatus ?? MissionStatus.Scheduled
    );
    console.log('🟢MissionFormComponent.ngOnInit():');
  }
  /**
   * The submit action handler.
   * It creates, updates, or deletes a mission based on the operation type.
   */
  onSubmit() {
    if (this.operation === 'CREATE') {
      const mission: Mission = {
        id: -1,
        name: this.missionForm.get('name')?.value ?? '',
        missionStatus: this.missionForm.get('missionStatus')?.value ?? MissionStatus.Scheduled,
        rockets: [],
      };
      this.missionService.createMission(mission);
      console.log(
        '🟢MissionFormComponent.onSubmit(): CREATE, name[%s]',
        mission?.name
      );
    } else if (this.operation === 'READ') {
      const mission = this.missionService.getMission(+this.id);
      console.log(
        '🟢MissionFormComponent.onSubmit(): READ, id[%d], name[%s]',
        this.id,
        mission?.name
      );
    } else if (this.operation === 'UPDATE') {
      const mission: Mission = {
        id: +this.id,
        name: this.missionForm.get('name')?.value ?? '',
        missionStatus: this.missionForm.get('missionStatus')?.value ?? MissionStatus.Scheduled,
        rockets: [],
      };
      this.missionService.updateMission(mission);
      console.log(
        '🟢MissionFormComponent.onSubmit(): UPDATE, id[%d], name[%s]',
        this.id,
        mission?.name
      );
    } else if (this.operation === 'DELETE') {
      this.missionService.deleteMission(+this.id);
      console.log('🟢MissionFormComponent.onSubmit(): DELETE, id[%s]', this.id);
    }
    this.router.navigate(['/mission-table'], { relativeTo: this.route });
  }
  /**
   * The cancel action handler.
   * It resets the form and navigates back to the mission table.
   */
  onCancel() {
    this.missionForm.reset();
    console.log('🟢MissionFormComponent.onCancel():');
    this.router.navigate(['/mission-table'], { relativeTo: this.route });
  }
}

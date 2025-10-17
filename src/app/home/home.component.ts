import { Component, InjectionToken, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { STANDARD_DATASET, LARGE_SCALE_DATASET, LONG_NAMES_DATASET, EMPTY_DATASET } from './initial-data';
/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * A component for home page.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
  ],
})
export class HomeComponent implements OnInit {
  storage = inject<Storage>(BROWSER_STORAGE);
  datasetTypeArray = ['S', 'B', 'L', 'E'];
  /** The dataset type currently stored (original) - used to detect changes */
  originalDatasetType = 'S';
  private formBuilder = inject(FormBuilder);
  homeForm = this.formBuilder.group({
    datasetTypeSelect: 'S',
  });
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   *
   * https://angular.dev/guide/components/lifecycle#ngoninit
   * @returns void
   */
  ngOnInit() {
    let datasetType = this.storage.getItem('datasetType') as string;
    if (!datasetType) {
      datasetType = 'S';
      this.storage.setItem('datasetType', datasetType);
      this.storage.setItem('missions', JSON.stringify(STANDARD_DATASET.missions));
    }
    this.homeForm.controls.datasetTypeSelect.setValue(datasetType);
    this.originalDatasetType = datasetType;
    console.log('🟧HomeComponent.ngOnInit(): datasetType[%s]', datasetType);
  }
  /**
   * Sets the dataset type.
   *
   * @param datasetType 
   * @returns void
   */
  setDatasetType(datasetType: string) {
    // Do not persist immediately. We only update localStorage when user presses the Load button.
    console.log('🟧HomeComponent.setDatasetType(): staged datasetType[%s]', datasetType);
  }
  /**
   * Initialises with the selected dataset.
   *
   * @returns void
   */
  initialiseDataset() {
    // Use the value currently chosen in the form (not necessarily persisted yet)
    const selected = this.homeForm.controls.datasetTypeSelect.value as string;
    switch (selected) {
      case 'B':
        this.storage.setItem('missions', JSON.stringify(LARGE_SCALE_DATASET.missions));
        break;
      case 'L':
        this.storage.setItem('missions', JSON.stringify(LONG_NAMES_DATASET.missions));
        break;
      case 'E':
        this.storage.setItem('missions', JSON.stringify(EMPTY_DATASET.missions));
        break;
      default: //'S'
        this.storage.setItem('missions', JSON.stringify(STANDARD_DATASET.missions));
    }
    // Persist the selected dataset type and update original so the button becomes inactive again
    this.storage.setItem('datasetType', selected);
    this.originalDatasetType = selected;
    console.log('🟧HomeComponent.initialiseDataset(): datasetType[%s]', selected);
  }
  /**
   * Describes the dataset type.
   *
   * @param datasetType 
   * @returns void
   */
  describeDatasetType(datasetType: string) {
    switch (datasetType) {
      case 'B':
        return 'Large Scale';
      case 'L':
        return 'Long Names';
      case 'E':
        return 'Empty';
      default: //'S'
        return 'Standard';
    }
  }

}

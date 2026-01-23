import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HousingService} from '../housing';
import {HousingLocationInfo} from '../housinglocation';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
// Imports Material
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="details-container">
      
      <mat-card class="listing-card" appearance="outlined">
        <img mat-card-image [src]="housingLocation?.photo" alt="Photo of {{housingLocation?.name}}">
        <mat-card-header>
          <mat-card-title>{{ housingLocation?.name }}</mat-card-title>
          <mat-card-subtitle>{{ housingLocation?.city }}, {{ housingLocation?.state }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <h2 class="section-heading">About this housing location</h2>
          
          <ul>
            <li>Units available: {{ housingLocation?.availableUnits }}</li>
            <li>Does this location have wifi: {{ housingLocation?.wifi }}</li>
            <li>Does this location have laundry: {{ housingLocation?.laundry }}</li>
          </ul>

        </mat-card-content>
      </mat-card>

      <mat-card class="form-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>Apply now</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="applyForm" (submit)="submitApplication()" class="apply-form">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit">Apply now</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./details.css'],
})
export class Details {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocationInfo | undefined;
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });
  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingLocation = this.housingService.getHousingLocationById(housingLocationId);
  }
  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
    );
  }
}
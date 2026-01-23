import {Component, input} from '@angular/core';
import {HousingLocationInfo} from '../housinglocation';
import {RouterLink} from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="listing-card" appearance="outlined">
      <img mat-card-image [src]="housingLocation().photo" alt="Exterior photo of {{ housingLocation().name }}">
      <mat-card-header>
        <mat-card-title>{{ housingLocation().name }}</mat-card-title>
        <mat-card-subtitle>{{ housingLocation().city }}, {{ housingLocation().state }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-actions align="end">
        <a mat-button color="primary" [routerLink]="['/details', housingLocation().id]">En savoir plus</a>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./housing-location.css'],
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
}
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { HousingService } from '../housing';
import { HousingLocationInfo } from '../housinglocation';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    MatFormFieldModule, 
    MatInputModule, 
    MatCheckboxModule, 
    MatButtonModule,
    TranslateModule
  ],
  template: `
    <h1>{{ (isEditMode ? 'LOFORM.EDIT' : 'LOFORM.NEW') | translate }}</h1>
    
    <form [formGroup]="locationForm" (ngSubmit)="save()">
        <div id="layout">
            <div id="inputs">
                
                <mat-form-field appearance="outline">
                    <mat-label>{{'LOFORM.NAME'| translate}}</mat-label>
                    <input matInput formControlName="name">
                    @if (locationForm.get('name')?.hasError('required')) {
                        <mat-error>{{'LOFORM.NAME_ERROR'|translate}}</mat-error>
                    }
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>{{'LOFORM.CITY' | translate}}</mat-label>
                    <input matInput formControlName="city">
                    @if (locationForm.get('city')?.hasError('required')) {
                        <mat-error>{{'LOFORM.CITY_ERROR'| translate}}</mat-error>
                    }
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>{{'LOFORM.STATE' | translate}}</mat-label>
                    <input matInput formControlName="state" maxlength="2">
                    @if (locationForm.get('state')?.hasError('required')) {
                        <mat-error>{{'LOFORM.STATE_ERROR' | translate}}</mat-error>
                    }
                    @if (locationForm.get('state')?.hasError('minlength') || locationForm.get('state')?.hasError('maxlength')) {
                        <mat-error>{{'LOFORM.STATE_ERROR_2' | translate}}</mat-error>
                    }
                </mat-form-field>

                <div class="small-inputs">
                    <mat-form-field appearance="outline">
                        <mat-label>{{'LOFORM.UNITS'|translate}}</mat-label>
                        <input matInput type="number" formControlName="available_units" min="0">
                    </mat-form-field>

                    <mat-checkbox formControlName="wifi">{{'LOFORM.WIFI'|translate}}</mat-checkbox>
                    <mat-checkbox formControlName="laundry">{{'LOFORM.LAUNDRY'|translate}}</mat-checkbox>
                </div>

                <div class="buttons-all">
                    @if(isEditMode) {
                        <button type="button" mat-button color="warn" (click)="delete()">{{'LOFORM.DELETE'|translate}}</button>
                    } @else {
                        <span></span> 
                    }

                    <div class="buttons-right">
                        <button type="button" mat-button routerLink="/locations">{{'LOFORM.CANCEL'|translate}}</button>
                        <button type="submit" mat-flat-button color="primary" [disabled]="locationForm.invalid">{{'LOFORM.SAVE'|translate}}</button>
                    </div>
                </div>
            </div>

            <div id="photo">
                <img [src]="locationForm.get('photo')?.value">

                <mat-form-field appearance="outline">
                    <mat-label>{{'LOFORM.IMAGE'|translate}}</mat-label>
                    <input matInput formControlName="photo">
                    @if (locationForm.get('photo')?.hasError('required')) {
                        <mat-error>{{'LOFORM.IMAGE_ERROR'|translate}}</mat-error>
                    }
                </mat-form-field>
            </div>
        </div>
    </form>
  `,
  styles: `
    #layout {
       display: flex;
       gap: 32px;
       justify-content: space-between;
    }

    #inputs {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    #photo {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 45%; 
    }

    #photo img {
        object-fit: cover;
        border-radius: 8px;
        width: 100%;
        height: 300px;
        background-color: #f0f0f0;
    }

    .small-inputs {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 10px;
    }
    
    .small-inputs mat-form-field {
        margin-bottom: 0;
    }

    .buttons-all {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .buttons-right {
        display: flex;
        justify-content: center;
        gap: 16px;
    }

    @media (max-width: 890px) {
        #layout {
            flex-direction: column-reverse;
            gap: 20px;
        }

        #photo {
            width: 100%;
            height: auto;
        }
    }
  `
})
export class LocationFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private housingService = inject(HousingService);
  private fb = inject(FormBuilder);

  locationForm: FormGroup;
  isEditMode = false;
  locationId?: number;

  constructor() {
    this.locationForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      photo: ['', Validators.required],
      available_units: [0], 
      wifi: [false],
      laundry: [false]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.locationId = Number(id);
      this.housingService.getLocationById(this.locationId).subscribe(location => {
        if (location) {
          this.locationForm.patchValue(location);
        }
      });
    }
  }

  save(): void {
    if (this.locationForm.invalid) return;

    const locationData = this.locationForm.value;

    if (this.isEditMode) {
      this.housingService.updateLocation(locationData).subscribe(() => {
        this.router.navigate(['/locations']);
      });
    } else {
      this.housingService.addLocation(locationData).subscribe(() => {
        this.router.navigate(['/locations']);
      });
    }
  }

  delete(): void {
    if (this.locationId && confirm('Are you sure?')) {
      this.housingService.deleteLocation(this.locationId).subscribe(() => {
        this.router.navigate(['/locations']);
      });
    }
  }
}
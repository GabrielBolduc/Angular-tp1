import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HousingService } from '../housing';
import { HousingLocationInfo } from '../housinglocation';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatCheckboxModule
  ],
  template: `
    <h1>{{ isEditMode ? 'Edit Location' : 'New Location' }}</h1>
    
    <form [formGroup]="locationForm" (ngSubmit)="save()">
        <div id="layout">
            <div id="inputs">
                
                <mat-form-field appearance="outline">
                    <mat-label>Name</mat-label>
                    <input matInput formControlName="name">
                    @if (locationForm.get('name')?.hasError('required')) {
                        <mat-error>Name is required</mat-error>
                    }
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>City</mat-label>
                    <input matInput formControlName="city">
                    @if (locationForm.get('city')?.hasError('required')) {
                        <mat-error>City is required</mat-error>
                    }
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>State (Ex: CA)</mat-label>
                    <input matInput formControlName="state" maxlength="2">
                    @if (locationForm.get('state')?.hasError('required')) {
                        <mat-error>State is required</mat-error>
                    }
                    @if (locationForm.get('state')?.hasError('minlength') || locationForm.get('state')?.hasError('maxlength')) {
                        <mat-error>Must be 2 characters</mat-error>
                    }
                </mat-form-field>

                <div class="small-inputs">
                    <mat-form-field appearance="outline">
                        <mat-label>Units</mat-label>
                        <input matInput type="number" formControlName="availableUnits" min="0">
                    </mat-form-field>

                    <mat-checkbox formControlName="wifi">Wifi</mat-checkbox>
                    <mat-checkbox formControlName="laundry">Laundry</mat-checkbox>
                </div>

                <div class="buttons-all">
                    @if(isEditMode) {
                        <button type="button" mat-button color="warn" (click)="delete()">Delete</button>
                    } @else {
                        <span></span> }

                    <div class="buttons-right">
                        <button type="button" mat-button routerLink="/locations">Cancel</button>
                        <button type="submit" mat-flat-button color="primary" [disabled]="locationForm.invalid">Save</button>
                    </div>
                </div>
            </div>

            <div id="photo">
                <img [src]="locationForm.get('photo')?.value || 'https://placehold.co/600x400?text=No+Image'" 
                     alt="Location preview"
                     onerror="this.src='https://placehold.co/600x400?text=Invalid+URL'">

                <mat-form-field appearance="outline">
                    <mat-label>Image URL</mat-label>
                    <input matInput formControlName="photo">
                    @if (locationForm.get('photo')?.hasError('required')) {
                        <mat-error>Image URL is required</mat-error>
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
    private fb = inject(FormBuilder);
    private housingService = inject(HousingService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);

    isEditMode = false;
    currentId: number | null = null;

    // Definiton form avec validation
    locationForm = this.fb.group({
        name: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        photo: ['', Validators.required],
        availableUnits: [0, [Validators.required, Validators.min(0)]],
        wifi: [false],
        laundry: [false]
    });

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');

        // Si l'ID existe et n'est pas 'new', on est en mode édition
        if (idParam && idParam !== 'new') {
            this.isEditMode = true;
            this.currentId = Number(idParam);
            this.loadLocation(this.currentId);
        }
    }

    // Charge donne pour edit
    private loadLocation(id: number) {
        this.housingService.getLocationById(id).subscribe(location => {
            if (location) {
                // remplie form avec donne
                this.locationForm.patchValue(location);
            } else {
                // si pas la propriete du user
                this.snackBar.open('Location not found or access denied', 'Close', { duration: 3000 });
                this.router.navigate(['/locations']);
            }
        });
    }

    save() {
        if (this.locationForm.invalid) return;

        const formData = this.locationForm.value as HousingLocationInfo;

        if (this.isEditMode && this.currentId) {

            // edit
            const locationToUpdate = { ...formData, id: this.currentId };
            
            this.housingService.updateLocation(locationToUpdate).subscribe(success => {
                if (success) {
                    this.snackBar.open('Location updated successfully!', 'OK', { duration: 2000 });
                    this.router.navigate(['/locations']);
                } else {
                    this.snackBar.open('Error updating location.', 'Close');
                }
            });
        } else {
            // add
            this.housingService.addLocation(formData).subscribe(success => {
                if (success) {
                    this.snackBar.open('Location created successfully!', 'OK', { duration: 2000 });
                    this.router.navigate(['/locations']);
                } else {
                    this.snackBar.open('Error creating location.', 'Close');
                }
            });
        }
    }

    delete() {
        if (this.currentId && confirm('Are you sure you want to delete this location?')) {
            this.housingService.deleteLocation(this.currentId).subscribe(success => {
                if (success) {
                    this.snackBar.open('Location deleted.', 'OK', { duration: 2000 });
                    this.router.navigate(['/locations']);
                } else {
                    this.snackBar.open('Error deleting location.', 'Close');
                }
            });
        }
    }
}
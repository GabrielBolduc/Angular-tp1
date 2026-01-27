import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { HousingService } from '../housing';
import { AuthService } from '../auth/auth';
import { HousingLocationInfo } from '../housinglocation';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule,
  ],
  template: `
    <div id="header">
        <h1>My Locations</h1> 
        <a class="add" mat-icon-button routerLink="/locations/new">
            <mat-icon>add</mat-icon>
        </a>
    </div>

    <table mat-table [dataSource]="locations$" class="mat-elevation-z8">

        <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
        </ng-container>

        <ng-container matColumnDef="city">
            <th mat-header-cell *matHeaderCellDef> City </th>
            <td mat-cell *matCellDef="let element"> {{element.city}} </td>
        </ng-container>

        <ng-container matColumnDef="state">
            <th mat-header-cell *matHeaderCellDef> State </th>
            <td mat-cell *matCellDef="let element"> {{element.state}} </td>
        </ng-container>

        <ng-container matColumnDef="availableUnits">
            <th mat-header-cell *matHeaderCellDef> Units </th>
            <td mat-cell *matCellDef="let element"> {{element.available_units || element.availableUnits}} </td>
        </ng-container>

        <ng-container matColumnDef="wifi">
            <th mat-header-cell *matHeaderCellDef>Wifi</th>
            <td mat-cell *matCellDef="let element">
                <mat-icon class="availability" [attr.available]="element.wifi ? 'true' : 'false'">
                  {{ availabilityIcon(element.wifi) }}
                </mat-icon>
            </td>
        </ng-container>

        <ng-container matColumnDef="laundry">
            <th mat-header-cell *matHeaderCellDef> Laundry </th>
            <td mat-cell *matCellDef="let element">
                <mat-icon class="availability" [attr.available]="element.laundry ? 'true' : 'false'">
                  {{ availabilityIcon(element.laundry) }}
                </mat-icon>
            </td>
        </ng-container>

        <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let element">
                <a class="edit" mat-icon-button [routerLink]="['/locations', element.id]">
                    <mat-icon>edit</mat-icon>
                </a>
            </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    
    @if ((locations$ | async)?.length === 0) {
        <p style="padding: 20px; text-align: center; color: gray;">
            You haven't added any locations yet.
        </p>
    }
  `,
  styles: `
    #header {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        gap: 16px;
    }

    .mat-mdc-header-row {
        background-color: #535c68;
    }

    .add {
        background-color: #3498db;
        color: white;
    }

    .edit {
        color: orange;
    }

    .mat-column-actions, .mat-column-laundry, .mat-column-wifi, .mat-column-availableUnits, .mat-column-state {
        width: 80px;
        text-align: center;
    }

    /* Ces sélecteurs fonctionnent maintenant car [attr.available] envoie 'true' ou 'false' */
    .availability[available=true] { color: green !important; }
    .availability[available=false] { color: red !important; }
  `
})
export class LocationsPage implements OnInit {
    private housingService = inject(HousingService);
    private auth = inject(AuthService);

    displayedColumns: string[] = ['name', 'city', 'state', 'availableUnits', 'wifi', 'laundry', 'actions'];
    
    locations$: Observable<HousingLocationInfo[]> = of([]);

    ngOnInit() {
        const userEmail = this.auth.currentUser?.email;
        if (userEmail) {
            this.locations$ = this.housingService.getLocations(userEmail);
        }
    }

    availabilityIcon(available: any): string {
        // Gère le fait que Martha renvoie 1/0 ou true/false
        return available ? 'check' : 'close';
    }
}
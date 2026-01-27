import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-locations',
  imports: [
    RouterModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule,
  ],
  template: `
    <div id="header">
        <h1>Locations</h1>

        <a class="add" matIconButton routerLink="/locations/new">
            <mat-icon>add</mat-icon>
        </a>
    </div>

    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

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
            <td mat-cell *matCellDef="let element"> {{element.availableUnits}} </td>
        </ng-container>

        <ng-container matColumnDef="wifi">
            <th mat-header-cell *matHeaderCellDef>Wifi</th>
            <td mat-cell *matCellDef="let element">
                <mat-icon class="availability" [attr.available]="element.wifi">{{ availabilityIcon(element.wifi) }}</mat-icon>
            </td>
        </ng-container>

        <ng-container matColumnDef="laundry">
            <th mat-header-cell *matHeaderCellDef> Laundry </th>
            <td mat-cell *matCellDef="let element">
                <mat-icon class="availability" [attr.available]="element.laundry">{{ availabilityIcon(element.laundry) }}</mat-icon>
            </td>
        </ng-container>

        <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let element">
                <a class="edit" matIconButton>
                    <mat-icon>edit</mat-icon>
                </a>
            </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: `
    #header {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        gap: 16px;
    }

    #header mat-icon {
        margin: 0;
    }

    .mat-mdc-row {
        background-color: white;
        color: var(--mat-on-sys-secondary);
    }

    .mat-mdc-header-row {
        color: var(--mat-on-sys-secondary);
        background-color: var(--mat-sys-secondary);
    }

    .mat-mdc-row:hover .mat-mdc-cell {
        background-color: color-mix(in lab, var(--mat-sys-secondary) 30%, transparent 100%);
    }

    .add {
        --color: var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));

        background-color: var(--mat-sys-surface-tint);
    }

    .edit {
        --color: rgb(255, 165, 0);
        background-color: color-mix(in lab, var(--mat-sys-secondary) 30%, transparent 100%);
    }

    a[matIconButton] {
        color: var(--color);

        /* https://www.fusonic.net/en/blog/angular-material-customization */
        --mat-icon-button-ripple-color: color-mix(in lab, var(--color) 10%, transparent 100%);
        --mat-icon-button-hover-state-layer-opacity: .8;
        --mat-icon-button-state-layer-color: color-mix(in lab, var(--mat-sys-secondary) 100%, transparent 100%);
    }

    .mat-column-actions, .mat-column-laundry, .mat-column-wifi, mat-column-availableUnits, mat-column-state {
        width: 0px;
    }

    .mat-column-availableUnits, .mat-column-laundry, .mat-column-wifi, .mat-column-state {
        text-align: center
    }

    .availability[available=true] {
      color: green;
    }

    .availability[available=false] {
      color: red;
    }
  `
})
export class LocationsPage {
    displayedColumns: string[] = ['name', 'city', 'state', 'availableUnits', 'wifi', 'laundry', 'actions'];

  readonly baseUrl = 'https://angular.dev/assets/images/tutorials/common';
   dataSource = [
    {
      id: 0,
      name: 'Acme Fresh Start Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg`,
      availableUnits: 4,
      wifi: true,
      laundry: true,
    },
    {
      id: 1,
      name: 'A113 Transitional Housing',
      city: 'Santa Monica',
      state: 'CA',
      photo: `${this.baseUrl}/brandon-griggs-wR11KBaB86U-unsplash.jpg`,
      availableUnits: 0,
      wifi: false,
      laundry: true,
    },
    {
      id: 2,
      name: 'Warm Beds Housing Support',
      city: 'Juneau',
      state: 'AK',
      photo: `${this.baseUrl}/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg`,
      availableUnits: 1,
      wifi: false,
      laundry: false,
    },
  ]

  availabilityIcon(available: boolean | undefined): string | undefined {

        if( available != undefined ) {
            return available ? 'check' : 'close'
        }

        return undefined
  }

}
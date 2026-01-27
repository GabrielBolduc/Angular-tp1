import { Component } from '@angular/core';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-location-form',
  imports: [
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatCheckboxModule
  ],
  template: `
    <h1>Location</h1>
    <form>
        <div id="layout">
            <div id="inputs">
                <mat-form-field appearance="outline">
                    <mat-label>Name</mat-label>
                    <input matInput>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>City</mat-label>
                    <input matInput>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>State</mat-label>
                    <input matInput>
                </mat-form-field>

                <div class="small-inputs">
                    <mat-form-field appearance="outline">
                        <mat-label>Units</mat-label>
                        <input matInput type="number">
                    </mat-form-field>

                    <mat-checkbox>Wifi</mat-checkbox>

                    <mat-checkbox>Laundry</mat-checkbox>
                </div>

                <div class="buttons-all">

                    <button mat-button color="danger">Delete</button>

                    <div class="buttons-right">
                        <button mat-button>Cancel</button>
                        <button mat-flat-button>Save</button>
                    </div>

                </div>
            </div>

            <div id="photo">
                <img src="https://angular.dev/assets/images/tutorials/common/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg">

                <mat-form-field appearance="outline">
                    <mat-label>Image URL</mat-label>
                    <input matInput type="text">
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
    }

    #photo {
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 600px;
        width: 50%;
    }

    #photo img {
        object-fit: cover;
        border-radius: 4px;
        width: 100%;
        height: 100%;
    }

    .small-inputs {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
    }

    .mdc-label {
        color: black;
    }

    .buttons-all {
        display: flex;
        justify-content: space-between;
    }
    .buttons-right {
        display: flex;
        justify-content: center;
        gap: 32px;
    }

    @media (max-width: 890px) {
        #layout {
            flex-direction: column-reverse;
            gap: 0px;
        }

        #photo {
            width: 100%;
            height: 300px;
        }
    }
  `
})
export class LocationFormPage {

}
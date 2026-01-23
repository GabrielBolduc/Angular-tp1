import {Component, inject, OnInit} from '@angular/core';
import {HousingLocation} from '../housing-location/housing-location';
import {HousingService} from '../housing';
import {HousingLocationInfo} from '../housinglocation';
import {ActivatedRoute, Router} from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HousingLocation, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <section>
      <form class="search-form" (submit)="$event.preventDefault()">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Filter by city</mat-label>
          <input matInput type="text" #filter [value]="currentSearchTerm" 
                 (keydown.enter)="updateSearch(filter.value)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <div class="actions">
          <button matButton="filled" color="primary" type="button" (click)="updateSearch(filter.value)">
            Search
          </button>
          
          <button matFab type="button" (click)="resetSearch()" 
                  [disabled]="!currentSearchTerm">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </form>
      
      <p class="results-count">{{ filteredLocationList.length }} Result</p>
    </section>

    <section class="results">
      @for (housingLocation of filteredLocationList; track $index) {
        <app-housing-location [housingLocation]="housingLocation" />
      }
    </section>
  `,
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  housingService = inject(HousingService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  housingLocationList: HousingLocationInfo[] = [];
  filteredLocationList: HousingLocationInfo[] = [];
  currentSearchTerm = '';

  constructor() {
    this.housingLocationList = this.housingService.getAllHousingLocations();
    this.filteredLocationList = this.housingLocationList;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentSearchTerm = params['search'] || '';
      this.filterResults(this.currentSearchTerm);
    });
  }

  updateSearch(text: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: text ? text : null },
      queryParamsHandling: 'merge',
    });
  }

  resetSearch() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  }

  private filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }
    this.filteredLocationList = this.housingLocationList.filter((l) =>
      l?.city.toLowerCase().includes(text.toLowerCase())
    );
  }
}
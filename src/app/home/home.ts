import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common'; 
import {HousingLocation} from '../housing-location/housing-location';
import {HousingService} from '../housing';
import {HousingLocationInfo} from '../housinglocation';
import {ActivatedRoute, Router} from '@angular/router';

import {Observable, combineLatest} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocation, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <section>
      <form class="search-form" (submit)="$event.preventDefault()">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>{{'HOME.FILTER' | translate }}</mat-label>
          <input matInput type="text" #filter [value]="currentSearchTerm" 
                 (keydown.enter)="updateSearch(filter.value)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <div class="actions">
          <button mat-flat-button color="primary" type="button" (click)="updateSearch(filter.value)">
            {{'HOME.SEARCH' | translate}}
          </button>
          
          <button mat-mini-fab color="primary" type="button" (click)="resetSearch()" 
                  [disabled]="!currentSearchTerm">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </form>
      
      @if (filteredLocationList$ | async; as locations) {
        
        <p class="results-count">{{ locations.length }} {{'HOME.RESULT' | translate }}</p>

        <section class="results">
          @for (housingLocation of locations; track housingLocation.id) {
            <app-housing-location [housingLocation]="housingLocation" />
          } @empty {
             <p>{{'HOME.NO_RESULT' | translate}}</p>
          }
        </section>

      } 
      
      
    </section>
  `,
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  housingService = inject(HousingService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  filteredLocationList$: Observable<HousingLocationInfo[]> | undefined;
  
  currentSearchTerm = '';

  ngOnInit() {
    const locations$ = this.housingService.getLocations(null);

    // recherche (url)
    const searchTerm$ = this.route.queryParams.pipe(
      map(params => params['search'] || ''),
      startWith('') 
    );

    this.filteredLocationList$ = combineLatest([locations$, searchTerm$]).pipe(
      map(([locations, term]) => {
        this.currentSearchTerm = term; 
        
        if (!term) return locations;
        return locations.filter(l => 
          l.city.toLowerCase().includes(term.toLowerCase())
        );
      })
    );
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
}
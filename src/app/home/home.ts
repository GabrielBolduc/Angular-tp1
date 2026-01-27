import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common'; // Important pour AsyncPipe
import {HousingLocation} from '../housing-location/housing-location';
import {HousingService} from '../housing';
import {HousingLocationInfo} from '../housinglocation';
import {ActivatedRoute, Router} from '@angular/router';

// RxJS Imports
import {Observable, combineLatest} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocation, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
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
          <button mat-flat-button color="primary" type="button" (click)="updateSearch(filter.value)">
            Search
          </button>
          
          <button mat-mini-fab color="primary" type="button" (click)="resetSearch()" 
                  [disabled]="!currentSearchTerm">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </form>
      
      @if (filteredLocationList$ | async; as locations) {
        
        <p class="results-count">{{ locations.length }} Result(s)</p>

        <section class="results">
          @for (housingLocation of locations; track housingLocation.id) {
            <app-housing-location [housingLocation]="housingLocation" />
          } @empty {
             <p>No housing locations found.</p>
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

  // C'est notre flux principal qui contient la liste finale à afficher
  filteredLocationList$: Observable<HousingLocationInfo[]> | undefined;
  
  currentSearchTerm = '';

  ngOnInit() {
    // 1. Le flux des données (API)
    const locations$ = this.housingService.getLocations(null);

    // 2. Le flux de la recherche (URL)
    const searchTerm$ = this.route.queryParams.pipe(
      map(params => params['search'] || ''),
      startWith('') // Pour s'assurer qu'il y a une valeur au départ
    );

    // 3. On combine les deux !
    // Dès que l'un des deux change, le code ci-dessous s'exécute
    this.filteredLocationList$ = combineLatest([locations$, searchTerm$]).pipe(
      map(([locations, term]) => {
        this.currentSearchTerm = term; // Mise à jour pour l'input HTML
        
        // Logique de filtre
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
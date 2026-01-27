import { Injectable, inject } from '@angular/core';
import { HousingLocationInfo } from './housinglocation';
import { MarthaRequestService } from './services/MarthaRequestService';
import { AuthService } from './auth/auth';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  private martha = inject(MarthaRequestService);
  private auth = inject(AuthService);

  getLocations(email: string | null = null): Observable<HousingLocationInfo[]> {
    const payloadEmail = email ? `'${email}'` : null;

    return this.martha.select('select-locations', { email: payloadEmail }).pipe(
      map(rows => rows || []) // On retourne le JSON brut directement
    );
  }

  getLocationById(id: number): Observable<HousingLocationInfo | undefined> {
    const email = this.auth.currentUser?.email;
    const payloadEmail = email ? `'${email}'` : null;

    return this.martha.select('select-location', { id, email: payloadEmail }).pipe(
      map(rows => (rows && rows.length > 0) ? rows[0] : undefined)
    );
  }

  addLocation(location: Partial<HousingLocationInfo>): Observable<boolean> {
    const email = this.auth.currentUser?.email;
    if (!email) return of(false);

    // On passe l'objet partiel directement, Martha gère le JSON
    return this.martha.insert('insert-location', { ...location, email }).pipe(
      map(result => result?.success ?? false)
    );
  }

  updateLocation(location: HousingLocationInfo): Observable<boolean> {
    const email = this.auth.currentUser?.email;
    return this.martha.statement('update-location', { ...location, email }).pipe(
      map(success => !!success)
    );
  }

  deleteLocation(id: number): Observable<boolean> {
    const email = this.auth.currentUser?.email;
    return this.martha.statement('delete-location', { id, email }).pipe(
      map(success => !!success)
    );
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Application received for ${firstName} ${lastName} (${email})`);
  }
}
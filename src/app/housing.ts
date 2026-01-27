import {Injectable, inject} from '@angular/core';
import {HousingLocationInfo} from './housinglocation';
import {MarthaRequestService} from './services/MarthaRequestService';
import {AuthService} from './auth/auth';
import {map, Observable, of} from 'rxjs';
import {z} from 'zod';


@Injectable({
  providedIn: 'root'
})
export class HousingService {
  private martha = inject(MarthaRequestService);
  private auth = inject(AuthService);

  private LocationSchema = z.object({
    id: z.number(),
    name: z.string(),
    city: z.string(),
    state: z.string(),
    photo: z.string(),

    available_units: z.number().transform(val => val),
    wifi: z.number().or(z.boolean()).transform(Boolean),
    laundry: z.number().or(z.boolean()).transform(Boolean)
  }).transform(data => ({
    id: data.id,
    name: data.name,
    city: data.city,
    state: data.state,
    photo: data.photo,
    availableUnits: data.available_units,
    wifi: data.wifi,
    laundry: data.laundry
  }))

  getLocations(email: string | null = null): Observable<HousingLocationInfo[]> {
    
    let payloadEmail = null;
    if (email) {
        payloadEmail = `'${email}'`;
    }

    return this.martha.select('select-locations', { email: payloadEmail }).pipe(
      map(rows => {
        if (!rows) return [];
        return rows.map((row: any) => this.LocationSchema.parse(row));
      })
    );
  }

  // Select
  getLocationById(id: number): Observable<HousingLocationInfo | undefined> {
    const email = this.auth.currentUser?.email;
    
    let payloadEmail = null;
    if (email) {
        payloadEmail = `'${email}'`;
    }

    return this.martha.select('select-location', { id, email: payloadEmail }).pipe(
      map(rows => {
        if (!rows || rows.length === 0) return undefined;
        return this.LocationSchema.parse(rows[0]);
      })
    );
  }

  // Create
  addLocation(location: Partial<HousingLocationInfo>): Observable<boolean> {
    const email = this.auth.currentUser?.email;

    if (!email) {
        console.error("Erreur: Utilisateur non connecté");
        return of(false);
    }

    const payload = {
      name: location.name,
      city: location.city,
      state: location.state,
      photo: location.photo,
      units: location.availableUnits,
      wifi: location.wifi ? 1 : 0,  
      laundry: location.laundry ? 1 : 0,
      email: email // Email brut
    };

    return this.martha.insert('insert-location', payload).pipe(
      map(result => result?.success ?? false)
    );
  }

  // Update
  updateLocation(location: HousingLocationInfo): Observable<boolean> {
    const email = this.auth.currentUser?.email;

    const payload = {
      id: location.id,
      name: location.name,
      city: location.city,
      state: location.state,
      photo: location.photo,
      units: location.availableUnits,
      wifi: location.wifi ? 1 : 0,
      laundry: location.laundry ? 1 : 0,
      email: email // Email brut
    };

    return this.martha.statement('update-location', payload).pipe(
      map(success => !!success)
    );
  }

  // Delete
  deleteLocation(id: number): Observable<boolean> {
    const payload = {
      id: id,
      email: this.auth.currentUser?.email // Email brut
    };
    return this.martha.statement('delete-location', payload).pipe(
        map(success => !!success)
    );
  }

  
  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`);
  }
}
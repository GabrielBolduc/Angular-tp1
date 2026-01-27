import {Injectable, inject} from '@angular/core';
import {HousingLocationInfo} from './housinglocation';
import {MarthaRequestService} from './services/MarthaRequestService';
import {AuthService} from './auth/auth';
import {map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  private martha = inject(MarthaRequestService);
  private auth = inject(AuthService);

  // Convertit le format DB (snake_case) vers le format App (camelCase)
  private mapToHousingLocation(data: any): HousingLocationInfo {
    return {
      id: data.id,
      name: data.name,
      city: data.city,
      state: data.state,
      photo: data.photo,
      availableUnits: data.available_units, // Mapping important ici
      wifi: Boolean(data.wifi),             // Conversion 1/0 -> true/false
      laundry: Boolean(data.laundry)
    };
  }

  // LISTE (READ)
  // email: null => Public (Home)
  // email: string => Privé (LocationsPage)
  getLocations(email: string | null = null): Observable<HousingLocationInfo[]> {
    // Subtilité Martha : Pour le SELECT, si l'email existe, il faut le wrapper de quotes simples
    // car la requête SQL est: coalesce(?email, ...) sans quotes.
    const payloadEmail = email ? `'${email}'` : null;

    return this.martha.select('select-locations', { email: payloadEmail }).pipe(
      map(rows => {
        if (!rows) return [];
        return rows.map((row: any) => this.mapToHousingLocation(row));
      })
    );
  }

  // DETAIL (READ SECURISE)
  // Utilise l'email pour vérifier que l'utilisateur est bien le propriétaire
  getLocationById(id: number): Observable<HousingLocationInfo | undefined> {
    const email = this.auth.currentUser?.email;
    // Même subtilité pour le SELECT : on ajoute les quotes simples
    const payloadEmail = email ? `'${email}'` : null;

    return this.martha.select('select-location', { id, email: payloadEmail }).pipe(
      map(rows => {
        if (!rows || rows.length === 0) return undefined;
        return this.mapToHousingLocation(rows[0]);
      })
    );
  }

  // CREATE
  addLocation(location: Partial<HousingLocationInfo>): Observable<boolean> {
    const payload = {
      name: location.name,
      city: location.city,
      state: location.state,
      photo: location.photo,
      units: location.availableUnits,
      wifi: location.wifi, 
      laundry: location.laundry,
      email: this.auth.currentUser?.email // Pas de quotes ici, le SQL a déjà "?email"
    };

    return this.martha.insert('insert-location', payload).pipe(
      map(result => result?.success ?? false)
    );
  }

  // UPDATE
  updateLocation(location: HousingLocationInfo): Observable<boolean> {
    const payload = {
      id: location.id,
      name: location.name,
      city: location.city,
      state: location.state,
      photo: location.photo,
      units: location.availableUnits,
      wifi: location.wifi,
      laundry: location.laundry,
      email: this.auth.currentUser?.email // Pas de quotes ici
    };

    return this.martha.statement('update-location', payload).pipe(
      map(success => !!success)
    );
  }

  // DELETE
  deleteLocation(id: number): Observable<boolean> {
    const payload = {
      id: id,
      email: this.auth.currentUser?.email // Pas de quotes ici
    };
    return this.martha.statement('delete-location', payload).pipe(
        map(success => !!success)
    );
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`);
  }
}
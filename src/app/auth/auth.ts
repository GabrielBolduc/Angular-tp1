import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {UserCredentials} from '../models/user-credentials';
import {MarthaRequestService} from '../services/MarthaRequestService';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly CURRENT_USER_KEY = 'housing.currentUser';

  private _currentUser : User | null = null;

  get currentUser(): User | null {
    return this._currentUser;
  }

  get isLoggedIn(): boolean {
    return !!this._currentUser;
  }

  constructor(private martha : MarthaRequestService) {
    const storedCurrentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) ?? 'null');

    if (storedCurrentUser) {
      this._currentUser = new User(storedCurrentUser.email);
    }
  }


  private setCurrentUser(user: User | null) {
    this._currentUser = user;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  logIn(credentials: UserCredentials): Observable<boolean> {

      return this.martha.select('users-login', credentials).pipe(
          map(data => {

              if (data.length == 1) {
                  this.setCurrentUser(new User(data[0].email));

                  return true;
              } else {
                  return false;
              }

          })
      );

  }

  signUp(credentials: UserCredentials): Observable<boolean> {

    console.log({ credentials })

      return this.martha.insert('users-signup', credentials).pipe(
          map(result => {
              if (result?.success) {
                  this.setCurrentUser(new User(credentials.email));

                  return true;
              } else {
                  return false;
              }
          })
      );

  }

  logOut() {
      this.setCurrentUser(null);
  }

}
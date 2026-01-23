import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router'; 
import {AuthService} from './auth/auth';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, MatButtonModule, MatIconModule],
  template: `
    <main>
      <header class="brand-name">
        <a matButton [routerLink]="['/']">
          <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
        </a>

        <nav class="auth-nav">
          @if (authService.isAuthenticated()) {
            <button class="nav-link" (click)="logout()">Déconnexion</button>
          } @else {
            <button matButton [routerLink]="['/login']">Connexion</button>
            <button matButton [routerLink]="['/register']">Inscription</button>
          }
        </nav>
      </header>
      <section class="content">
        <router-outlet />
      </section>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'homes';
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
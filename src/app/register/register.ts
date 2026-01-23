import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/auth';
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatAnchor],
  template: `
    <section class="auth-container">
      <h2 class="section-heading">Inscription</h2>
      <form [formGroup]="registerForm" (ngSubmit)="submitRegister()">
        
        <label for="username">Nom d'utilisateur</label>
        <input id="username" type="text" formControlName="username" />

        <label for="password">Mot de passe</label>
        <input id="password" type="password" formControlName="password" />

        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input id="confirmPassword" type="password" formControlName="confirmPassword" />

        <button matButton="outlined" type="submit">S'inscrire</button>
      </form>
      
      <p class="auth-link">
        Login <a routerLink="/login">Se connecter</a>
      </p>
    </section>
  `,
  styleUrls: ['./register.css'],
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);

  // Suppression des validateurs
  registerForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  submitRegister() {
    // Connexion directe sans validation
    this.authService.register(this.registerForm.value.username ?? '');
    this.router.navigate(['/']);
  }
}
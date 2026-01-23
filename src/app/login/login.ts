import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/auth';
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatAnchor],
  template: `
    <section class="auth-container">
      <h2 class="section-heading">Connexion</h2>
      <form [formGroup]="loginForm" (ngSubmit)="submitLogin()">
        
        <label for="username">Nom d'utilisateur</label>
        <input id="username" type="text" formControlName="username" />

        <label for="password">Mot de passe</label>
        <input id="password" type="password" formControlName="password" />

        <button matButton="outlined" type="submit">Se connecter</button>
      </form>
      
      <p class="auth-link">
        No Account ? <a routerLink="/register">S'inscrire</a>
      </p>
    </section>
  `,
  styleUrls: ['./login.css'],
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submitLogin() {
    // On connecte l'utilisateur directement, sans vérifier les champs
    this.authService.login(this.loginForm.value.username ?? '');
    this.router.navigate(['/']);
  }
}
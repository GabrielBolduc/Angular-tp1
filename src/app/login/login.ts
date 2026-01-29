import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {AuthService} from '../auth/auth'
import {UserCredentials} from '../models/user-credentials'

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, TranslateModule
  ],
  template: `
    <div class="auth-container">
        <form (submit)="handleSubmit(usernameInput.value, passwordInput.value)" class="auth-form">
            
            @if (error()) {
                <div id="error">
                    {{ error() }}
                </div>
            }

            <mat-form-field appearance="outline">
                <mat-label>{{'LOGIN.USERNAME' | translate}}</mat-label>
                <input #usernameInput matInput>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>{{'LOGIN.PASSWORD' | translate}}</mat-label>
                <input #passwordInput matInput type="password">
            </mat-form-field>

            <div id="buttons">
                <button mat-flat-button color="primary">{{'LOGIN.LOGIN_BTN' | translate}}</button>
                <a mat-button routerLink="/register">{{'LOGIN.CREATE_ACCOUNT_LINK' | translate}}</a>
            </div>
        </form>
    </div>
    
  `,
  styleUrls: ['./login.css'] 

  
})
export class Login {
    private readonly router = inject(Router)
    private readonly auth = inject(AuthService)

    error = signal<string | null>(null)

    handleSubmit(username: string, password: string) {

        const credentials = new UserCredentials({ username, password })

        this.auth.logIn(credentials).subscribe( success => {
            if (success) {
                this.router.navigate(['/'])
            }
            else {
                this.error.set('Invalid credentials')
            }
        })

    }
}
import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {AuthService} from '../auth/auth'
import {UserCredentials} from '../models/user-credentials'

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule
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
                <mat-label>Username</mat-label>
                <input #usernameInput matInput>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input #passwordInput matInput type="password">
            </mat-form-field>

            <div id="buttons">
                <button mat-flat-button color="primary">Log in</button>
                <a mat-button routerLink="/register">Create an account!</a>
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
import {Component, inject, signal} from '@angular/core';
import {RouterModule, Router} from '@angular/router';
import {FormControl, FormGroup, FormGroupDirective, NgForm, AbstractControl, ReactiveFormsModule, Validators, ValidationErrors} from '@angular/forms';
import {AuthService} from '../auth/auth';
import {UserCredentials} from '../models/user-credentials';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ErrorStateMatcher} from '@angular/material/core';

class ConfirmationMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
        control
        && (control.invalid || form?.hasError('passwordConfirmationMustMatch'))
        && (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule
  ],
  template: `
    <div class="auth-container">
        <form [formGroup]="signupForm" (submit)="handleSubmit()">

            @if (error()) {
                <div id="error">
                    {{ error() }}
                </div>
            }

            <mat-form-field appearance="outline">
                <mat-label>Username</mat-label>
                <input formControlName="username" matInput>

                @if(usernameControl.hasError('required')) {
                    <mat-error>Please enter a username</mat-error>
                }
                @else if(usernameControl.hasError('email')) {
                    <mat-error>Username must be an email</mat-error>
                }
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input formControlName="password" matInput type="password">
                <mat-error>Please enter a password</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Password confirmation</mat-label>
                <input formControlName="passwordConfirmation" [errorStateMatcher]="confirmationMatcher" matInput type="password">

                @if(passwordConfirmationControl.hasError('required')) {
                    <mat-error>Please enter a password confirmation</mat-error>
                }
                @else if(signupForm.hasError('passwordConfirmationMustMatch')) {
                    <mat-error>Password confirmation must match password</mat-error>
                }
            </mat-form-field>

            <div id="buttons">
                <button mat-flat-button color="primary">Sign up</button>
                <a mat-button routerLink="/login">Cancel</a>
            </div>
        </form>
    </div>
  `,
  styleUrls: ['./register.css'] 
})
export class Register {
    private readonly router = inject(Router);
    private readonly auth = inject(AuthService);

    error = signal<string | null>(null);

    passwordControl = new FormControl('', [Validators.required]);
    passwordConfirmationControl = new FormControl('', [Validators.required]);

    private passwordMatch(form: AbstractControl): ValidationErrors | null {
        if (form.value?.password != form.value?.passwordConfirmation) {
            return { passwordConfirmationMustMatch: true };
        } else {
            return null;
        }
    }

    signupForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.email]),
        password: this.passwordControl,
        passwordConfirmation: this.passwordConfirmationControl
    }, [this.passwordMatch]);

    confirmationMatcher = new ConfirmationMatcher();

    get usernameControl(): FormControl {
        return this.signupForm.get('username') as FormControl;
    }

    handleSubmit() {
        if (this.signupForm.valid) {
            const { username, password } = this.signupForm.value;
            const credentials = new UserCredentials({ username: username!, password: password! });

            this.auth.signUp(credentials).subscribe( success => {
                if (success) {
                    this.router.navigate(['/']);
                }
                else {
                    this.error.set('Could not create account');
                }
            });
        }
    }
}
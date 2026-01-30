import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router'; 
import {AuthService} from './auth/auth';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, MatButtonModule, MatIconModule, TranslateModule, MatMenuModule],
  template: `
    <main>
      <header class="brand-name">
        <a mat-button [routerLink]="['/']" class="logo-link">
          <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
        </a>

        <span class="spacer"></span>

        <div class="nav-right">
          
          <button mat-button [matMenuTriggerFor]="langMenu">
            <mat-icon>language</mat-icon>
            <span class="lang-text">{{ translate.currentLang.toUpperCase()}}</span>
          </button>
          
          <mat-menu #langMenu="matMenu">
            <button mat-menu-item (click)="changeLang('en')">English</button>
            <button mat-menu-item (click)="changeLang('fr')">Français</button>
          </mat-menu>

          <nav class="auth-nav">
            @if (authService.isLoggedIn) {
              <a mat-button [routerLink]="['/locations']">
                 <mat-icon>home</mat-icon> 
                 <span class="nav-text">{{ 'NAV.LOCATIONS' | translate}}</span>
              </a>
              <button mat-button (click)="logout()">
                 <mat-icon>logout</mat-icon>
                 <span class="nav-text">{{'NAV.LOGOUT' | translate}}</span>
              </button>
            } @else {
              <a mat-button [routerLink]="['/login']">{{'NAV.LOGIN' | translate}}</a>
              <a mat-button [routerLink]="['/register']">{{'NAV.REGISTER' | translate}}</a>
            }
          </nav>
        </div>

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
  translate = inject(TranslateService)

  constructor(){
    this.translate.addLangs(['en', 'fr'])
    this.translate.setFallbackLang('en')

    // persistance de la langue
    const storedLang = localStorage.getItem('language')

    const browserLang = this.translate.getBrowserLang()
    const isBrowserLangSupported = browserLang?.match(/en|fr/)

    if(storedLang){ // lang save
      this.translate.use(storedLang)
    }else if(isBrowserLangSupported && browserLang){ // lang du browser
      this.translate.use(browserLang)
    }else {
      this.translate.use('en')
    }
  }

  changeLang(lang: string){
    this.translate.use(lang)

    localStorage.setItem('language', lang)
  }

  
  logout() {
    this.authService.logOut();
  }
}
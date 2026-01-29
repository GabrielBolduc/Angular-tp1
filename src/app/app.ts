import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router'; 
import {AuthService} from './auth/auth';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TranslateService, TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <main>
      <header class="brand-name">
        <a matButton [routerLink]="['/']">
          <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
        </a>

        <span class="spacer"></span>
        <button mat-button (click)="changeLang('en')">EN</button>
        <button mat-button (click)="changeLang('fr')">FR</button>

        <nav class="auth-nav">
          @if (authService.isLoggedIn) {
            <button matButton class="nav-link" [routerLink]="['/locations']">{{ 'NAV.LOCATIONS' | translate}}</button>
            <button matButton class="nav-link" (click)="logout()" [routerLink]="['/']">{{'NAV.LOGOUT' | translate}}</button>
          } @else {
            <button matButton [routerLink]="['/login']">{{'NAV.LOGIN' | translate}}</button>
            <button matButton [routerLink]="['/register']">{{'NAV.REGISTER' | translate}}</button>
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
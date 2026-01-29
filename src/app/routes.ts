import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth';

import { Home } from './home/home';
import { Details } from './details/details';
import { Login } from './login/login';
import { Register } from './register/register';
import { LocationsPage } from './locations/locations';
import { LocationFormPage } from './locations/location-form';
import { PageNotFoundComponent } from './page-not-found';

const authGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn) {
        return true;
    }
    return router.parseUrl('/login');
};

const guestGuard = () => {
    const auth = inject(AuthService)
    const router = inject(Router)

    if(auth.isLoggedIn){
        return router.parseUrl('/')
    }
    return true
}

const routeConfig: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home Page'
    },
    {
        path: 'details/:id',
        component: Details,
        title: 'Housing Details'
    },
    {
        path: 'login',
        component: Login,
        title: 'Login',
        canActivate: [guestGuard]
    },
    {
        path: 'register',
        component: Register,
        title: 'Register',
        canActivate: [guestGuard]
    },

    {
        path: 'locations',
        component: LocationsPage,
        title: 'My Locations',
        canActivate: [authGuard]
    },
    {
        path: 'locations/new',
        component: LocationFormPage,
        title: 'Add New Location',
        canActivate: [authGuard]
    },
    {
        path: 'locations/:id',
        component: LocationFormPage,
        title: 'Edit Location',
        canActivate: [authGuard]
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        title: 'Page Not Found'
    }
];

export default routeConfig;
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth';

// Import des composants
import { Home } from './home/home';
import { Details } from './details/details';
import { Login } from './login/login';
import { Register } from './register/register';
import { LocationsPage } from './locations/locations';
import { LocationFormPage } from './locations/location-form';

// Guard de sécurité : Empêche l'accès si non connecté
const authGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn) {
        return true;
    }
    // Si pas connecté, redirection vers Login
    return router.parseUrl('/login');
};

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
        title: 'Login'
    },
    {
        path: 'register',
        component: Register,
        title: 'Register'
    },

    // Routes Privées (Propriétaires)
    {
        path: 'locations',
        component: LocationsPage,
        title: 'My Locations',
        canActivate: [authGuard] // Protection activée
    },
    // IMPORTANT : La route '/new' doit être placée AVANT '/:id'
    // Sinon Angular pensera que le mot "new" est un ID (ex: id="new")
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
    }
];

export default routeConfig;
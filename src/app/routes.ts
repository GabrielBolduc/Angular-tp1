import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Details} from './details/details';
import {Login} from './login/login';
import {Register} from './register/register';

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Home details',
  },
  {
    path: 'login',
    component: Login,
    title: 'Login',
  },
  {
    path: 'register',
    component: Register,
    title: 'Register',
  },
];
export default routeConfig;
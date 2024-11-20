import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home/home.page').then((m) => m.HomePage),
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadComponent: () =>
            import('./pages/auth/auth.page').then((m) => m.AuthPage),
    },
    {
        path: 'users',
        loadComponent: () =>
            import('./pages/users/users.page').then((m) => m.UsersPage),
    },
    {
        path: 'add-user',
        loadComponent: () =>
            import('./pages/add-user/add-user.page').then((m) => m.AddUserPage),
    },
];

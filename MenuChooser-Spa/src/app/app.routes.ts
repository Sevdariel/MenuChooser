import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'account-access',
        loadChildren: () => import('./account-access/account-access.module').then(m => m.AccountAccessModule),
    },
    {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    },
    {
        path: '**',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        pathMatch: 'full',
    }
];

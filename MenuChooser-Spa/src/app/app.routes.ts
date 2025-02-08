import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
    },
    {
        path: 'products',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
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

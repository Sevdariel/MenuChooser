import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./menu-generate/menu-generate.component').then(
                (m) => m.MenuGenerateComponent,
            ),
    },
    {
        path: 'summary',
        loadComponent: () =>
            import('./menu-summary/menu-summary.component').then(
                (m) => m.MenuSummaryComponent,
            ),
    },
];

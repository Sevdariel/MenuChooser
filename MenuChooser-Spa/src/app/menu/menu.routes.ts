import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./menu-generate/menu-generate.component').then(
                (m) => m.MenuGenerateComponent,
            ),
    },
];

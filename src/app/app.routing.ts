import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';

export const AppRoutes: Routes = [
    {
        path: '',
        component: AppBlankComponent,
        children: [
            {
                path: '',
                loadChildren:
                    () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
            }
        ]
    },
    {
        path: 'dashboard1',
        component: FullComponent,
        children: [
            /*             {
                            path: '',
                            redirectTo: '/dashboards/dashboard1',
                            pathMatch: 'full'
                        },
                        {
                            path: 'dashboard',
                            redirectTo: '/dashboards/dashboard1',
                            pathMatch: 'full'
                        }, */
            {
                path: 'paginas',
                component: AppBlankComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./paginas/paginas.module').then(m => m.PaginasModule),

                    },
                ],
            },
            {
                path: 'configuraciones',
                component: AppBlankComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./configuraciones/configuraciones.module').then(m => m.ConfiguracionesModule),

                    },
                ],
            },
            {
                path: 'mantenedores',
                component: AppBlankComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./mantenedores/mantenedores.module').then(m => m.MantenedoresModule),

                    },
                ],
            },
            {
                path: 'operaciones',
                component: AppBlankComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./operaciones/operaciones.module').then(m => m.OperacionesModule),

                    },
                ],
            },
            /*             {
                            path: '**',
                            redirectTo: 'login'
                        }, */
            {
                path: 'dashboards',
                loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
            },
            {
                path: 'material',
                loadChildren: () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
            },
            {
                path: 'apps',
                loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
            },
            {
                path: 'forms',
                loadChildren: () => import('./forms/forms.module').then(m => m.FormModule)
            },
            {
                path: 'tables',
                loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
            },
            {
                path: 'tree',
                loadChildren: () => import('./tree/tree.module').then(m => m.TreeModule)
            },
            {
                path: 'datatables',
                loadChildren: () => import('./datatables/datatables.module').then(m => m.DataTablesModule)
            },
            {
                path: 'pages',
                loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
            },
            {
                path: 'widgets',
                loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule)
            },
            {
                path: 'charts',
                loadChildren: () => import('./charts/chartslib.module').then(m => m.ChartslibModule)
            },
            {
                path: 'multi',
                loadChildren: () => import('./multi-dropdown/multi-dd.module').then(m => m.MultiModule)
            }
        ]
    },
    {
        path: 'dashboard',
        component: FullComponent,
        children: [
            {
                path: '',
                //loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                loadChildren: () => import('./operaciones/operaciones.module').then(m => m.OperacionesModule),

            },
        ],
    },
    {
        path: 'operaciones',
        component: FullComponent,
        children: [
            {
                path: '',
                //loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                loadChildren: () => import('./operaciones/operaciones.module').then(m => m.OperacionesModule),

            },
        ],
    },
    {
        path: 'mantenedores',
        component: FullComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./mantenedores/mantenedores.module').then(m => m.MantenedoresModule),

            },
        ],
    },
    {
        path: 'configuraciones',
        component: FullComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./configuraciones/configuraciones.module').then(m => m.ConfiguracionesModule),

            },
        ],
    },
    {
        path: '**',
        redirectTo: 'authentication/404'
    }
];

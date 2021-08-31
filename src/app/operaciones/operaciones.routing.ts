import { Routes } from '@angular/router';
import { ContratoComponent } from './contratos/contrato.component';
import { IncidenteComponent } from './incidentes/incidente.component';



export const PagesRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'incidente',
                component: IncidenteComponent,
                data: {
                    title: 'Incidentes',
                    urls: [
                        { title: 'Operaciones', url: '/incidente' },
                        { title: 'Incidentes' }
                    ]
                }
            },
            {
                path: 'contrato',
                component: ContratoComponent,
                data: {
                    title: 'Contratos',
                    urls: [
                        { title: 'Operaciones', url: '/contrato' },
                        { title: 'Contratos' }
                    ]
                }
            },
            {
                path: '**',
                redirectTo: 'incidente'
            }

        ]
    }
];

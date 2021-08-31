import { Routes } from '@angular/router';
import { IncidentesComponent } from './incidentes/incidentes.component';
 
 
 
export const PagesRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'incidente',
                component: IncidentesComponent,
                data: {
                    title: 'Incidentes',
                    urls: [
                        { title: 'Dashboard', url: '/incidente' },
                        { title: 'Incidentes' }
                    ]
                }
            },    
            {
                path: 'incidente/bitacora',
                component: IncidentesComponent,
                data: {
                    title: 'Bitacoras',
                    urls: [
                        { title: 'Dashboard', url: '/incidente/bitacora/:id' },
                        { title: 'Bitacoras' }
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

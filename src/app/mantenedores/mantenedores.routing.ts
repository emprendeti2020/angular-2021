import { Routes } from '@angular/router';
import { ArrendatarioComponent } from './arrendatarios/arrendatario.component';
import { DuenoComponent } from './duenos/dueno.component';
import { InmuebleComponent } from './inmuebles/inmueble.component';
import { TecnicoComponent } from './tecnicos/tecnico.component';



export const PagesRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'inmueble',
                component: InmuebleComponent,
                data: {
                    title: 'Inmuebles',
                    urls: [
                        { title: 'Mantenedores', url: '/inmueble' },
                        { title: 'Inmuebles' }
                    ]
                }
            },
            {
                path: 'arrendatario',
                component: ArrendatarioComponent,
                data: {
                    title: 'Arrendatarios',
                    urls: [
                        { title: 'Mantenedores', url: '/arrendatario' },
                        { title: 'Arrendatarios' }
                    ]
                }
            },
            {
                path: 'tecnico',
                component: TecnicoComponent,
                data: {
                    title: 'Tecnicos',
                    urls: [
                        { title: 'Mantenedores', url: '/tecnico' },
                        { title: 'Técnicos' }
                    ]
                }
            },
            {
                path: 'dueno',
                component: DuenoComponent,
                data: {
                    title: 'Dueños',
                    urls: [
                        { title: 'Mantenedores', url: '/dueno' },
                        { title: 'Dueños' }
                    ]
                }
            },
            {
                path: '**',
                redirectTo: 'inmueble'
            }

        ]
    }
];

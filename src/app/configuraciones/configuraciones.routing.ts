import { Routes } from '@angular/router';
import { EmpresaComponent } from './empresas/empresa.component';
import { ParametroComponent } from './parametros/parametro.component';
import { RolComponent } from './roles/rol.component';
import { UsuarioComponent } from './usuarios/usuario.component';
 
 
 
export const PagesRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'parametro',
                component: ParametroComponent,
                data: {
                    title: 'Parametros',
                    urls: [
                        { title: 'Configuraciones', url: '/parametro' },
                        { title: 'Parametros' }
                    ]
                }
            },    
            {
                path: 'usuario',
                component: UsuarioComponent,
                data: {
                    title: 'Usuarios',
                    urls: [
                        { title: 'Configuraciones', url: '/usuario' },
                        { title: 'Usuarios' }
                    ]
                }
            },                            
            {
                path: 'rol',
                component: RolComponent,
                data: {
                    title: 'Roles',
                    urls: [
                        { title: 'Configuraciones', url: '/rol' },
                        { title: 'Roles' }
                    ]
                }
            },                                                                                                                        
            {
                path: 'empresa',
                component: EmpresaComponent,
                data: {
                    title: 'Empresas',
                    urls: [
                        { title: 'Configuraciones', url: '/empresa' },
                        { title: 'Empresas' }
                    ]
                }
            },                                                   
            { 
                path: '**',
                redirectTo: 'parametro'                
            }
                                   
        ]
    }
];

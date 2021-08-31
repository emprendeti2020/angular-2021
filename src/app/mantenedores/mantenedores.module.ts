import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagesRoutes } from './mantenedores.routing';

import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { InmuebleComponent, InmuebleDialogContent } from './inmuebles/inmueble.component';
import { DuenoComponent, DuenoDialogContent } from './duenos/dueno.component';
import { ArrendatarioComponent, ArrendatarioDialogContent } from './arrendatarios/arrendatario.component';
import { TecnicoComponent, TecnicoDialogContent } from './tecnicos/tecnico.component';





@NgModule({
  declarations: [InmuebleComponent, InmuebleDialogContent, DuenoComponent, DuenoDialogContent, ArrendatarioComponent, ArrendatarioDialogContent, TecnicoComponent, TecnicoDialogContent],

  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    QuillModule.forRoot(),
    PerfectScrollbarModule,
    Ng2SearchPipeModule,
    DragDropModule,
    NgxPaginationModule

  ],
  providers: [DatePipe],
  entryComponents: [InmuebleDialogContent, DuenoDialogContent, ArrendatarioDialogContent, TecnicoDialogContent]
})


export class MantenedoresModule { }

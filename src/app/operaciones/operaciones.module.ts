import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagesRoutes } from './operaciones.routing';

import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { DigitOnlyModule } from '@uiowa/digit-only';

import { IncidenteComponent, IncidenteDialogContent } from './incidentes/incidente.component';
import { ContratoComponent, ContratoDialogContent } from './contratos/contrato.component';





@NgModule({
  declarations: [IncidenteComponent, IncidenteDialogContent, ContratoComponent, ContratoDialogContent],

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
    NgxPaginationModule,
    DigitOnlyModule

  ],
  providers: [DatePipe],
  entryComponents: [IncidenteDialogContent, ContratoDialogContent]
})


export class OperacionesModule { }

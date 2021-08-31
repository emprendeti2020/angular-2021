import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface IncidenteElement {
    id: number;
    creador: string,
    vivienda: string;
    tipo: string;
    detalle: string;
    fingreso: string;
    prioridad: string;
    estado: string;
  }

  const incidentes: IncidenteElement[] =[ 
    {
        id: 11,
        creador: 'Maru',
        vivienda: 'LTP',
        tipo: 'eléctrico',
        detalle: 'sin electricidad toda la Unidad',
        fingreso: '2021-07-19',
        prioridad: 'alta',
        estado: 'abierto' 
    },
    {
        id: 22,
        creador: 'Maru',
        vivienda: 'LTP',
        tipo: 'agua',
        detalle: 'sin agua toda la Unidad',
        fingreso: '2021-07-19',
        prioridad: 'media',
        estado: 'abierto' 
    },
    {
        id: 33,
        creador: 'Maru',
        vivienda: 'LTP',
        tipo: 'techumbre',
        detalle: 'sin electricidad toda la Unidad',
        fingreso: '2021-07-19',
        prioridad: 'baja',
        estado: 'abierto' 
    }
]

let prioridades = [
    {
      'prioridad':'alta',
      'color': 'red',
    },
    {
      'prioridad':'media',
      'color': 'orange',
    },
    {
      'prioridad':'baja',
      'color': 'green',
    }
  ];



@Component({
    templateUrl: './incidentes.component.html',
     styleUrls: ['./botones.css']

})
export class IncidentesComponent implements OnInit {

    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;
    totalCount = -1;
    Closed = -1;
    Inprogress = -1;
    Open = -1;

    displayedColumns: string[] = ['creador', 'vivienda', 'tipo', 'detalle', 'fingreso', 'prioridad', 'estado', 'accion'];
    dataSource = new MatTableDataSource(incidentes);


    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
        this.totalCount = this.dataSource.data.length;
        this.Open = this.btnCategoryClick('Open');
        this.Closed = this.btnCategoryClick('Closed');
        this.Inprogress = this.btnCategoryClick('In Progress');
        this.dataSource = new MatTableDataSource(incidentes);
    }


    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    btnCategoryClick(val: string): number {
        this.dataSource.filter = val.trim().toLowerCase();
        return this.dataSource.filteredData.length;

    }

    openDialog(action: string, obj: any): void {
        obj.action = action;
        const dialogRef = this.dialog.open(IncidenteDialogContent, {
            data: obj
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.event === 'Add') {
                this.addRowData(result.data);
            } else if (result.event === 'Update') {
                this.updateRowData(result.data);
            } else if (result.event === 'Delete') {
                this.deleteRowData(result.data);
            }
        });
    }
    // tslint:disable-next-line - Disables all
    addRowData(row_obj: IncidenteElement): void {
        const d = new Date();
        this.dataSource.data.push({
            id: d.getTime(),
            creador: row_obj.creador,
            vivienda: row_obj.vivienda,
            tipo: row_obj.tipo,
            detalle: row_obj.detalle,
            fingreso: row_obj.fingreso,
            prioridad: row_obj.prioridad,
            estado: row_obj.estado,
        });
        this.table.renderRows();

    }

    // tslint:disable-next-line - Disables all
    updateRowData(row_obj: IncidenteElement): boolean | any {
        this.dataSource.data = this.dataSource.data.filter((value, key) => {
            if (value.id === row_obj.id) {
                value.creador = row_obj.creador;
                value.vivienda = row_obj.vivienda;
                value.tipo = row_obj.tipo;
                value.detalle = row_obj.detalle;
                value.fingreso = row_obj.fingreso;
                value.prioridad = row_obj.prioridad;
                value.estado = row_obj.estado;
            }
            return true;
        });
    }

    // tslint:disable-next-line - Disables all
    deleteRowData(row_obj: IncidenteElement): boolean | any {
        this.dataSource.data = this.dataSource.data.filter((value, key) => {
            return value.id !== row_obj.id;
        });
    }


}

@Component({
    // tslint:disable-next-line - Disables all
    selector: 'dialog-content',
    templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line - Disables all
export class IncidenteDialogContent {
    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;

    constructor(public dialogRef: MatDialogRef<IncidenteDialogContent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: IncidenteElement) {
        debugger;

        this.local_data = { ...data };
        this.action = this.local_data.action;
    }

    doAction(): void {
        this.dialogRef.close({ event: this.action, data: this.local_data });
    }

    closeDialog(): void {
        this.dialogRef.close({ event: 'Cancel' });
    }

}

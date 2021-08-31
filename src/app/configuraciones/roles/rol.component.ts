import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Rol, RolesService, RolValidatorService } from 'src/app/comun/packs/rol';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/comun/services/utils.service';
import { ValidatorService } from 'src/app/comun/validator/validator.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';


export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];



@Component({
    templateUrl: './rol.component.html'
})


export class RolComponent implements OnInit, AfterViewInit, OnDestroy {


    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;

    displayedColumns: string[] = ['descripcion', 'accion'];
    roles: Rol[] = [];
    dataSource = new MatTableDataSource(this.roles);
    totalCount: number = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private rolSubscription: Subscription = new Subscription();



    constructor(public dialog: MatDialog,
        public datePipe: DatePipe,
        private rolesService: RolesService,
        private eUtil: UtilsService

    ) {


    }

    ngOnInit(): void {
        this.getData();
        this.rolSubscription = this.rolesService.rolesSubject.subscribe(() => {
            this.getData();
        });
    }

    ngOnDestroy(): void {
        this.rolSubscription.unsubscribe();

    }

    //tamaño Pagina 10
    getData(pagprevia: number = 0, pag: number = 0, tam: number = 10): void {

        this.rolesService.getRoles(pag, tam)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.totalCount = parseInt(respuesta.total_count);
                this.paginator.length = this.totalCount;
                this.dataSource = new MatTableDataSource(respuesta.records);
            });

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    btnCategoryClick(estado: string): void { }

    openDialog(action: string, obj: any): void {
        obj.action = action;
        const dialogRef = this.dialog.open(RolDialogContent, {
            data: obj
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.event === 'Eliminar') {
                this.eliminarRowData(result.data);
            } else if (result.event === 'Actualizar') {
                this.actualizarRowData(result.data);
            } else if (result.event === 'Agregar') {
                this.agregarRowData(result.data);
            }

        });
    }

    // tslint:disable-next-line - Disables all
    agregarRowData(row_obj: Rol): void {
        row_obj.estado = 0;

        this.rolesService.getKey("descripcion", row_obj.descripcion).
            subscribe(result => {
                if (result) {
                    this.eUtil.mostrarSnackbar('Rol ' + row_obj.descripcion + ' ya existe, no se puede crear', 5500);
                }
                else {
                    this.rolesService.create(row_obj).subscribe(result => {
                        this.updateTabla();
                        this.eUtil.mostrarSnackbar('Rol Creado');
                    })
                }
            });

    }

    // tslint:disable-next-line - Disables all
    actualizarRowData(row_obj: Rol): void {
        row_obj.estado = 0;
        this.rolesService.update(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Rol Actualizado');

        })

    }

    // tslint:disable-next-line - Disables all
    eliminarRowData(row_obj: Rol): void {
        row_obj.estado = 0;
        this.rolesService.delete(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Rol Eliminado');

        })

    }


    exportToExcel(nTipo: number) {
        this.rolesService.getRoles(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                const datos1 = respuesta.records;
                const datos2 = datos1.map(dato => ({ Descripcion: dato.descripcion }))
                this.eUtil.exportXls(datos2, 'hoja1', 'Roles');
                this.eUtil.mostrarSnackbar('Exportando Roles...');
            });
        //si quiesieras ocultar un dato, puedes hacer algo como esto
        // datos = datos.map(dato=>({nombre:dato.nombre,rut:dato.rut}))
        // o incluso
        // datos = datos.map(({ nombre, rut, ubicacion }) => ({ nombre, rut, ubicacion }))
        //el unico pero, es que tendras que escribi  let datos: any 


    }

    pageChanged(event: PageEvent) {

        let pageIndex = event.pageIndex;
        let pageSize = event.pageSize;

        let previousIndex = event.previousPageIndex;

        let previousSize = pageSize * pageIndex;

        this.getData(previousSize, pageIndex, pageSize);
    }

    updateTabla() {
        //this.getData();
        this.rolesService.actualizar();

    }


}


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'dialog-content',
    templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix


export class RolDialogContent {

    displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): any {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: PeriodicElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    submit(): void {
        let seleccionado: number[] = this.selection.selected.map(item => item.position);
        console.log(seleccionado);
    }



    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;
    selectedImage: any = '';
    joiningDate: any = '';
    roles: Rol[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    miFormulario: FormGroup;

    ngOnInit() {
        this.createForm();
    }

    constructor(
        private rolValidatorService: RolValidatorService,
        private validatorService: ValidatorService,

        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<RolDialogContent>,
        // @Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: Rol,
        private _formBuilder: FormBuilder) {



        this.miFormulario = this.createForm();
        this.local_data = { ...data };
        this.action = this.local_data.action;

        //Actualizo el formulario                    
        this.miFormulario.patchValue(this.local_data);

        //Habilitar Formularios
        this.doActualizarForm(this.action)

        if (this.local_data.DateOfJoining !== undefined) {
            this.joiningDate = this.datePipe.transform(new Date(this.local_data.DateOfJoining), 'yyyy-MM-dd');
        }
        if (this.local_data.imagePath === undefined) {
            this.local_data.imagePath = 'assets/images/users/default.png';
        }


    }

    doAction(): void {
        this.miFormulario.markAllAsTouched();
        if (!this.miFormulario.valid) {
            return;
        }
        this.doActualizarForm();
        const rol: Rol = this.miFormulario.value;
        this.dialogRef.close({ event: this.action, data: rol });
    }
    closeDialog(): void {

        this.submit();
        this.dialogRef.close({ event: 'Cancel' });
    }

    selectFile(event: any): void {
        if (!event.target.files[0] || event.target.files[0].length === 0) {
            // this.msg = 'You must select an image';
            return;
        }
        const mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            // this.msg = "Only images are supported";
            return;
        }
        // tslint:disable-next-line - Disables all
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        // tslint:disable-next-line - Disables all
        reader.onload = (_event) => {
            // tslint:disable-next-line - Disables all
            this.local_data.imagePath = reader.result;
        };
    }

    doActualizarForm(saccion: string = 'Agregar'): void {
        if (saccion === 'Agregar') {
            this.miFormulario.get('id')!.enable();
        }
        else if (saccion === 'Eliminar') {
            this.miFormulario.get('id')!.disable();
            this.miFormulario.get('descripcion')!.disable();
        }
        else {
            //deshabilito la key si es Actualizar
            this.miFormulario.get('descripcion')!.disable();
        }

    }

    createForm(): FormGroup {
        let form = this._formBuilder.group({
            id: ['', []],
            descripcion: ['', [Validators.required], [this.rolValidatorService]],
            estado: ['', []]
        }, { updateOn: 'blur' });
        return form;
    }


}

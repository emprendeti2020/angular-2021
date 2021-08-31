import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Parametro, ParametrosService, ParametroValidatorService } from 'src/app/comun/packs/parametro';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/comun/services/utils.service';
import { ValidatorService } from 'src/app/comun/validator/validator.service';
import { Subscription } from 'rxjs';



@Component({
    templateUrl: './parametro.component.html'
})


export class ParametroComponent implements OnInit, AfterViewInit {


    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;

    displayedColumns: string[] = ['param', 'des', 'v1', 'v2', 'v3', 'v4', 'v5', 'orden', 'accion'];
    parametros: Parametro[] = [];
    dataSource = new MatTableDataSource(this.parametros);
    totalCount: number = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private parametroSubscription: Subscription = new Subscription();



    constructor(public dialog: MatDialog,
        public datePipe: DatePipe,
        private parametrosService: ParametrosService,
        private eUtil: UtilsService

    ) {


    }

    ngOnInit(): void {

        this.getData();
        this.parametroSubscription = this.parametrosService.parametrosSubject.subscribe(() => {
            this.getData();
        });
    }

    ngOnDestroy(): void {
        this.parametroSubscription.unsubscribe();
    }

    //tamaño Pagina 10
    getData(pagprevia: number = 0, pag: number = 0, tam: number = 10): void {

        this.parametrosService.getParametros(pag, tam)
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
        const dialogRef = this.dialog.open(ParametroDialogContent, {
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
    agregarRowData(row_obj: Parametro): void {
        row_obj.estado = 0;

        this.parametrosService.getKey("numdepto", row_obj.param).
            subscribe(result => {
                if (result) {
                    this.eUtil.mostrarSnackbar('Parametro ' + row_obj.param + ' ya existe, no se puede crear', 5500);
                }
                else {
                    this.parametrosService.create(row_obj).subscribe(result => {
                        this.updateTabla();
                        this.eUtil.mostrarSnackbar('Parametro Creado');
                    })
                }
            });

    }

    // tslint:disable-next-line - Disables all
    actualizarRowData(row_obj: Parametro): void {
        row_obj.estado = 0;
        this.parametrosService.update(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Parametro Actualizado');

        })

    }

    // tslint:disable-next-line - Disables all
    eliminarRowData(row_obj: Parametro): void {
        row_obj.estado = 0;
        this.parametrosService.delete(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Parametro Eliminado');

        })

    }


    exportToExcel(nTipo: number) {
        this.parametrosService.getParametros(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                const datos1 = respuesta.records;
                //const datos2 = datos1.map(({ parametro:param,des,v1,v2,v3,v4,v5 }) => ({ param,des,v1,v2,v3,v4,v5 }));
                const datos2 = datos1.map(dato => ({ Parametro: dato.param, Descripcion: dato.des, V1: dato.v1, V2: dato.v2, V3: dato.v3, V4: dato.v4, V5: dato.v5 }))

                this.eUtil.exportXls(datos2, 'hoja1', 'Parametros');
                this.eUtil.mostrarSnackbar('Exportando Parametros...');
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
        this.parametrosService.actualizar();
    }


}


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'dialog-content',
    templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class ParametroDialogContent {
    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;
    selectedImage: any = '';
    joiningDate: any = '';
    parametros: Parametro[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    miFormulario: FormGroup;

    ngOnInit() {
        this.createForm();
    }

    constructor(
        private parametroValidatorService: ParametroValidatorService,
        private validatorService: ValidatorService,

        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<ParametroDialogContent>,
        // @Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: Parametro,
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
        const parametro: Parametro = this.miFormulario.value;
        this.dialogRef.close({ event: this.action, data: parametro });
    }
    closeDialog(): void {

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
            /*                 this.miFormulario.get('id')!.enable();
                            this.miFormulario.get('numdepto')!.enable();
                            this.miFormulario.get('piso')!.enable(); */
        }
        else if (saccion === 'Eliminar') {
            /*                 this.miFormulario.get('id')!.disable();
                            this.miFormulario.get('numdepto')!.disable();
                            this.miFormulario.get('piso')!.disable(); */
        }
        else {
            //deshabilito la key si es Actualizar
            /*                 this.miFormulario.get('numdepto')!.disable(); */
        }

    }

    createForm(): FormGroup {
        let form = this._formBuilder.group({
            id: ['', []],
            param: ['', [Validators.required]],
            des: ['', [Validators.required]],
            v1: ['', [Validators.required]],
            v2: ['', []],
            v3: ['', []],
            v4: ['', []],
            v5: ['', []],
            orden: ['', [Validators.min(0), Validators.max(9999)]],
            estado: ['', []],
        }, { updateOn: 'blur' });
        return form;
    }


}

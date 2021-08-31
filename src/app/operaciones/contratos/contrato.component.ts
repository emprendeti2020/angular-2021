import { Component, OnInit, OnDestroy, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Contrato, ContratosService, ContratoValidatorService } from 'src/app/comun/packs/contrato';
import { delay, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/comun/services/utils.service';
import { ValidatorService } from 'src/app/comun/validator/validator.service';
import { Inmueble, InmueblesService } from 'src/app/comun/packs/inmueble';
import { Dueno, DuenosService } from 'src/app/comun/packs/dueno';
import { Arrendatario, ArrendatariosService } from 'src/app/comun/packs/arrendatario';
import { of, Subscription } from 'rxjs';



@Component({
    templateUrl: './contrato.component.html'
})


export class ContratoComponent implements OnInit, OnDestroy, AfterViewInit {




    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;

    displayedColumns: string[] = ['des_corta', 'calle', 'noma', 'fecha_ini', 'dpago', 'arriendo', 'garantia', 'accion'];
    contratos: Contrato[] = [];
    dataSource = new MatTableDataSource(this.contratos);
    totalCount: number = 0;
    minDate = new Date(2010, 0, 1);
    maxDate = new Date(2030, 0, 1);

    cargando: boolean = true;
    @ViewChild(MatPaginator) paginator!: MatPaginator;


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private contratoSubscription: Subscription = new Subscription();



    constructor(public dialog: MatDialog,
        public datePipe: DatePipe,
        private contratosService: ContratosService,
        private eUtil: UtilsService

    ) {


    }


    ngOnInit(): void {
        this.getData();
        this.contratoSubscription = this.contratosService.contratosSubject.subscribe(() => {
            this.getData();
        });
    }

    ngOnDestroy(): void {
        this.contratoSubscription.unsubscribe();

    }




    //tamaño Pagina 10
    getData(pagprevia: number = 0, pag: number = 0, tam: number = 10): void {


        this.contratosService.getContratos(pag, tam)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.totalCount = parseInt(respuesta.total_count);
                this.paginator.length = this.totalCount;
                this.dataSource = new MatTableDataSource(respuesta.records);
                this.cargando = false;
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
        const dialogRef = this.dialog.open(ContratoDialogContent, {
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
    agregarRowData(row_obj: Contrato): void {
        row_obj.estado = 0;
        console.log('agregarRowData', row_obj);

        this.contratosService.getKey("dpago", "--").
            subscribe(result => {
                if (result) {
                    this.eUtil.mostrarSnackbar('Contrato ' + row_obj.des_corta + ' ya existe, no se puede crear', 5500);
                }
                else {
                    this.contratosService.create(row_obj).subscribe(result => {
                        this.updateTabla();
                        this.eUtil.mostrarSnackbar('Contrato Creado');
                    })
                }
            });

    }

    // tslint:disable-next-line - Disables all
    actualizarRowData(row_obj: Contrato): void {
        row_obj.estado = 0;
        this.contratosService.update(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Contrato Actualizado');

        })

    }

    // tslint:disable-next-line - Disables all
    eliminarRowData(row_obj: Contrato): void {
        row_obj.estado = 0;
        this.contratosService.delete(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Contrato Eliminado');

        })

    }


    exportToExcel(nTipo: number) {
        this.contratosService.getContratos(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                const datos1 = respuesta.records;
                //const datos2 = datos1.map(({ parametro:param,des,v1,v2,v3,v4,v5 }) => ({ param,des,v1,v2,v3,v4,v5 }));
                const datos2 = datos1.map(dato => ({ Inmueble: dato.des_corta, Arrendatario: dato.noma, IContrato: dato.fecha_ini, Pago: dato.dpago, Garantia: dato.garantia, Arriendo: dato.arriendo }))
                this.eUtil.exportXls(datos2, 'hoja1', 'Contratos');
                this.eUtil.mostrarSnackbar('Exportando Contratos...');
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
        this.contratosService.actualizar();

    }


}


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'dialog-content',
    templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class ContratoDialogContent {
    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;
    selectedImage: any = '';
    joiningDate: any = '';
    contratos: Contrato[] = [];
    inmuebles: Inmueble[] = [];
    duenos: Dueno[] = [];
    arrendatarios: Arrendatario[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    miFormulario: FormGroup;

    ngOnInit() {
        this.createForm();
    }

    constructor(
        private contratoValidatorService: ContratoValidatorService,
        private inmueblesService: InmueblesService,
        private duenosService: DuenosService,
        private arrendatariossService: ArrendatariosService,
        private validatorService: ValidatorService,

        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<ContratoDialogContent>,
        // @Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: Contrato,
        private _formBuilder: FormBuilder) {


        /* GET INMUEBLES */
        this.miFormulario = this.createForm();
        this.local_data = { ...data };
        this.action = this.local_data.action;

        let tipo = ((this.action == 'Agregar') ? 'sincontrato' : '');
        //con esto puedo controlar el combo

        this.inmueblesService.getInmuebles(-1, undefined, tipo)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.inmuebles = respuesta.records;
            });
        /* FIN GET - INMBUEBLES */

        /* GET DUENOS */
        this.duenosService.getDuenos(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.duenos = respuesta.records;
            });
        /* FIN GET - DUENOS */

        /* GET ARRENDATARIOS */
        this.arrendatariossService.getArrendatarios(-1, undefined, tipo)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.arrendatarios = respuesta.records;
            });
        /* FIN GET - ARRENDATARIOS */




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
        const contrato: Contrato = this.miFormulario.value;
        this.dialogRef.close({ event: this.action, data: contrato });
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
            this.miFormulario.get('id_inmueble')!.enable();
            this.miFormulario.get('id_arrendatario')!.enable();
            this.miFormulario.get('id_dueno')!.enable();
        }
        else if (saccion === 'Eliminar') {
            this.miFormulario.get('id_inmueble')!.disable();
            this.miFormulario.get('id_arrendatario')!.disable();
            this.miFormulario.get('id_dueno')!.disable();
            this.miFormulario.get('fecha_ini')!.disable();
            this.miFormulario.get('fecha_fin')!.disable();
            this.miFormulario.get('dpago')!.disable();
            this.miFormulario.get('duracion')!.disable();
            this.miFormulario.get('arriendo')!.disable();
            this.miFormulario.get('garantia')!.disable();
            this.miFormulario.get('otro')!.disable();
        }
        else {
            //deshabilito la key si es Actualizar
            this.miFormulario.get('id_inmueble')!.disable();
            this.miFormulario.get('id_arrendatario')!.disable();
            this.miFormulario.get('id_dueno')!.disable();
        }

    }

    createForm(): FormGroup {
        let form = this._formBuilder.group({
            id: ['', []],
            id_inmueble: ['', [Validators.required]],
            id_arrendatario: ['', [Validators.required]],
            id_dueno: ['', [Validators.required]],
            fecha_ini: ['', [Validators.required]],
            fecha_fin: ['', []],
            dpago: ['', [Validators.required]],
            duracion: ['', [Validators.required]],
            arriendo: ['', [Validators.required]],
            garantia: ['', [Validators.required]],
            otro: ['', []],
            estado: ['', []]
        }, { updateOn: 'blur' });
        return form;
    }


}

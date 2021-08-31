import { Component, OnInit, OnDestroy, Inject, Optional, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Inmueble, InmueblesService, InmuebleValidatorService } from 'src/app/comun/packs/inmueble';
import { startWith, takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/comun/services/utils.service';
import { ValidatorService } from 'src/app/comun/validator/validator.service';
import { Parametro, ParametrosService } from 'src/app/comun/packs/parametro';
import { Observable, of } from 'rxjs';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: './inmueble.component.html'
})


export class InmuebleComponent implements OnInit, OnDestroy, AfterViewInit {


    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;

    displayedColumns: string[] = ['dependencia', 'tipoinmueble', 'des_corta', 'calle', 'numero', 'comuna', 'accion'];
    inmuebles: Inmueble[] = [];
    dataSource = new MatTableDataSource(this.inmuebles);
    totalCount: number = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private inmuebleSubscription: Subscription = new Subscription();



    constructor(public dialog: MatDialog,
        public datePipe: DatePipe,
        private inmueblesService: InmueblesService,
        private eUtil: UtilsService

    ) {


    }

    ngOnInit(): void {
        this.getData();
        this.inmuebleSubscription = this.inmueblesService.inmueblesSubject.subscribe(() => {
            this.getData();
        });
    }

    ngOnDestroy(): void {
        this.inmuebleSubscription.unsubscribe();

    }

    //tamaño Pagina 10
    getData(pagprevia: number = 0, pag: number = 0, tam: number = 10): void {

        this.inmueblesService.getInmuebles(pag, tam)
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
        const dialogRef = this.dialog.open(InmuebleDialogContent, {
            data: obj
        });
        dialogRef.afterClosed().subscribe(result => {
            //result.data.id_tipo = result.data.id_tipo.id;

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
    agregarRowData(row_obj: Inmueble): void {
        row_obj.estado = 0;

        this.inmueblesService.getKey("des_corta", row_obj.des_corta).
            subscribe(result => {
                if (result) {
                    this.eUtil.mostrarSnackbar('Inmueble ' + row_obj.des_corta + ' ya existe, no se puede crear', 5500);
                }
                else {
                    this.inmueblesService.create(row_obj).subscribe(result => {
                        this.updateTabla();
                        this.eUtil.mostrarSnackbar('Inmueble Creado');
                    })
                }
            });

    }

    // tslint:disable-next-line - Disables all
    actualizarRowData(row_obj: Inmueble): void {
        row_obj.estado = 0;
        this.inmueblesService.update(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Inmueble Actualizado');

        })

    }

    // tslint:disable-next-line - Disables all
    eliminarRowData(row_obj: Inmueble): void {
        row_obj.estado = 0;
        this.inmueblesService.delete(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Inmueble Eliminado');

        })

    }


    exportToExcel(nTipo: number) {
        this.inmueblesService.getInmuebles(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                const datos1 = respuesta.records;
                const datos2 = datos1.map(dato => ({ Descripcion: dato.des_corta, Calle: dato.calle, Numero: dato.numero, Comuna: dato.comuna }));
                this.eUtil.exportXls(datos2, 'hoja1', 'Inmuebles');
                this.eUtil.mostrarSnackbar('Exportando Inmuebles...');
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
        this.inmueblesService.actualizar();

    }


}


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'dialog-content',
    templateUrl: 'dialog-content.html'
})
// tslint:disable-next-line: component-class-suffix
export class InmuebleDialogContent {
    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;
    selectedImage: any = '';
    joiningDate: any = '';
    inmuebles: Inmueble[] = [];
    inmuebles2: Inmueble[] = [];
    tipoInmueble: Parametro[] = [];
    filtertipoInmueble: Subject<Parametro[]> = new Subject<Parametro[]>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    miFormulario: FormGroup;


    constructor(
        private inmuebleValidatorService: InmuebleValidatorService,
        private validatorService: ValidatorService,

        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<InmuebleDialogContent>,
        // @Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: Inmueble,
        private _formBuilder: FormBuilder,
        private inmueblesService: InmueblesService,
        private parametrosService: ParametrosService
    ) {

        this.inmueblesService.getInmuebles(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.inmuebles2 = respuesta.records;
            });

        /*         this.parametrosService.getParametroporValor("param", "tinmueble", -1)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(respuesta => {
                        this.tipoInmueble = respuesta.records;
                        this.filtertipoInmueble.next(respuesta.records);
                    }); */

        if (this.parametrosService.getTipoInmueble == undefined) {
            this.parametrosService.getParametroStandard("param", "tinmueble", -1)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(respuesta => {
                    this.tipoInmueble = respuesta.records;
                    console.log(this.tipoInmueble);
                    //this.filtertipoInmueble.next(respuesta.records);
                });
        }
        else {
            this.tipoInmueble = this.parametrosService.getTipoInmueble.records;
        }


        /* FIN GET - FUNCIONARIOS */

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

    ngOnInit() {
        this.createForm();
        /*         this.miFormulario.get('id_tipo')!
                    .valueChanges
                    .pipe(
                        startWith(''),
                        map(value => (typeof value === 'string' ? value : value.v1)),
                        map(value => {
                            let _value = value.toLowerCase();
                            return this.tipoInmueble.filter(item => item.v1.toLowerCase().includes(_value))
                        })
        
                    ).subscribe(values => this.filtertipoInmueble.next(values)) */
    }

    displayFn(parametro?: Parametro): string | undefined {
        return parametro ? parametro.v1 : undefined;
    }

    doAction(): void {
        this.miFormulario.markAllAsTouched();
        if (!this.miFormulario.valid) {
            return;
        }
        this.doActualizarForm();
        const inmueble: Inmueble = this.miFormulario.value;
        this.dialogRef.close({ event: this.action, data: inmueble });
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
            this.miFormulario.get('des_corta')!.enable();
        }
        else if (saccion === 'Eliminar') {
            this.miFormulario.get('des_corta')!.disable();
        }
        else {
            //deshabilito la key si es Actualizar
            this.miFormulario.get('des_corta')!.disable();
        }

    }

    createForm(): FormGroup {
        let form = this._formBuilder.group({
            id: ['', []],
            id_dependencia: ['', []],
            des_corta: ['', [Validators.required], [this.inmuebleValidatorService]],
            descripcion: ['', []],
            id_tipo: ['', [Validators.required]],
            calle: ['', [Validators.required]],
            numero: ['', [Validators.required]],
            comuna: ['', [Validators.required]],
            depto: ['', []],
            bodega: ['', []],
            estacionamiento: ['', []],
            rol: ['', []],
            c_luz: ['', []],
            c_agua: ['', []],
            c_gas: ['', []],
            c_otro: ['', []],
            estado: ['', []]
        }, { updateOn: 'blur' });
        return form;
    }

    getInmuebleporId(inmueble: Inmueble) {

        this.miFormulario.get('id_dependencia')?.reset(inmueble.id);
        this.miFormulario.get('id_tipo')?.reset(inmueble.id_tipo);
        this.miFormulario.get('calle')?.reset(inmueble.calle);
        this.miFormulario.get('numero')?.reset(inmueble.numero);
        this.miFormulario.get('comuna')?.reset(inmueble.comuna);
        this.miFormulario.get('depto')?.reset(inmueble.depto);
        this.miFormulario.get('bodega')?.reset(inmueble.bodega);
        this.miFormulario.get('estacionamiento')?.reset(inmueble.estacionamiento);
        this.miFormulario.get('rol')?.reset(inmueble.rol);
        this.miFormulario.get('c_luz')?.reset(inmueble.c_luz);
        this.miFormulario.get('c_agua')?.reset(inmueble.c_agua);
        this.miFormulario.get('c_gas')?.reset(inmueble.c_gas);
        this.miFormulario.get('c_otro')?.reset(inmueble.c_otro);
    }

}

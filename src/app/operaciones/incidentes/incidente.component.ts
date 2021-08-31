import { Component, OnInit, OnDestroy, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Incidente, IncidentesService, IncidenteValidatorService } from 'src/app/comun/packs/incidente';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/comun/services/utils.service';
import { ValidatorService } from 'src/app/comun/validator/validator.service';
import { InmueblesService } from 'src/app/comun/services/inmuebles.service';
import { Inmueble } from 'src/app/comun/interfaces/inmuebles.interface';
import { ParametrosService } from 'src/app/comun/services/parametros.service';
import { Parametro } from 'src/app/comun/interfaces/parametros.interface';
import { Tecnico, TecnicosService } from 'src/app/comun/packs/tecnico';
import { Arrendatario, ArrendatariosService } from 'src/app/comun/packs/arrendatario';
import { Subscription } from 'rxjs';



@Component({
    templateUrl: './incidente.component.html'
})


export class IncidenteComponent implements OnInit, OnDestroy, AfterViewInit {


    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;

    displayedColumns: string[] = ['des_corta', 'nom_arrendatario', 'fecha', 'incidente', 'estadoincidente', 'tipoincidente', 'accion'];
    incidentes: Incidente[] = [];

    dataSource = new MatTableDataSource(this.incidentes);
    totalCount: number = 0;
    cargando: boolean = true;
    estadoincidente: string = 'Abierto';


    @ViewChild(MatPaginator) paginator!: MatPaginator;

    private incidenteSubscription: Subscription = new Subscription();
    private _unsubscribeAll: Subject<any> = new Subject<any>();



    constructor(public dialog: MatDialog,
        public datePipe: DatePipe,
        private incidentesService: IncidentesService,
        private eUtil: UtilsService

    ) {


    }

    ngOnInit(): void {
        this.getData();
        this.incidenteSubscription = this.incidentesService.incidentesSubject.subscribe(() => {
            this.getData();
        });
    }

    ngOnDestroy(): void {
        this.incidenteSubscription.unsubscribe();

    }

    //tamaño Pagina 10
    getData(pagprevia: number = 0, pag: number = 0, tam: number = 10): void {
        this.cargando = true;
        this.incidentesService.getIncidentes(pag, tam, '', this.estadoincidente)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.totalCount = parseInt(respuesta.total_count);
                this.paginator.length = this.totalCount;
                this.dataSource = new MatTableDataSource(respuesta.records);
                this.cargando = false;
            });

    }

    btnFiltro(estadoincidente: string): void {
        this.estadoincidente = estadoincidente;
        this.getData();
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
        const dialogRef = this.dialog.open(IncidenteDialogContent, {
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
    agregarRowData(row_obj: Incidente): void {
        row_obj.estado = 0;

        this.incidentesService.getKey("id", row_obj.incidente).
            subscribe(result => {
                if (result) {
                    this.eUtil.mostrarSnackbar('Incidente ya existe, no se puede crear', 5500);
                }
                else {
                    this.incidentesService.create(row_obj).subscribe(result => {
                        this.updateTabla();
                        this.eUtil.mostrarSnackbar('Incidente Creado');
                    })
                }
            });

    }

    // tslint:disable-next-line - Disables all
    actualizarRowData(row_obj: Incidente): void {
        row_obj.estado = 0;
        this.incidentesService.update(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Incidente Actualizado');

        })

    }

    // tslint:disable-next-line - Disables all
    eliminarRowData(row_obj: Incidente): void {
        row_obj.estado = 0;
        this.incidentesService.delete(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Incidente Eliminado');

        })

    }


    exportToExcel(nTipo: number) {
        this.incidentesService.getIncidentes(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                const datos1 = respuesta.records;
                //const datos2 = datos1.map(({ parametro:param,des,v1,v2,v3,v4,v5 }) => ({ param,des,v1,v2,v3,v4,v5 }));
                const datos2 = datos1.map(dato => ({ Incidente: dato.id, Arrendatario: dato.nom_arrendatario, Fecha: dato.fecha, DIncidente: dato.incidente }))
                this.eUtil.exportXls(datos2, 'hoja1', 'Incidentes');
                this.eUtil.mostrarSnackbar('Exportando Incidentes...');
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
        this.incidentesService.actualizar();

    }


}


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'dialog-content',
    templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class IncidenteDialogContent {
    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;
    selectedImage: any = '';
    joiningDate: any = '';
    incidentes: Incidente[] = [];
    inmuebles: Inmueble[] = [];
    arrendatario: Arrendatario[] = [];
    inmuebleselect: Inmueble | undefined;
    tecnicos: Tecnico[] = [];
    tipoIncidente: Parametro[] = [];
    estadoIncidente: Parametro[] = [];
    id_inmuebleuu: number = 0;
    fonoarr: string = '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    miFormulario: FormGroup;

    ngOnInit() {
        this.createForm();
        this.miFormulario.get('id_inmueblefull')!.valueChanges
            .subscribe(inmueble => {
                if (inmueble) {
                    this.miFormulario.get('id_inmueble')!.setValue(inmueble.id);
                    this.miFormulario.get('nom_arrendatario')!.setValue(inmueble.nom_arrendatario);
                    this.miFormulario.get('id_arrendatario')!.setValue(inmueble.id_arrendatario);
                    this.miFormulario.get('id_contrato')!.setValue(inmueble.id_contrato);
                    this.miFormulario.get('id_dueno')!.setValue(inmueble.id_dueno);
                    this.miFormulario.get('nom_dueno')!.setValue(inmueble.nom_dueno);

                    //acá voy por los datos del arrendatario
                    this.arrendatariosService.getArrendatarios(0, 20, '', inmueble.id_arrendatario)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(respuesta => {
                            this.arrendatario = respuesta.records;
                            this.fonoarr = this.arrendatario[0].fono01;
                            console.log(this.fonoarr);
                            console.log(this.arrendatario);
                        });
                }
            })

        this.cargarInmueble();


    }

    constructor(
        private incidenteValidatorService: IncidenteValidatorService,
        private inmueblesService: InmueblesService,
        private parametrosService: ParametrosService,
        private tecnicosService: TecnicosService,
        private arrendatariosService: ArrendatariosService,
        private validatorService: ValidatorService,

        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<IncidenteDialogContent>,
        // @Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: Incidente,
        private _formBuilder: FormBuilder) {



        this.miFormulario = this.createForm();
        this.local_data = { ...data }
        this.action = this.local_data.action;




        //
        //TIPO INCIDENTE
        if (this.parametrosService.gettipoIncidente == undefined) {
            this.parametrosService.getParametroStandard("param", "tipoincidente", -1)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(respuesta => {
                    this.tipoIncidente = respuesta.records;
                });
        }
        else {
            this.tipoIncidente = this.parametrosService.gettipoIncidente.records;
        }
        //TIPO INCIDENTE

        //con esto puedo controlar el combo
        this.tecnicosService.getTecnicos(-1, undefined)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.tecnicos = respuesta.records;
            });

        //   

        //ESTADO DEL INCIDENTE
        if (this.parametrosService.getestadoIncidente == undefined) {
            this.parametrosService.getParametroStandard("param", "estadoincidente", -1)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(respuesta => {
                    this.estadoIncidente = respuesta.records;
                });
        }
        else {
            this.estadoIncidente = this.parametrosService.gettipoIncidente.records;
        }
        //ESTADO DEL INCIDENTE        




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


    cargarInmueble() {
        this.inmueblesService.getInmuebles(-1, undefined, 'concontrato')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.inmuebles = respuesta.records;
                let id_inmuebleuu = this.local_data.id_inmueble;
                this.inmuebleselect = this.inmuebles.find(element => {
                    return element.id == id_inmuebleuu;
                });
                this.miFormulario.get('id_inmueblefull')!.setValue(this.inmuebleselect);
            });

    }


    doAction(): void {

        this.doActualizarForm();
        const incidente: Incidente = this.miFormulario.value;
        this.dialogRef.close({ event: this.action, data: incidente });
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
            this.miFormulario.get('nom_arrendatario')!.enable();
        }
        else if (saccion === 'Eliminar') {
            this.miFormulario.markAllAsTouched();

            this.miFormulario.get('nom_arrendatario')!.disable();
        }
        else {
            //deshabilito la key si es Actualizar
            this.miFormulario.get('nom_arrendatario')!.disable();
            for (let el in this.miFormulario.controls) {
                if (this.miFormulario.controls[el].errors) {
                    console.log(el)
                }
            }



        }

    }

    createForm(): FormGroup {
        let form = this._formBuilder.group({
            id: ['', []],
            id_inmueble: ['', []],
            id_inmueblefull: ['', [Validators.required]],
            id_tipoincidente: ['', [Validators.required]],
            id_estadoincidente: ['', [Validators.required]],
            id_contrato: ['', []],
            id_tecnico: ['', []],
            id_dueno: ['', []],
            nom_dueno: ['', []],
            fecha: ['', [Validators.required]],
            id_usuario: ['', []],
            incidente: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
            fecha01: ['', []],
            obs01: ['', [Validators.minLength(4), Validators.maxLength(100)]],
            fecha02: ['', []],
            obs02: ['', [Validators.minLength(4), Validators.maxLength(200)]],
            fecha03: ['', []],
            obs03: ['', [Validators.minLength(4), Validators.maxLength(200)]],
            id_arrendatario: ['', []],
            nom_arrendatario: ['', []],
            estado: ['', []],
        }, { updateOn: 'blur' });
        return form;
    }




}

import { Component, OnInit, OnDestroy, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Arrendatario, ArrendatariosService, ArrendatarioValidatorService } from 'src/app/comun/packs/arrendatario';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/comun/services/utils.service';
import { ValidatorService } from 'src/app/comun/validator/validator.service';
import { Subscription } from 'rxjs';



@Component({
    templateUrl: './arrendatario.component.html'
})


export class ArrendatarioComponent implements OnInit, OnDestroy, AfterViewInit {


    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;

    displayedColumns: string[] = ['rut', 'inicial', 'nombre', 'email01', 'email02', 'fono01', 'fono02', 'accion'];
    arrendatarios: Arrendatario[] = [];
    dataSource = new MatTableDataSource(this.arrendatarios);
    totalCount: number = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private arrendatarioSubscription: Subscription = new Subscription();



    constructor(public dialog: MatDialog,
        public datePipe: DatePipe,
        private arrendatariosService: ArrendatariosService,
        private eUtil: UtilsService

    ) {


    }

    ngOnInit(): void {
        this.getData();
        this.arrendatarioSubscription = this.arrendatariosService.arrendatariosSubject.subscribe(() => {
            this.getData();
        });
    }

    ngOnDestroy(): void {
        this.arrendatarioSubscription.unsubscribe();

    }

    //tamaño Pagina 10
    getData(pagprevia: number = 0, pag: number = 0, tam: number = 10): void {

        this.arrendatariosService.getArrendatarios(pag, tam)
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
        const dialogRef = this.dialog.open(ArrendatarioDialogContent, {
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
    agregarRowData(row_obj: Arrendatario): void {
        row_obj.estado = 0;

        this.arrendatariosService.getKey("rut", row_obj.rut).
            subscribe(result => {
                if (result) {
                    this.eUtil.mostrarSnackbar('Arrendatario ' + row_obj.rut + ' ya existe, no se puede crear', 5500);
                }
                else {
                    this.arrendatariosService.create(row_obj).subscribe(result => {
                        this.updateTabla();
                        this.eUtil.mostrarSnackbar('Arrendatario Creado');
                    })
                }
            });

    }

    // tslint:disable-next-line - Disables all
    actualizarRowData(row_obj: Arrendatario): void {
        row_obj.estado = 0;
        this.arrendatariosService.update(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Arrendatario Actualizado');

        })

    }

    // tslint:disable-next-line - Disables all
    eliminarRowData(row_obj: Arrendatario): void {
        row_obj.estado = 0;
        this.arrendatariosService.delete(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Arrendatario Eliminado');

        })

    }


    exportToExcel(nTipo: number) {
        this.arrendatariosService.getArrendatarios(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                const datos1 = respuesta.records;
                //const datos2 = datos1.map(({ parametro:param,des,v1,v2,v3,v4,v5 }) => ({ param,des,v1,v2,v3,v4,v5 }));
                const datos2 = datos1.map(dato => ({ Rut: dato.rut, Iniciales: dato.inicial, Nombre: dato.nombre, Direccion: dato.direccion, Fono: dato.fono01, Fono2: dato.fono02, Email: dato.email01, Email2: dato.email02, Otro: dato.otro }))
                this.eUtil.exportXls(datos2, 'hoja1', 'Arrendatarios');
                this.eUtil.mostrarSnackbar('Exportando Arrendatarios...');
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
        this.arrendatariosService.actualizar();
    }


}


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'dialog-content',
    templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class ArrendatarioDialogContent {
    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;
    selectedImage: any = '';
    joiningDate: any = '';
    arrendatarios: Arrendatario[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    miFormulario: FormGroup;

    ngOnInit() {
        this.createForm();
    }

    constructor(
        private arrendatarioValidatorService: ArrendatarioValidatorService,
        private validatorService: ValidatorService,

        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<ArrendatarioDialogContent>,
        // @Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: Arrendatario,
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
        const arrendatario: Arrendatario = this.miFormulario.value;
        this.dialogRef.close({ event: this.action, data: arrendatario });
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
            this.miFormulario.get('rut')!.enable();
            this.miFormulario.get('inicial')!.enable();
        }
        else if (saccion === 'Eliminar') {
            this.miFormulario.get('rut')!.disable();
            this.miFormulario.get('inicial')!.disable();
        }
        else {
            //deshabilito la key si es Actualizar
            this.miFormulario.get('rut')!.disable();
            this.miFormulario.get('inicial')!.disable();
        }

    }

    createForm(): FormGroup {
        let form = this._formBuilder.group({
            id: ['', []],
            rut: ['', [Validators.required, this.validatorService.rutNovalido, Validators.pattern(this.validatorService.rutPattern)], [this.arrendatarioValidatorService]],
            inicial: ['', [Validators.required], [this.arrendatarioValidatorService]],
            nombre: ['', [Validators.required]],
            direccion: ['', [Validators.required]],
            email01: ['', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
            email02: ['', [Validators.pattern(this.validatorService.emailPattern)]],
            fono01: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
            fono02: ['', [Validators.minLength(9), Validators.maxLength(12)]],
            estado: ['', []],
            otro: ['', []]
        }, { updateOn: 'blur' });
        return form;
    }


}

import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Usuario, UsuariosService, UsuarioValidatorService } from 'src/app/comun/packs/usuario';


import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/comun/services/utils.service';
import { ValidatorService } from 'src/app/comun/validator/validator.service';
import { Subscription } from 'rxjs';
import { Rol, RolesService } from 'src/app/comun/packs/rol';



@Component({
    templateUrl: './usuario.component.html'
})


export class UsuarioComponent implements OnInit, AfterViewInit, OnDestroy {


    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;

    displayedColumns: string[] = ['usuario', 'email', 'nombre', 'descripcion', 'accion'];
    usuarios: Usuario[] = [];
    dataSource = new MatTableDataSource(this.usuarios);
    totalCount: number = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private usuarioSubscription: Subscription = new Subscription();


    constructor(public dialog: MatDialog,
        public datePipe: DatePipe,
        private usuariosService: UsuariosService,
        private eUtil: UtilsService

    ) {


    }

    ngOnInit(): void {
        this.getData();
        this.usuarioSubscription = this.usuariosService.usuariosSubject.subscribe(() => {
            this.getData();
        });
    }

    ngOnDestroy(): void {
        this.usuarioSubscription.unsubscribe();

    }

    //tamaño Pagina 10
    getData(pagprevia: number = 0, pag: number = 0, tam: number = 10): void {

        this.usuariosService.getUsuarios(pag, tam)
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
        const dialogRef = this.dialog.open(UsuarioDialogContent, {
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
    agregarRowData(row_obj: Usuario): void {
        row_obj.estado = 0;

        this.usuariosService.getKey("usuario", row_obj.usuario).
            subscribe(result => {
                if (result) {
                    this.eUtil.mostrarSnackbar('Usuario ' + row_obj.usuario + ' ya existe, no se puede crear', 5500);
                }
                else {
                    this.usuariosService.create(row_obj).subscribe(result => {
                        this.updateTabla();
                        this.usuariosService.actualizar();
                        this.eUtil.mostrarSnackbar('Usuario Creado');
                    })
                }
            });

    }

    // tslint:disable-next-line - Disables all
    actualizarRowData(row_obj: Usuario): void {
        row_obj.estado = 0;
        this.usuariosService.update(row_obj).subscribe(result => {
            this.updateTabla();
            this.usuariosService.actualizar();
            this.eUtil.mostrarSnackbar('Usuario Actualizado');

        })

    }

    // tslint:disable-next-line - Disables all
    eliminarRowData(row_obj: Usuario): void {
        row_obj.estado = 0;
        this.usuariosService.delete(row_obj).subscribe(result => {
            this.updateTabla();
            this.usuariosService.actualizar();
            this.eUtil.mostrarSnackbar('Usuario Eliminado');

        })

    }


    exportToExcel(nTipo: number) {
        this.usuariosService.getUsuarios(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                const datos1 = respuesta.records;
                const datos2 = datos1.map(dato => ({ Usuario: dato.usuario, Email: dato.email, Nombre: dato.nombre, Descripcion: dato.descripcion }));
                this.eUtil.exportXls(datos2, 'hoja1', 'Usuarios');
                this.eUtil.mostrarSnackbar('Exportando Usuarios...');
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
    }


}


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'dialog-content',
    templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class UsuarioDialogContent {
    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;
    selectedImage: any = '';
    joiningDate: any = '';
    usuarios: Usuario[] = [];
    roles: Rol[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    miFormulario: FormGroup;

    ngOnInit() {
        this.createForm();
        this.cargarRoles()

    }

    constructor(
        private usuarioValidatorService: UsuarioValidatorService,
        private rolesService: RolesService,
        private validatorService: ValidatorService,

        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<UsuarioDialogContent>,
        // @Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: Usuario,
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

    cargarRoles(): void {
        this.rolesService.getRoles(0, 10)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                this.roles = respuesta.records;
                console.log(this.roles);
            });
    }

    doAction(): void {
        this.miFormulario.markAllAsTouched();
        if (!this.miFormulario.valid) {
            return;
        }
        this.doActualizarForm();
        const usuario: Usuario = this.miFormulario.value;
        this.dialogRef.close({ event: this.action, data: usuario });
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
            this.miFormulario.get('id')!.enable();
            this.miFormulario.get('usuario')!.enable();
            this.miFormulario.get('email')!.enable();
        }
        else if (saccion === 'Eliminar') {
            this.miFormulario.get('id')!.disable();
            this.miFormulario.get('usuario')!.disable();
            this.miFormulario.get('email')!.disable();
        }
        else {
            //deshabilito la key si es Actualizar
            this.miFormulario.get('usuario')!.disable();
            this.miFormulario.get('email')!.disable();
        }

    }

    createForm(): FormGroup {
        let form = this._formBuilder.group({
            id: ['', []],
            usuario: ['', [Validators.required, Validators.minLength(3)], [this.usuarioValidatorService]],
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.minLength(3)], [this.usuarioValidatorService]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            valpassword: ['', [Validators.required, Validators.minLength(6)]],
            id_rol: ['', [Validators.required]],
            estado: ['', []]
        }, { updateOn: 'blur', validators: [this.validatorService.camposIguales('password', 'valpassword')] });
        return form;
    }


}

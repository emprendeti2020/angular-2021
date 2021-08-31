import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Depto, DeptosService, DeptoValidatorService } from 'src/app/comun/packs/depto';
import { takeUntil, tap  } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/comun/services/utils.service';
import { ValidatorService } from 'src/app/comun/validator/validator.service';



@Component({
    templateUrl: './empresa.component.html'
})


export class EmpresaComponent implements OnInit, AfterViewInit {


    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;

    displayedColumns: string[] = ['numdepto', 'piso', 'accion'];
    deptos: Depto[] =[];
    dataSource = new MatTableDataSource(this.deptos);    
    totalCount:number=0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    

    private _unsubscribeAll: Subject<any> = new Subject<any>();


 
    constructor (public dialog: MatDialog, 
                public datePipe: DatePipe, 
                private deptosService: DeptosService,
                private eUtil: UtilsService

      ) {

       
     }

    ngOnInit(): void {
        this.getData();
    }

    //tamaño Pagina 10
    getData(pagprevia:number=0, pag:number=0, tam:number=10): void{
 
        this.deptosService.getDeptos(pag,tam)
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

    btnCategoryClick(estado: string): void {}

    openDialog(action: string, obj: any): void {
        obj.action = action;
        const dialogRef = this.dialog.open(EmpresaDialogContent, {
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
    agregarRowData(row_obj: Depto): void {
        row_obj.estado=0;

        this.deptosService.getKey("numdepto", row_obj.numdepto).
        subscribe(result => {
            if (result) { 
               this.eUtil.mostrarSnackbar('Depto '+ row_obj.numdepto  +' ya existe, no se puede crear',5500);
            }
            else
            {
                this.deptosService.create(row_obj).subscribe(result => {            
                    this.updateTabla();
                    this.eUtil.mostrarSnackbar('Depto Creado');
                })
            }
        });

    }    

    // tslint:disable-next-line - Disables all
    actualizarRowData(row_obj: Depto): void {
        row_obj.estado=0;
        this.deptosService.update(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Depto Actualizado');

        })

    }

    // tslint:disable-next-line - Disables all
    eliminarRowData(row_obj: Depto): void {
        row_obj.estado=0;
        this.deptosService.delete(row_obj).subscribe(result => {
            this.updateTabla();
            this.eUtil.mostrarSnackbar('Depto Eliminado');            

        })

    }
    
    
    exportToExcel(nTipo: number) {
        this.deptosService.getDeptos(-1)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(respuesta => {
                const datos1 = respuesta.records;
                this.eUtil.exportXls(datos1,'hoja1','Departamentos');
                this.eUtil.mostrarSnackbar('Exportando Departamentos...');
             });    
        //si quiesieras ocultar un dato, puedes hacer algo como esto
        // datos = datos.map(dato=>({nombre:dato.nombre,rut:dato.rut}))
        // o incluso
        // datos = datos.map(({ nombre, rut, ubicacion }) => ({ nombre, rut, ubicacion }))
        //el unico pero, es que tendras que escribi  let datos: any 


    }

    pageChanged(event: PageEvent){
 
        let pageIndex = event.pageIndex;
        let pageSize = event.pageSize;
    
        let previousIndex = event.previousPageIndex;
    
        let previousSize = pageSize * pageIndex;
    
        this.getData(previousSize, pageIndex, pageSize);
      }     

    updateTabla() {
        this.getData();
    }      
      

}


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'dialog-content',
    templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class EmpresaDialogContent {
    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;
    selectedImage: any = '';
    joiningDate: any = '';
    deptos: Depto[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    miFormulario: FormGroup;   

    ngOnInit() {
        this.createForm();
      }

    constructor(
        private deptoValidatorService: DeptoValidatorService,
        private validatorService: ValidatorService,

        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<EmpresaDialogContent>,
        // @Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: Depto,
        private _formBuilder: FormBuilder        ) {

        

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
        const depto: Depto = this.miFormulario.value;
        this.dialogRef.close({ event: this.action, data: depto });
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

    doActualizarForm(saccion:string = 'Agregar'): void 
    {  
        if (saccion==='Agregar')
            {
                this.miFormulario.get('id')!.enable();
                this.miFormulario.get('numdepto')!.enable();
                this.miFormulario.get('piso')!.enable();
            }
        else if (saccion === 'Eliminar')
            {
                this.miFormulario.get('id')!.disable();
                this.miFormulario.get('numdepto')!.disable();
                this.miFormulario.get('piso')!.disable();
            }
        else
            {
                //deshabilito la key si es Actualizar
                this.miFormulario.get('numdepto')!.disable();
            }
            
    }

     createForm(): FormGroup {
        let form = this._formBuilder.group({
            id             : ['', [ ]],
            numdepto       : ['', [ Validators.required],[this.deptoValidatorService]],
            piso           : ['', [ Validators.required ]],
            estado         : ['', [ ]]
        },{updateOn: 'blur'});        
        return form;
    }  
  

}

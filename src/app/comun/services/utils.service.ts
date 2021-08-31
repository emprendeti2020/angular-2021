import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
//excel
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor( private snackBar: MatSnackBar,

  ) { }

  exportXls(datos:any,hoja1:string, excelNombre:string) {

      

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, hoja1);
    XLSX.writeFile(wb, excelNombre + '.xlsx');

  }


  mostrarSnackbar( mensaje: string, duration: number=2500   ) {

    this.snackBar.open( mensaje, 'Mensaje', {
      duration: duration,
    },);    
    
  }  

  hashPassword(password: string){
    return "*".repeat(password.length)
  }

}



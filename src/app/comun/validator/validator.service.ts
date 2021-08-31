import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public nombreApellidoPattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public rutPattern: string = '^[0-9]+-[0-9kK]{1}$';

  constructor() { }



  camposIguales(campo1: string, campo2: string) {

    return (formGroup: AbstractControl): ValidationErrors | null => {

      const pass1 = formGroup.get(campo1)?.value;
      const pass2 = formGroup.get(campo2)?.value;

      if (pass1 !== pass2) {
        formGroup.get(campo2)?.setErrors({ noIguales: true });
        return { noIguales: true }
      }


      formGroup.get(campo2)?.setErrors(null);

      return null
    }

  }

  rutNovalido(control: FormControl): ValidationErrors | null {
    let valor: any = control.value?.trim().toLowerCase();

    valor = valor.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()

    // Divide el valor ingresado en dígito verificador y resto del RUT.
    let cuerpo: any = valor.slice(0, -1);
    let dv: any = valor.slice(-1).toUpperCase();

    // Calcular Dígito Verificador "Método del Módulo 11"
    let suma: number = 0;
    let multiplo: number = 2;

    let i: number = 0;
    let index: number = 0;

    //console.log('cuerpo',dv,cuerpo);

    // Para cada dígito del Cuerpo
    for (i = 1; i <= cuerpo.length; i++) {
      // Obtener su Producto con el Múltiplo Correspondiente
      index = multiplo * valor.charAt(cuerpo.length - i);

      // Sumar al Contador General
      suma = suma + index;

      // Consolidar Múltiplo dentro del rango [2,7]
      if (multiplo < 7) {
        multiplo = multiplo + 1;
      } else {
        multiplo = 2;
      }
    }
    let dvEsperado: any;

    // Calcular Dígito Verificador en base al Módulo 11
    dvEsperado = 11 - (suma % 11);

    // Casos Especiales (0 y K)
    dv = dv == "K" ? 10 : dv;
    dv = dv == 0 ? 11 : dv;



    // Validar que el Cuerpo coincide con su Dígito Verificador
    if (dvEsperado.toString() !== dv.toString()) {
      //console.log(dv,dvEsperado);
      return { rutNovalido: true }
    }

    //console.log('rut valido');

    return null;
  }


}

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'largo'
})

export class LargoPipe implements PipeTransform {

  transform( valor:string, largo:number): string {
    if(valor.length > 10)
      return valor.slice(0,largo) + '...';
    else
      return valor;
  }

}

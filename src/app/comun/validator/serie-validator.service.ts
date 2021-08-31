import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FuncionarioResponse, Search } from '../interfaces/funcionarios.interface';

@Injectable({
  providedIn: 'root'
})
export class SerieValidatorService implements AsyncValidator {

  private search: Search[] = [];
  private baseUrl: string = environment.baseUrl;


  constructor( private http: HttpClient ) { }
  

  validate( control: AbstractControl): Observable<ValidationErrors | null> {

    if(control.disabled && control.value.length >0 )
      return of(null);

    let params = new HttpParams();
    params = params.append('orAnd', 'AND');    



    const serie= control.value;
    this.search.push({columnName:"serie", columnLogic:"=", columnValue:serie});
    const body = this.search

    return  this.http.post<FuncionarioResponse>(this.baseUrl + '/equipos/search_by_column.php', body, {  params: params} )
      .pipe (      
        map ( resp => {                
            if (resp.status==='success')
                return  { serieExiste: true }
            else
                return null;
        })); 
 

  }

}

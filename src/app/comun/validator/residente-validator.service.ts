import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResidenteResponse, Search } from '../interfaces/residentes.interface';

@Injectable({
  providedIn: 'root'
})
export class ResidenteValidatorService implements AsyncValidator {

  private search: Search[] = [];
  private baseUrl: string = environment.baseUrl;


  constructor( private http: HttpClient ) { }
  

  validate( control: AbstractControl): Observable<ValidationErrors | null> {


     let params = new HttpParams();
    params = params.append('orAnd', 'AND');    

    const numdepto = control.value;
    this.search.push({columnName:"rut", columnLogic:"=", columnValue:numdepto});
    const body = this.search

    return  this.http.post<ResidenteResponse>(this.baseUrl + '/residentes/search_by_column.php', body, {  params: params} )
      .pipe (      
        map ( resp => {                
            if (resp.status==='success')
                return  { residenteExiste: true }
            else
                return null;
        })); 
 

  }

}

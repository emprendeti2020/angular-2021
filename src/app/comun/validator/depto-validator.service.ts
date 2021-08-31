import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DeptoResponse, Search } from '../interfaces/deptos.interface';

@Injectable({
  providedIn: 'root'
})
export class DeptoValidatorService implements AsyncValidator {

  private search: Search[] = [];
  private baseUrl: string = environment.baseUrl;


  constructor( private http: HttpClient ) { }
  

  validate( control: AbstractControl): Observable<ValidationErrors | null> {


     let params = new HttpParams();
    params = params.append('orAnd', 'AND');    

    const numdepto = control.value;
    this.search.push({columnName:"numdepto", columnLogic:"=", columnValue:numdepto});
    const body = this.search

    return  this.http.post<DeptoResponse>(this.baseUrl + '/deptos/search_by_column.php', body, {  params: params} )
      .pipe (      
        map ( resp => {                
            if (resp.status==='success')
                return  { deptoExiste: true }
            else
                return null;
        })); 
 

  }

}

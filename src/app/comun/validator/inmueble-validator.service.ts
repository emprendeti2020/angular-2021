import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { InmuebleResponse, Search } from '../interfaces/inmuebles.interface';

@Injectable({
  providedIn: 'root'
})
export class InmuebleValidatorService implements AsyncValidator {

  private search: Search[] = [];
  private baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }


  validate(control: AbstractControl): Observable<ValidationErrors | null> {


    let params = new HttpParams();
    params = params.append('orAnd', 'AND');

    const des_corta = control.value;
    this.search.push({ columnName: "des_corta", columnLogic: "=", columnValue: des_corta });
    const body = this.search

    return this.http.post<InmuebleResponse>(this.baseUrl + '/inmuebles/search_by_column.php', body, { params: params })
      .pipe(
        map(resp => {
          if (resp.status === 'success')
            return { inmuebleExiste: true }
          else
            return null;
        }));


  }

}

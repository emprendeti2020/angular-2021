import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RolResponse, Search } from '../interfaces/roles.interface';

@Injectable({
  providedIn: 'root'
})
export class RolValidatorService implements AsyncValidator {

  private search: Search[] = [];
  private baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }


  validate(control: AbstractControl): Observable<ValidationErrors | null> {


    let params = new HttpParams();
    params = params.append('orAnd', 'AND');

    const descripcion = control.value;
    this.search.push({ columnName: "descripcion", columnLogic: "=", columnValue: descripcion });
    const body = this.search

    return this.http.post<RolResponse>(this.baseUrl + '/roles/search_by_column.php', body, { params: params })
      .pipe(
        map(resp => {
          if (resp.status === 'success')
            return { rolExiste: true }
          else
            return null;
        }));


  }

}

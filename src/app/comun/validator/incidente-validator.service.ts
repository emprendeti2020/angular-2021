import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IncidenteResponse, Search } from '../interfaces/incidentes.interface';

@Injectable({
  providedIn: 'root'
})
export class IncidenteValidatorService implements AsyncValidator {

  private search: Search[] = [];
  private baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }


  validate(control: AbstractControl): Observable<ValidationErrors | null> {


    let params = new HttpParams();
    params = params.append('orAnd', 'AND');

    const rut = control.value;
    this.search.push({ columnName: "rut", columnLogic: "=", columnValue: rut });
    const body = this.search

    return this.http.post<IncidenteResponse>(this.baseUrl + '/incidentes/search_by_column.php', body, { params: params })
      .pipe(
        map(resp => {
          if (resp.status === 'success')
            return { incidenteExiste: true }
          else
            return null;
        }));


  }

}

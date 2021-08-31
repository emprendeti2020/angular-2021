import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ArrendatarioResponse, Search } from '../interfaces/arrendatarios.interface';

@Injectable({
  providedIn: 'root'
})
export class ArrendatarioValidatorService implements AsyncValidator {

  private search: Search[] = [];
  private baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }


  validate(control: AbstractControl): Observable<ValidationErrors | null> {


    this.search = [];

    let params = new HttpParams();
    params = params.append('orAnd', 'AND');

    const nombrecolumn = this.getName(control);
    const usuario = control.value;

    this.search.push({ columnName: nombrecolumn!, columnLogic: "=", columnValue: usuario });
    const body = this.search

    return this.http.post<ArrendatarioResponse>(this.baseUrl + '/arrendatarios/search_by_column.php', body, { params: params })
      .pipe(
        map(resp => {
          if (resp.status === 'success')
            return { arrendatarioExiste: true }
          else
            return null;
        }));


  }

  private getName(control: AbstractControl): string | null {
    let group = <FormGroup>control.parent;

    if (!group) {
      //return null;
      return "no-encontrado";
    }

    let name: string = '';

    Object.keys(group.controls).forEach(key => {
      let childControl = group.get(key);

      if (childControl !== control) {
        return;
      }

      name = key.trim();
    });

    return name;
  }

}

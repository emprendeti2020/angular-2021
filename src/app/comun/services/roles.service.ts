import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Rol, RolResponse, Document, Search } from '../interfaces/roles.interface';


@Injectable({
    providedIn: 'root'
})
export class RolesService {




    rolesSubject = new Subject();
    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }


    getRol(pagina: number = 0, tampagina: number = 10): Observable<Rol[]> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }

        //coleccion de Funcionarios

        return this.http.get<respuesta<Rol>>(this.baseUrl + '/roles/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }


    getRoles(pagina: number = 0, tampagina: number = 10, tipo: string = ''): Observable<Document> {
        //Parametros

        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }
        return this.http.get<RolResponse>(this.baseUrl + '/roles/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document)
            );
    }


    getKey(key: string, keyvalue: string, pagina: number = 0, tampagina: number = 10): Observable<boolean> {

        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
            params = params.append('orAnd', 'AND');
        }
        this.search.push({ columnName: key, columnLogic: "=", columnValue: keyvalue });
        const body = this.search

        return this.http.post<RolResponse>(this.baseUrl + '/roles/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }

    getUsuarioPorId(id: string): Observable<Rol> {

        return this.http.get<Rol>(this.baseUrl + '/roles/' + id);
    }

    create(rol: Rol) {
        rol.estado = 0;
        return this.http.post<Rol>(this.baseUrl + '/roles/create.php', rol)
    }

    delete(rol: Rol) {
        return this.http.post<Rol>(this.baseUrl + '/roles/delete.php', rol);
    }

    update(rol: Rol) {
        rol.estado = 0;
        return this.http.post<Rol>(this.baseUrl + '/roles/update.php', rol);
    }

    actualizar() {
        this.rolesSubject.next();
    }

}

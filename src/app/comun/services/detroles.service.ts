import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { DetRol, DetRolResponse, Document, Search } from '../interfaces/detroles.interface';


@Injectable({
    providedIn: 'root'
})
export class DetRolesService {




    detrolesSubject = new Subject();
    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }


    getDetRol(pagina: number = 0, tampagina: number = 10): Observable<DetRol[]> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }

        //coleccion de Funcionarios

        return this.http.get<respuesta<DetRol>>(this.baseUrl + '/det_roles/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }


    getDetRoles(pagina: number = 0, tampagina: number = 10, tipo: string = ''): Observable<Document> {
        //Parametros

        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }
        return this.http.get<DetRolResponse>(this.baseUrl + '/det_roles/read.php', { params: params })
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

        return this.http.post<DetRolResponse>(this.baseUrl + '/det_roles/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }


    create(detrol: DetRol) {
        detrol.estado = 0;
        return this.http.post<DetRol>(this.baseUrl + '/det_roles/create.php', detrol)
    }

    delete(detrol: DetRol) {
        return this.http.post<DetRol>(this.baseUrl + '/det_roles/delete.php', detrol);
    }

    update(detrol: DetRol) {
        detrol.estado = 0;
        return this.http.post<DetRol>(this.baseUrl + '/det_roles/update.php', detrol);
    }

    actualizar() {
        this.detrolesSubject.next();
    }

}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Dueno, DuenoResponse, Document, Search } from '../interfaces/duenos.interface';


@Injectable({
    providedIn: 'root'
})
export class DuenosService {



    duenosSubject = new Subject();
    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }


    getDueno(pagina: number = 0, tampagina: number = 10): Observable<Dueno[]> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }


        //coleccion de Funcionarios

        return this.http.get<respuesta<Dueno>>(this.baseUrl + '/duenos/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }


    getDuenos(pagina: number = 0, tampagina: number = 10): Observable<Document> {
        //Parametros

        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }


        return this.http.get<DuenoResponse>(this.baseUrl + '/duenos/read.php', { params: params })
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

        return this.http.post<DuenoResponse>(this.baseUrl + '/duenos/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }

    getDuenoPorId(id: string): Observable<Dueno> {

        return this.http.get<Dueno>(this.baseUrl + '/duenos/' + id);
    }

    create(dueno: Dueno) {
        dueno.estado = 0;
        return this.http.post<Dueno>(this.baseUrl + '/duenos/create.php', dueno);
    }

    delete(dueno: Dueno) {
        return this.http.post<Dueno>(this.baseUrl + '/duenos/delete.php', dueno);
    }

    update(dueno: Dueno) {
        dueno.estado = 0;
        return this.http.post<Dueno>(this.baseUrl + '/duenos/update.php', dueno);
    }

    actualizar() {
        this.duenosSubject.next();
    }

}

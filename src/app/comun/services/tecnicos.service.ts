import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Tecnico, TecnicoResponse, Document, Search } from '../interfaces/tecnicos.interface';


@Injectable({
    providedIn: 'root'
})
export class TecnicosService {



    tecnicosSubject = new Subject();
    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }


    getTecnico(pagina: number = 0, tampagina: number = 10): Observable<Tecnico[]> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }


        //coleccion de Funcionarios

        return this.http.get<respuesta<Tecnico>>(this.baseUrl + '/tecnicos/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }


    getTecnicos(pagina: number = 0, tampagina: number = 10): Observable<Document> {
        //Parametros

        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }


        return this.http.get<TecnicoResponse>(this.baseUrl + '/tecnicos/read.php', { params: params })
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

        return this.http.post<TecnicoResponse>(this.baseUrl + '/tecnicos/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }

    getTecnicoPorId(id: string): Observable<Tecnico> {

        return this.http.get<Tecnico>(this.baseUrl + '/tecnicos/' + id);
    }

    create(tecnico: Tecnico) {
        tecnico.estado = 0;
        return this.http.post<Tecnico>(this.baseUrl + '/tecnicos/create.php', tecnico);
    }

    delete(tecnico: Tecnico) {
        return this.http.post<Tecnico>(this.baseUrl + '/tecnicos/delete.php', tecnico);
    }

    update(tecnico: Tecnico) {
        tecnico.estado = 0;
        return this.http.post<Tecnico>(this.baseUrl + '/tecnicos/update.php', tecnico);
    }

    actualizar() {
        this.tecnicosSubject.next();
    }

}

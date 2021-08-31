import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Inmueble, InmuebleResponse, Document, Search } from '../interfaces/inmuebles.interface';


@Injectable({
    providedIn: 'root'
})
export class InmueblesService {



    inmueblesSubject = new Subject();
    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }


    getInmueble(pagina: number = 0, tampagina: number = 10): Observable<Inmueble[]> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }


        //coleccion de Funcionarios

        return this.http.get<respuesta<Inmueble>>(this.baseUrl + '/inmuebles/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }


    getInmuebles(pagina: number = 0, tampagina: number = 10, tipo: string = ''): Observable<Document> {
        //Parametros

        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }
        params = params.append('tipo', tipo);


        return this.http.get<InmuebleResponse>(this.baseUrl + '/inmuebles/read.php', { params: params })
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

        return this.http.post<InmuebleResponse>(this.baseUrl + '/inmuebles/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }

    getInmueblePorId(id: string): Observable<Inmueble> {

        return this.http.get<Inmueble>(this.baseUrl + '/inmuebles/' + id);
    }

    create(inmueble: Inmueble) {
        inmueble.estado = 0;
        console.log(inmueble);
        return this.http.post<Inmueble>(this.baseUrl + '/inmuebles/create.php', inmueble);
    }

    delete(inmueble: Inmueble) {
        return this.http.post<Inmueble>(this.baseUrl + '/inmuebles/delete.php', inmueble);
    }

    update(inmueble: Inmueble) {
        inmueble.estado = 0;
        return this.http.post<Inmueble>(this.baseUrl + '/inmuebles/update.php', inmueble);
    }

    actualizar() {
        this.inmueblesSubject.next();
    }


}

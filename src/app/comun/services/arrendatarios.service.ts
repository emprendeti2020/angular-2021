import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Arrendatario, ArrendatarioResponse, Document, Search } from '../interfaces/arrendatarios.interface';


@Injectable({
    providedIn: 'root'
})
export class ArrendatariosService {




    arrendatariosSubject = new Subject();
    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }


    getArrendatario(pagina: number = 0, tampagina: number = 10): Observable<Arrendatario[]> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }

        //coleccion de Funcionarios

        return this.http.get<respuesta<Arrendatario>>(this.baseUrl + '/arrendatarios/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }


    getArrendatarios(pagina: number = 0, tampagina: number = 10, tipo: string = '', idarrendatario: number = 0): Observable<Document> {
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
        params = params.append('idarrendatario', idarrendatario);


        return this.http.get<ArrendatarioResponse>(this.baseUrl + '/arrendatarios/read.php', { params: params })
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

        return this.http.post<ArrendatarioResponse>(this.baseUrl + '/arrendatarios/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }

    getArrendatarioPorId(id: string): Observable<Arrendatario> {
        console.log(id);
        return this.http.get<Arrendatario>(this.baseUrl + '/arrendatarios/' + id);
    }

    create(arrendatario: Arrendatario) {
        arrendatario.estado = 0;
        return this.http.post<Arrendatario>(this.baseUrl + '/arrendatarios/create.php', arrendatario);
    }

    delete(arrendatario: Arrendatario) {
        return this.http.post<Arrendatario>(this.baseUrl + '/arrendatarios/delete.php', arrendatario);
    }

    update(arrendatario: Arrendatario) {
        arrendatario.estado = 0;
        return this.http.post<Arrendatario>(this.baseUrl + '/arrendatarios/update.php', arrendatario);
    }

    actualizar() {
        this.arrendatariosSubject.next();
    }


}

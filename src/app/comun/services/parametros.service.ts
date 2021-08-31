import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Parametro, ParametroResponse, Document, Search } from '../interfaces/parametros.interface';


@Injectable({
    providedIn: 'root'
})
export class ParametrosService {



    parametrosSubject = new Subject();
    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    private _prioridad!: Parametro;
    private tipoInmueble!: Document;
    private estadoIncidente!: Document;
    private tipoIncidente!: Document;



    constructor(private http: HttpClient) {
    }


    getParametro(pagina: number = 0, tampagina: number = 10): Observable<Parametro[]> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }


        //coleccion de Funcionarios

        return this.http.get<respuesta<Parametro>>(this.baseUrl + '/parametros/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }


    getParametros(pagina: number = 0, tampagina: number = 10): Observable<Document> {
        //Parametros

        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }


        return this.http.get<ParametroResponse>(this.baseUrl + '/parametros/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document)
            );
    }

    get getTipoInmueble(): Document {
        return this.tipoInmueble;
    }

    get getestadoIncidente(): Document {
        return this.estadoIncidente;
    }

    get gettipoIncidente(): Document {
        return this.tipoIncidente;
    }

    getParametroStandard(key: string, keyvalue: string, pagina: number = 0, tampagina: number = 10): Observable<Document> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }

        this.search.push({ columnName: key, columnLogic: "=", columnValue: keyvalue });
        const body = this.search
        return this.http.post<ParametroResponse>(this.baseUrl + '/parametros/search_by_column.php', body, { params: params })
            .pipe(
                map(respuesta => respuesta.document),
                tap(respuesta => {
                    switch (key) {
                        case 'tinmueble':
                            this.tipoInmueble = respuesta
                            break;
                        case 'estadoincidente':
                            this.estadoIncidente = respuesta;
                            break;
                        case 'tipoincidente':
                            this.estadoIncidente = respuesta;
                            break;
                        default:
                            break;
                    }
                }
                )
            );
    }


    getParametroporValor(key: string, keyvalue: string, pagina: number = 0, tampagina: number = 10): Observable<Document> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }

        this.search.push({ columnName: key, columnLogic: "=", columnValue: keyvalue });
        const body = this.search

        if (key == 'param' && keyvalue == 'tinmueble') {
            if (!this.tipoInmueble) {
                return this.http.post<ParametroResponse>(this.baseUrl + '/parametros/search_by_column.php', body, { params: params })

                    .pipe(
                        map(respuesta => respuesta.document),
                        tap(respuesta => (this.tipoInmueble = respuesta))
                    );
            }
            else {
                return of(this.tipoInmueble)
            }
        }

        return this.http.post<ParametroResponse>(this.baseUrl + '/parametros/search_by_column.php', body, { params: params })
            .pipe(
                map(respuesta => respuesta.document)
            );
    }


    //coleccion de Funcionarios

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

        return this.http.post<ParametroResponse>(this.baseUrl + '/parametros/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }

    getParametroPorId(id: string): Observable<Parametro> {

        return this.http.get<Parametro>(this.baseUrl + '/parametros/' + id);
    }

    create(parametro: Parametro) {
        parametro.estado = 0;
        console.log(parametro);
        return this.http.post<Parametro>(this.baseUrl + '/parametros/create.php', parametro);
    }

    delete(parametro: Parametro) {
        console.log(parametro);
        //return this.http.post<any>(this.baseUrl + '/parametros/delete.php', parametro);
        return this.http.post<Parametro>(this.baseUrl + '/parametros/delete.php', parametro);
    }

    update(parametro: Parametro) {
        parametro.estado = 0;
        return this.http.post<Parametro>(this.baseUrl + '/parametros/update.php', parametro);
    }

    actualizar() {
        this.parametrosSubject.next();
    }


}

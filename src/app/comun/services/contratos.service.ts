import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Contrato, ContratoResponse, Document, Search } from '../interfaces/contratos.interface';


@Injectable({
    providedIn: 'root'
})
export class ContratosService {



    contratosSubject = new Subject();

    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }


    getContrato(pagina: number = 0, tampagina: number = 10): Observable<Contrato[]> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }


        //coleccion de Funcionarios

        return this.http.get<respuesta<Contrato>>(this.baseUrl + '/contratos/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }


    getContratos(pagina: number = 0, tampagina: number = 10): Observable<Document> {
        //Parametros

        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }


        return this.http.get<ContratoResponse>(this.baseUrl + '/contratos/read.php', { params: params })
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

        return this.http.post<ContratoResponse>(this.baseUrl + '/contratos/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }

    getContratoPorId(id: string): Observable<Contrato> {

        return this.http.get<Contrato>(this.baseUrl + '/contratos/' + id);
    }

    create(contrato: Contrato) {
        contrato.estado = 0;
        return this.http.post<Contrato>(this.baseUrl + '/contratos/create.php', contrato);
    }

    delete(contrato: Contrato) {
        return this.http.post<Contrato>(this.baseUrl + '/contratos/delete.php', contrato);
    }

    update(contrato: Contrato) {
        contrato.estado = 0;
        return this.http.post<Contrato>(this.baseUrl + '/contratos/update.php', contrato);
    }

    actualizar() {
        this.contratosSubject.next();
    }

}

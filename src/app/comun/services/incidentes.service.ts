import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Incidente, IncidenteResponse, Document, Search } from '../interfaces/incidentes.interface';


@Injectable({
    providedIn: 'root'
})
export class IncidentesService {



    incidentesSubject = new Subject();

    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }


    getIncidente(pagina: number = 0, tampagina: number = 10): Observable<Incidente[]> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }

        //coleccion de Funcionarios

        return this.http.get<respuesta<Incidente>>(this.baseUrl + '/incidentes/read.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }


    getIncidentes(pagina: number = 0, tampagina: number = 10, tipo: string = '', estadoincidente: string = 'Abierto'): Observable<Document> {
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
        params = params.append('estadoincidente', estadoincidente);


        return this.http.get<IncidenteResponse>(this.baseUrl + '/incidentes/read.php', { params: params })
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

        return this.http.post<IncidenteResponse>(this.baseUrl + '/incidentes/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }

    getArrendatarioPorId(id: string): Observable<Incidente> {

        return this.http.get<Incidente>(this.baseUrl + '/incidentes/' + id);
    }

    create(incidente: Incidente) {
        incidente.estado = 0;
        return this.http.post<Incidente>(this.baseUrl + '/incidentes/create.php', incidente);
    }

    delete(incidente: Incidente) {
        return this.http.post<Incidente>(this.baseUrl + '/incidentes/delete.php', incidente);
    }

    update(incidente: Incidente) {
        incidente.estado = 0;
        return this.http.post<Incidente>(this.baseUrl + '/incidentes/update.php', incidente);
    }


    actualizar() {
        this.incidentesSubject.next();
    }

}

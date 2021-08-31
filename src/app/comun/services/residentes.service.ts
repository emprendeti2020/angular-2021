import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Residente, ResidenteResponse, Document, Search  } from '../interfaces/residentes.interface';



@Injectable({
    providedIn: 'root'
})
export class ResidentesService {

 
 

    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }

 
    getResidente(pagina:number=0, tampagina:number=10): Observable<Residente[]> {
      //Parametros
      let params = new HttpParams();
      pagina++;
      //si me envía -1, traigo todos los valores
      if(pagina!=0)
      {            
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());        
      }


        //coleccion de Funcionarios

        return this.http.get<respuesta<Residente>>(this.baseUrl + '/residentes/read.php', {params: params})
                        .pipe(
                            map(respuesta => respuesta.document.records)
                        );
    }


    getResidentes(pagina:number=0, tampagina:number=10): Observable<Document> {
        //Parametros
  
        //Parametros
        let params = new HttpParams();
        pagina++;
        if(pagina!=0)
        {            
              params = params.append('pageno', pagina.toString());
              params = params.append('pagesize', tampagina.toString());        
        }


        return this.http.get<ResidenteResponse>(this.baseUrl + '/residentes/read.php', {params: params})
            .pipe(
            map(respuesta => respuesta.document)
            );
    }    


    getKey(key:string, keyvalue:string,pagina:number=0, tampagina:number=10): Observable<boolean> {
               
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if(pagina!=0)
        {            
              params = params.append('pageno', pagina.toString());
              params = params.append('pagesize', tampagina.toString());    
              params = params.append('orAnd', 'AND');    
        }
        this.search.push({columnName:key, columnLogic:"=", columnValue:keyvalue});
        const body = this.search

        return  this.http.post<ResidenteResponse>(this.baseUrl + '/residentes/search_by_column.php', body, {  params: params} )
                .pipe (            
                map ( resp => {                
                    if (resp.status==='success')
                        return true;
                    else
                        return false;
                }));

    }        
 
    getResidentePorId(id: string): Observable<Residente> {
        
        return this.http.get<Residente>(this.baseUrl + '/residentes/' + id);
    }

    create(residente: Residente) {
        residente.estado=0;
        return this.http.post<Residente>(this.baseUrl + '/residentes/create.php',residente);
    }

    delete(residente: Residente ) {
        return this.http.post<any>(this.baseUrl + '/residentes/delete.php', residente);
    }

    update(residente: Residente) {
       residente.estado = 0;
       return this.http.post<Residente>(this.baseUrl + '/residentes/update.php',residente);
    }



}

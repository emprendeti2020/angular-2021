import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Eecc, EeccResponse, Document, Search  } from '../interfaces/eeccs.interface';



@Injectable({
    providedIn: 'root'
})
export class EeccsService {

 
 

    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }

 
    getEecc(pagina:number=0, tampagina:number=10): Observable<Eecc[]> {
      //Parametros
      let params = new HttpParams();
      pagina++;
      //si me envía -1, traigo todos los valores
      if(pagina!=0)
      {            
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());        
      }



        return this.http.get<respuesta<Eecc>>(this.baseUrl + '/eeccs/read.php', {params: params})
                        .pipe(
                            map(respuesta => respuesta.document.records)
                        );
    }


    getEeccs(pagina:number=0, tampagina:number=10): Observable<Document> {
        //Parametros
  
        //Parametros
        let params = new HttpParams();
        pagina++;
        if(pagina!=0)
        {            
              params = params.append('pageno', pagina.toString());
              params = params.append('pagesize', tampagina.toString());        
        }


        return this.http.get<EeccResponse>(this.baseUrl + '/eeccs/read.php', {params: params})
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

        return  this.http.post<EeccResponse>(this.baseUrl + '/eeccs/search_by_column.php', body, {  params: params} )
                .pipe (            
                map ( resp => {                
                    if (resp.status==='success')
                        return true;
                    else
                        return false;
                }));

    }        
 
    getEeccPorId(id: string): Observable<Eecc> {
        
        return this.http.get<Eecc>(this.baseUrl + '/eeccs/' + id);
    }

    create(eecc: Eecc) {
        eecc.estado=0;
        eecc.id_comunidad = 1;
        return this.http.post<Eecc>(this.baseUrl + '/eeccs/create.php',eecc);
    }

    delete(eecc: Eecc ) {        
        return this.http.post<any>(this.baseUrl + '/eeccs/delete.php', eecc);
    }

    update(eecc: Eecc) {
        eecc.estado = 0;
        eecc.id_comunidad = 1;
       return this.http.post<Eecc>(this.baseUrl + '/eeccs/update.php',eecc);
    }



}

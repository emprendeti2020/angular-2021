import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Bitacora, BitacoraResponse, Document, Search  } from '../interfaces/bitacoras.interface';



@Injectable({
    providedIn: 'root'
})
export class BitacorasService {

 
 

    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }

 
    getBitacora(pagina:number=0, tampagina:number=10): Observable<Bitacora[]> {
      //Parametros
      let params = new HttpParams();
      pagina++;
      //si me envía -1, traigo todos los valores
      if(pagina!=0)
      {            
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());        
      }



        return this.http.get<respuesta<Bitacora>>(this.baseUrl + '/bitacoras/read.php', {params: params})
                        .pipe(
                            map(respuesta => respuesta.document.records)
                        );
    }


    getBitacoras(pagina:number=0, tampagina:number=10): Observable<Document> {
        //Parametros
  
        //Parametros
        let params = new HttpParams();
        pagina++;
        if(pagina!=0)
        {            
              params = params.append('pageno', pagina.toString());
              params = params.append('pagesize', tampagina.toString());        
        }


        return this.http.get<BitacoraResponse>(this.baseUrl + '/bitacoras/read.php', {params: params})
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

        return  this.http.post<BitacoraResponse>(this.baseUrl + '/bitacoras/search_by_column.php', body, {  params: params} )
                .pipe (            
                map ( resp => {                
                    if (resp.status==='success')
                        return true;
                    else
                        return false;
                }));

    }        
 
    getBitacoraPorId(id: string): Observable<Bitacora> {
        
        return this.http.get<Bitacora>(this.baseUrl + '/bitacoras/' + id);
    }

    create(bitacora: Bitacora) {
        bitacora.estado=0;
        return this.http.post<Bitacora>(this.baseUrl + '/bitacoras/create.php',bitacora);
    }

    delete(bitacora: Bitacora ) {
        return this.http.post<any>(this.baseUrl + '/bitacoras/delete.php', bitacora);
    }

    update(bitacora: Bitacora) {
       bitacora.estado = 0;
       return this.http.post<Bitacora>(this.baseUrl + '/bitacoras/update.php',bitacora);
    }



}

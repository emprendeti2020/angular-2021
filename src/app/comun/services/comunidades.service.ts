import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Comunidad, ComunidadResponse, Document, Search  } from '../interfaces/comunidades.interface';



@Injectable({
    providedIn: 'root'
})
export class ComunidadesService {

 
 

    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }

 
    getComunidad(pagina:number=0, tampagina:number=10): Observable<Comunidad[]> {
      //Parametros
      let params = new HttpParams();
      pagina++;
      //si me envía -1, traigo todos los valores
      if(pagina!=0)
      {            
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());        
      }



        return this.http.get<respuesta<Comunidad>>(this.baseUrl + '/comunidades/read.php', {params: params})
                        .pipe(
                            map(respuesta => respuesta.document.records)
                        );
    }


    getComunidades(pagina:number=0, tampagina:number=10): Observable<Document> {
        //Parametros
  
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if(pagina!=0)
        {            
              params = params.append('pageno', pagina.toString());
              params = params.append('pagesize', tampagina.toString());        
        }


        return this.http.get<ComunidadResponse>(this.baseUrl + '/comunidades/read.php', {params: params})
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

        return  this.http.post<ComunidadResponse>(this.baseUrl + '/comunidades/search_by_column.php', body, {  params: params} )
                .pipe (            
                map ( resp => {                
                    if (resp.status==='success')
                        return true;
                    else
                        return false;
                }));

    }        
 
    getComunidadPorId(id: string): Observable<Comunidad> {
        
        return this.http.get<Comunidad>(this.baseUrl + '/comunidades/' + id);
    }

    create(comunidad: Comunidad) {
        comunidad.estado=0;
        return this.http.post<Comunidad>(this.baseUrl + '/comunidades/create.php',comunidad);
    }

    delete(comunidad: Comunidad ) {
        console.log(comunidad);
        return this.http.post<any>(this.baseUrl + '/comunidades/delete.php', comunidad);
    }

    update(comunidad: Comunidad) {
       comunidad.estado = 0;
       return this.http.post<Comunidad>(this.baseUrl + '/comunidades/update.php',comunidad);
    }



}

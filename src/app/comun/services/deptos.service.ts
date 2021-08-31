import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Depto, DeptoResponse, Document, Search  } from '../interfaces/deptos.interface';



@Injectable({
    providedIn: 'root'
})
export class DeptosService {

 
 

    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];

    constructor(private http: HttpClient) {
    }

 
    getDepto(pagina:number=0, tampagina:number=10): Observable<Depto[]> {
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

        return this.http.get<respuesta<Depto>>(this.baseUrl + '/deptos/read.php', {params: params})
                        .pipe(
                            map(respuesta => respuesta.document.records)
                        );
    }


    getDeptos(pagina:number=0, tampagina:number=10): Observable<Document> {
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


        return this.http.get<DeptoResponse>(this.baseUrl + '/deptos/read.php', {params: params})
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

        return  this.http.post<DeptoResponse>(this.baseUrl + '/deptos/search_by_column.php', body, {  params: params} )
                .pipe (            
                map ( resp => {                
                    if (resp.status==='success')
                        return true;
                    else
                        return false;
                }));

    }        
 
    getDeptoPorId(id: string): Observable<Depto> {
        
        return this.http.get<Depto>(this.baseUrl + '/deptos/' + id);
    }

    create(depto: Depto) {
        depto.id_comunidad=1;
        depto.estado=0;
        console.log(depto);
        return this.http.post<Depto>(this.baseUrl + '/deptos/create.php',depto);
    }

    delete(depto: Depto ) {
        return this.http.post<any>(this.baseUrl + '/deptos/delete.php', depto);
    }

    update(depto: Depto) {
       depto.estado = 0;
       depto.id_comunidad=1;
       console.log(depto);
       return this.http.post<Depto>(this.baseUrl + '/deptos/update.php',depto);
    }



}

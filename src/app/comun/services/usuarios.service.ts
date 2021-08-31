import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { respuesta } from '../interfaces/apisoporte.interface';
import { Usuario, UsuarioResponse, Document, Search } from '../interfaces/usuarios.interface';


@Injectable({
    providedIn: 'root'
})
export class UsuariosService {




    usuariosSubject = new Subject();
    private baseUrl: string = environment.baseUrl;
    private search: Search[] = [];
    private Usuario!: Document;


    constructor(private http: HttpClient) {
    }

    get getUsuarioIn(): Document {
        return this.Usuario;
    }

    getLogin(email: string, password: string): Observable<Usuario[]> {
        //Parametros
        let params = new HttpParams();

        //coleccion de Funcionarios
        params = params.append('email', email);
        params = params.append('password', password);


        return this.http.get<respuesta<Usuario>>(this.baseUrl + '/usuarios/read_one.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document.records)
            );
    }

    getUsuario(pagina: number = 0, tampagina: number = 10): Observable<Document> {
        //Parametros
        let params = new HttpParams();
        pagina++;
        //si me envía -1, traigo todos los valores
        if (pagina != 0) {
            params = params.append('pageno', pagina.toString());
            params = params.append('pagesize', tampagina.toString());
        }

        //coleccion de Funcionarios

        return this.http.post<UsuarioResponse>(this.baseUrl + '/usuarios/read_one.php', { params: params })
            .pipe(
                map(respuesta => respuesta.document),
                tap(respuesta => {
                    this.Usuario = respuesta;


                }
                )
            );
    }


    getUsuarios(pagina: number = 0, tampagina: number = 10, tipo: string = ''): Observable<Document> {
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


        return this.http.get<UsuarioResponse>(this.baseUrl + '/usuarios/read.php', { params: params })
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

        return this.http.post<UsuarioResponse>(this.baseUrl + '/usuarios/search_by_column.php', body, { params: params })
            .pipe(
                map(resp => {
                    if (resp.status === 'success')
                        return true;
                    else
                        return false;
                }));

    }

    getUsuarioPorId(id: string): Observable<Usuario> {

        return this.http.get<Usuario>(this.baseUrl + '/usuarios/' + id);
    }

    create(usuario: Usuario) {
        usuario.estado = 0;
        return this.http.post<Usuario>(this.baseUrl + '/usuarios/create.php', usuario)
    }

    delete(usuario: Usuario) {
        return this.http.post<Usuario>(this.baseUrl + '/usuarios/delete.php', usuario);
    }

    update(usuario: Usuario) {
        usuario.estado = 0;
        return this.http.post<Usuario>(this.baseUrl + '/usuarios/update.php', usuario);
    }

    actualizar() {
        this.usuariosSubject.next();
    }

}

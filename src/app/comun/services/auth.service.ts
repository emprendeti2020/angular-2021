import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;  
  private ldap: number =  environment.ldap;
  private _auth: Usuario | undefined;
  private _usuario: Usuario | undefined;
  
  constructor(private http: HttpClient) { }

  public get auth() {    
    return { ...this._auth!}
  }

  public get AuthUsuario():Usuario {

     return this._usuario!;
  }


  login(usuario:string = '', email: string = '', password: string): Observable<boolean>  {
    const ldap = this.ldap;
    if(ldap===1)
      email = usuario;

    const bodyusuario = {usuario, email, password,ldap};    
    //console.log(bodyusuario);
     
     return  this.http.post<AuthResponse>(`${ this.baseUrl }/usuarios/read_one.php`,bodyusuario)
            .pipe (            
              map ( resp => {                
                if (resp.status==='success')
                   localStorage.setItem('token',resp.document.token.access_token);
                   this._usuario = {
                      id: resp.document.id,
                      nombre: resp.document.nombre,
                      email: resp.document.email,
                      usuario: resp.document.usuario,
                      password: '',
                      tipo: resp.document.tipo,
                      estado: resp.document.estado
                  }
                   return true;
              }),
              //of(false)
              catchError(() =>  of(false))            
            )     
 
 
  }

  logout() {
    this._auth = undefined;
    localStorage.removeItem('token');
    
  }

  validarToken():Observable<boolean> {
      //v = 1 validar token & regenerar token
      //v = 0 validar token
      return  this.http.get<AuthResponse>(`${ this.baseUrl }/token/validatetoken.php?v=1`)
      .pipe (            
        map ( resp => {                
          if (resp.status==='success')
              localStorage.setItem('token',resp.document.token.access_token);
              return true;
        }),
        //of(false)
        catchError(() =>  of(false))            
  )     



  }

}
 
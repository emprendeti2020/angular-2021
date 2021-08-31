import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuariosService, UsuarioValidatorService } from 'src/app/comun/packs/usuario';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private usuarios: Usuario[] = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public form: FormGroup = Object.create(null);
  constructor(private fb: FormBuilder, private router: Router, private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit(): void {
    //this.router.navigate(['/dashboards/dashboard1']);
    this.validaUsuario();
  }

  validaUsuario() {
    //ESTADO DEL INCIDENTE
    let usuariovalido: boolean = false;
    const usuario: Usuario = this.form.value;

    if (this.usuariosService.getUsuarioIn == undefined) {
      this.usuariosService.getLogin(usuario.email, usuario.password)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(respuesta => {
          usuariovalido = true;
          this.usuarios = respuesta;
          if (respuesta == undefined) {
            this.form.get('password')!.setValue('');
            this.form.markAllAsTouched();
          }
          else {
            usuariovalido = true;
            console.log(this.usuarios[0]);
            localStorage.setItem('token', this.usuarios[0].access_token!);
            this.router.navigate(['/operaciones']);
          }
        });
    }
    //ESTADO DEL INCIDENTE    
  }
}

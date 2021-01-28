import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html'
})
export class ListadoComponent implements OnInit {

  heroes: string[] = ['Spider','Hulk','Gok', 'Superman'];
  hborrado: string = '';

  constructor() {
    console.log('constructor');
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  borrarHeroe() {
    console.log('Borrando...');
    //this.heroes.splice((this.heroes.length-1),1);
    this.hborrado = this.heroes.shift() || '';

  }

  generarHeroe(){
    this.heroes= ['Spider','Hulk','Gok', 'Superman'];
    this.hborrado = '';
  }

}

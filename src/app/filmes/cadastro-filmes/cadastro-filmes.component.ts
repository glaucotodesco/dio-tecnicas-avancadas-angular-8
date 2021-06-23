import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { allowedNodeEnvironmentFlags } from 'process';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.cadastro = this.fb.group({
        titulo:  ['', [Validators.required,Validators.minLength(2), Validators.maxLength(256)]],
        urlFoto: ['', [Validators.minLength(10)]],
        dtLancamento: ['',[Validators.required]],
        descricao: [''],
        nota: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
        urlIMDb: ['', [Validators.minLength(10)]],
        genero: ['', [Validators.required]]
    });

  }

  reinicarForm(): void {
    this.cadastro.reset;
  }

  salvar(): void {
    if(this.cadastro.invalid){
      alert('Invalido\n' );
      return;
    }
    else{
      alert('Sucesso\n ' + JSON.stringify(this.cadastro.value, null,4));
    }
  }

}

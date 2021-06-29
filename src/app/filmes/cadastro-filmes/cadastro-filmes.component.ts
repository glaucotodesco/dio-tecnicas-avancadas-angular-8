import { Alerta } from './../../shared/models/alerta';
import { AlertaComponent } from './../../shared/components/alerta/alerta.component';
import { FilmesService } from './../../core/filmes.service';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { allowedNodeEnvironmentFlags } from 'process';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Filme } from 'src/app/shared/models/filme';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos : Array<string>;


  constructor(public validacao: ValidarCamposService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private filmeService: FilmesService,
              private router: Router
              ) { }

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

    this.generos = ['Ação', 'Romance', 'Aventura','Terror', 'Ficção Científica','Comédia','Drama'];
  }

  reiniciarForm(): void {
    this.cadastro.reset();
  }

  submit(): void {
    this.cadastro.markAllAsTouched();
    if(this.cadastro.invalid){
      return;
    }
    else{
       const filme = this.cadastro.getRawValue() as Filme;
       this.salvar(filme);
    }
  }

  get f(){
    return this.cadastro.controls;
  }

  private salvar(filme : Filme): void {
     this.filmeService.salvar(filme).subscribe( () => {
      const config = {
        data: {
          btnSucesso: 'Ir para a listagem',
          btnCancelar: 'Cadastar um novo filme',
          corBtnCancelar: 'primary',
          possuirBtnFechar: true,


        } as Alerta
      };

      const dialogRef = this.dialog.open(AlertaComponent, config);

      dialogRef.afterClosed().subscribe((opcao: boolean) => {
        if(opcao){
          this.router.navigateByUrl('filmes');
        }
        else{
          this.reiniciarForm();
        }
      })

     },
     () => {
      const config = {
        data: {
          btnSucesso: 'Fechar',
          titulo: 'Erro ao salvar o registro',
          descricao: 'Não foi possível salvar o registro',
          corBtnSucesso: 'warn'
        } as Alerta
      };

      this.dialog.open(AlertaComponent, config);
     }

     );
  }


}

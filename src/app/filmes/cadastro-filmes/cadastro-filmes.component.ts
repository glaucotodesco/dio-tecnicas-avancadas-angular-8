import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerta } from './../../shared/models/alerta';
import { AlertaComponent } from './../../shared/components/alerta/alerta.component';
import { FilmesService } from './../../core/filmes.service';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Filme } from './../../shared/models/filme';


@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos: Array<string>;
  id: number;


  constructor(public validacao: ValidarCamposService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private filmeService: FilmesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.generos = ['Ação', 'Romance', 'Aventura', 'Terror', 'Ficção Científica', 'Comédia', 'Drama'];

    this.id = this.activatedRoute.snapshot.params['id'];

    if (this.id) {
      this.filmeService.visualizar(this.id).subscribe((filme: Filme) => this.criarFormulario(filme));
    }
    else {
      this.criarFormulario({} as Filme);
    }
  }

  reiniciarForm(): void {
    this.cadastro.reset();
  }

  submit(): void {
    this.cadastro.markAllAsTouched();
    if (this.cadastro.invalid) {
      return;
    }
    else {
      const filme = this.cadastro.getRawValue() as Filme;
      if (this.id) {
        filme.id = this.id;
        this.editar(filme);
      }
      else {
        this.salvar(filme);
      }

    }
  }

  get f() {
    return this.cadastro.controls;
  }

  private salvar(filme: Filme): void {
    this.filmeService.salvar(filme).subscribe(() => {
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
        if (opcao) {
          this.router.navigateByUrl('filmes');
        }
        else {
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

  private editar(filme: Filme): void {
    this.filmeService.editar(filme).subscribe(() => {
      const config = {
        data: {
          descricao: 'Seu registro foi atualizado com sucesso',
          btnSucesso: 'Ir para a listagem',
        } as Alerta
      };

      const dialogRef = this.dialog.open(AlertaComponent, config);

      dialogRef.afterClosed().subscribe((opcao: boolean) => { this.router.navigateByUrl('filmes'); })

    },
      () => {
        const config = {
          data: {
            btnSucesso: 'Fechar',
            titulo: 'Erro ao editar o registro',
            descricao: 'Não foi possível editar o registro',
            corBtnSucesso: 'warn'
          } as Alerta
        };

        this.dialog.open(AlertaComponent, config);
      }

    );
  }


  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]
    });
  }

}

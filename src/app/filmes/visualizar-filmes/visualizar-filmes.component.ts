import { FilmesService } from './../../core/filmes.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filme } from 'src/app/shared/models/filme';
import { Alerta } from 'src/app/shared/models/alerta';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dio-visualizar-filmes',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.scss']
})
export class VisualizarFilmesComponent implements OnInit {

  readonly semFoto = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
  id: number;
  filme: Filme;

  constructor( public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private filmesService: FilmesService,
              private router: Router
              ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.visualizar();
  }

  private visualizar(): void {
      this.filmesService.visualizar(this.id).subscribe((filme: Filme) => this.filme = filme);
  }

  excluir(): void {
    const config = {
      data: {
        titulo: 'Você tem certeza que deseja excluir',
        descricao: 'Se sim, click no botão OK',
        corBtnCancelar: 'primary',
        corBtnSucesso: 'warn',
        possuirBtnFechar: true,
      } as Alerta
    };

    const dialogRef = this.dialog.open(AlertaComponent, config);

    dialogRef.afterClosed().subscribe((opcao: boolean) => {
      if(opcao){
        this.filmesService.excluir(this.id).subscribe(() => this.router.navigateByUrl('/filmes'));
      }
    })
  }

  editar():void{
    this.router.navigateByUrl('/filmes/cadastro/'+this.id);
  }

}

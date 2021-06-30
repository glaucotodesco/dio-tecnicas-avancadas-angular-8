import { Router } from '@angular/router';
import { ConfigParams } from './../../shared/models/config-params';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { FilmesService } from './../../core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {

  readonly semFoto = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
  readonly qtdPagina = 4;
  filmes: Filme[] = [];

  config: ConfigParams = {
    pagina: 0,
    limite: 4
  };

  pagina = 0;
  filtrosListagem: FormGroup;
  generos: Array<string>;
  texto: string;
  genero: string;


  constructor(private filmesService: FilmesService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.filtrosListagem = this.fb.group(
      {
        texto: [''],
        genero: ['']
      }
    );


    this.filtrosListagem.get('texto').valueChanges.
      pipe(debounceTime(400)).
      subscribe((val: string) => {
        this.config.pesquisa = val;
        this.resetConsulta();
      });

    this.filtrosListagem.get('genero').valueChanges.
        pipe(debounceTime(400)).
        subscribe((val: string) => {
        this.config.campo = { tipo: 'genero', valor: val }
        this.resetConsulta();
      });


    this.generos = ['Ação', 'Romance', 'Aventura', 'Terror', 'Ficção Científica', 'Comédia', 'Drama'];
    this.listarFilmes();
  }

  onScroll(): void {
    this.listarFilmes();
    console.log('load...');
  }

  abrir(id:number): void{
    this.router.navigateByUrl('/filmes/cadastro/'+id);
  }

  private listarFilmes(): void {
    this.config.pagina++;
    this.filmesService.listar(this.config).subscribe((filmes: Filme[]) => this.filmes.push(...filmes));
  }

  private resetConsulta(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();

  }


}


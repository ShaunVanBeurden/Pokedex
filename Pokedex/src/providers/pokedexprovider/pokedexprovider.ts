import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the PokedexproviderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PokedexproviderProvider {

  public pokemon : string;

  constructor(public http: HttpClient) {
  }

  // Haalt alle pokemons op
  public getPokemons(): Observable<any[]> {
    return this.http.get<any[]>('https://pokeapi.co/api/v2/pokemon/?limit=802');
  }

  // Haalt slechts 1 pokemon op
  public getPokemonDetails(): Observable<any[]> {
    return this.http.get<any[]>('https://pokeapi.co/api/v2/pokemon/' + this.pokemon);
  }
}

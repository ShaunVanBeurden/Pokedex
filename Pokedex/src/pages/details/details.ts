import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PokedexproviderProvider} from "../../providers/pokedexprovider/pokedexprovider";

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  private pokemonName : string;
  private height: number
  private weight: number
  private abilities: Array<{name: string}>;
  private stats: Array<{name: string, base_stat: number}>;
  private sprite: string

  constructor(public navCtrl: NavController, public navParams: NavParams, public pokedexprovider : PokedexproviderProvider) {
    this.pokemonName = navParams.get('name');
    pokedexprovider.pokemon = this.pokemonName;

    pokedexprovider.getPokemonDetails()
      .subscribe(result => {
        console.log(result['sprites']['front_default']);
        this.height = result['height'];
        this.weight = result['weight'];
        this.abilities = [];
        this.stats = [];
        for (var i = 0; i < result['abilities'].length; i++) {
          this.abilities.push({
            name: result['abilities'][i]['ability']['name'],
          });
        }
        for (var i = 0; i < result['stats'].length; i++) {
          this.stats.push({
            name: result['stats'][i]['stat']['name'],
            base_stat: result['stats'][i]['base_stat'],
          });
          this.sprite = result['sprites']['front_default'];
        }
      });
  }
}

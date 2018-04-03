import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PokedexproviderProvider} from "../../providers/pokedexprovider/pokedexprovider";
import {Storage} from "@ionic/storage";

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
  public height: number
  public weight: number
  private abilities: Array<{name: string}>;
  private stats: Array<{name: string, base_stat: number}>;
  public base64Image: string;
  public sprite: string

  constructor(public navCtrl: NavController, public navParams: NavParams, public pokedexprovider : PokedexproviderProvider, private storage: Storage) {
    this.pokemonName = navParams.get('name');
    pokedexprovider.pokemon = this.pokemonName;

    // We halen een aantal details op van de aangeklikte pokemon
    pokedexprovider.getPokemonDetails()
      .subscribe(result => {
        this.height = result['height'];
        this.weight = result['weight'];
        this.abilities = [];
        this.stats = [];
        for (var i = 0; i < result['abilities'].length; i++) {
          this.abilities.push({
            name: result['abilities'][i]['ability']['name'],
          });
        }
        for (var j = 0; j < result['stats'].length; j++) {
          this.stats.push({
            name: result['stats'][i]['stat']['name'],
            base_stat: result['stats'][i]['base_stat']
          });
        }
        this.sprite = result['sprites']['front_default'];
        this.storage.get(this.pokemonName).then((output) => {
          this.base64Image = output;
        });
      });
  }
}

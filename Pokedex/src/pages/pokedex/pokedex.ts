import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PokedexproviderProvider} from "../../providers/pokedexprovider/pokedexprovider";
import {DetailsPage} from "../details/details";

/**
 * Generated class for the PokedexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pokedex',
  templateUrl: 'pokedex.html',
})
export class PokedexPage {

  public selectedItem: any;
  public icons: string[];
  private pokemons = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public pokedexprovider : PokedexproviderProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('pokemon');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    pokedexprovider.getPokemons()
      .subscribe(result => {
        for (var i = 0; i < 50; i++) {
          this.pokemons.push(result['results'][i]['name']);
        }
      });
  }

  onInput(SearchedItem: any) {
    this.pokedexprovider.getPokemons()
      .subscribe(result => {
        this.pokemons = [];
        for (var i = 0; i < 802; i++) {
          if (result['results'][i]['name'].indexOf(SearchedItem.target.value.toLowerCase()) >= 0) {
            this.pokemons.push(result['results'][i]['name']);
          }
        }
      });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {

      this.pokedexprovider.getPokemons()
        .subscribe(result => {
          var oldAmount = this.pokemons.length;
          var newAmount = this.pokemons.length + 50;

          console.log(oldAmount);
          console.log(newAmount);
          for (var i = oldAmount ; i < newAmount; i++) {
            if (this.pokemons.length < 802) {
              this.pokemons.push(result['results'][i]['name']);
            }
          }
          console.log(result);
        });

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  itemTapped(selectedItem: any, selectedPokemon) {
    this.navCtrl.push(DetailsPage, {
      name: selectedPokemon
    });
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PokedexproviderProvider} from "../../providers/pokedexprovider/pokedexprovider";
import {DetailsPage} from "../details/details";
import { Storage } from '@ionic/storage';
import {letProto} from "rxjs/operator/let";

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
  private pokemons = [];
  private filters = [];
  private filter: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public pokedexprovider : PokedexproviderProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('pokemon');

    pokedexprovider.getPokemons()
      .subscribe(result => {
        for (var i = 0; i < 50; i++) {
          this.pokemons.push(result['results'][i]['name']);
        }
      });

    this.filters.push("All", "Caught", "Uncaught");
  }

  onInput(SearchedItem: any) {
    this.pokedexprovider.getPokemons()
      .subscribe(result => {
        this.pokemons = [];
        for (var i = 0; i < 50; i++) {
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

  filterPokemon() {
    if (this.filter == "Caught") {
      this.pokemons = [];
      this.pokedexprovider.getPokemons()
        .subscribe(result => {
          this.storage.get(this.filter).then((output) => {
            for (var i = 0; i < output.length; i++) {
              console.log(output[i]);
              for (var j = 0; j < 802; j++) {
                if (result['results'][j]['name'] == output[i]) {
                  this.pokemons.push(result['results'][j]['name']);
                }
              }
            }
          });
        });
    }
    else if (this.filter == "Uncaught") {
      this.pokemons = [];
      this.pokedexprovider.getPokemons()
        .subscribe(result => {
          for (var i = 0; i < 802; i++) {
            this.pokemons.push(result['results'][i]['name']);
          }
          this.storage.get("Caught").then((output) => {
            for (var i = 0; i < output.length; i++) {
              var index = this.pokemons.indexOf(output[i]);
              if (index > -1) {
                this.pokemons.splice(index, i);
              }
            }
          });
        });
    }
  }
}

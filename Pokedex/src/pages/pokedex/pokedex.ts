import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PokedexproviderProvider} from "../../providers/pokedexprovider/pokedexprovider";
import {DetailsPage} from "../details/details";
import { Storage } from '@ionic/storage';

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
  private test = [];
  private filter: string;
  private amount: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public pokedexprovider : PokedexproviderProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('pokemon');
    this.filters.push("All", "Caught", "Uncaught");

    this.test.push('pikachu', 'squirtle', 'muk');
    storage.set('Caught', this.test);

    this.allPokemon();
  }

  // Haalt alle pokemon op en pusht die in de pokemon array
  allPokemon() {
    this.pokedexprovider.getPokemons()
      .subscribe(result => {
        for (var i = 0; i < 50; i++) {
          this.pokemons.push(result['results'][i]['name']);
        }
      });
  }

  // De zoek functie
  onInput(SearchedItem: any) {
    this.pokedexprovider.getPokemons()
      .subscribe(result => {
        this.pokemons = [];
        // We checken of
        if (SearchedItem.target.value == "") {
          this.amount = 50;
        } else {
          this.amount = 802;
        }
        for (var i = 0; i < this.amount; i++) {
          // We checken voor elke pokemon of het zoekresultaat ermeem matcht
          if (result['results'][i]['name'].indexOf(SearchedItem.target.value.toLowerCase()) >= 0) {
            this.pokemons.push(result['results'][i]['name']);
          }
        }
      });
  }

  // De endless scroll functie
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.pokedexprovider.getPokemons()
        .subscribe(result => {
          var oldAmount = this.pokemons.length;
          var newAmount = this.pokemons.length + 50;

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

  // Click functie die naar de detailpagina van een pokemon gaat
  itemTapped(selectedItem: any, selectedPokemon) {
    this.navCtrl.push(DetailsPage, {
      name: selectedPokemon
    });
  }

  // Filteren op pokemon
  filterPokemon() {
    this.pokemons = [];
    // Filteren op gevangen pokemon
    if (this.filter == "Caught") {
      this.pokedexprovider.getPokemons()
        .subscribe(result => {
          this.storage.get(this.filter).then((output) => {
            if (output != null) {
              for (var i = 0; i < output.length; i++) {
                for (var j = 0; j < 802; j++) {
                  if (result['results'][j]['name'] == output[i]) {
                    this.pokemons.push(result['results'][j]['name']);
                  }
                }
              }
            }
          });
        });
    }
    // Filteren op ongevangen pokemon
    else if (this.filter == "Uncaught") {
      this.pokedexprovider.getPokemons()
        .subscribe(result => {
          for (var i = 0; i < 802; i++) {
            this.pokemons.push(result['results'][i]['name']);
          }
          this.storage.get("Caught").then((output) => {
            if (output != null) {
              for (var j = 0; j < output.length; j++) {
                var index = this.pokemons.indexOf(output[j]);
                if (index > -1) {
                  this.pokemons.splice(index, 1);
                }
              }
            }
          });
        });
    }
    // Filteren op alle pokemon
    else if (this.filter == "All") {
      this.allPokemon();
    }
  }
}

import { Component } from '@angular/core';

import {PokedexPage} from "../pokedex/pokedex";
import {MapPage} from "../map/map";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = PokedexPage;
  tab2Root = MapPage;

  constructor() {

  }
}
